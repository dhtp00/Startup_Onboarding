(function () {
  let clientPromise;
  async function getClient() {
    if (!clientPromise) clientPromise = fetch("/api/config", { cache: "no-store" })
      .then(async response => {
        if (!response.ok) throw new Error("Supabase 설정이 완료되지 않았습니다.");
        const config = await response.json();
        return window.supabase.createClient(config.url, config.publishableKey, {
          auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
        });
      })
      .catch(error => {
        clientPromise = null;
        if (error && error.message === "Supabase 설정이 완료되지 않았습니다.") throw error;
        throw new Error("로그인 서버에 연결할 수 없습니다. Vercel 배포 및 Supabase 환경변수를 확인해 주세요.");
      });
    return clientPromise;
  }

  const normalizeEmail = value => value.includes("@") ? value : `${value}@onboard.com`;
  window.secureBackend = {
    async signIn(identifier, password) {
      const client = await getClient();
      const { error } = await client.auth.signInWithPassword({ email: normalizeEmail(identifier.trim()), password });
      if (error) throw error;
      return this.loadData();
    },
    async signOut() { const client = await getClient(); await client.auth.signOut(); },
    async updatePassword(password) {
      const client = await getClient();
      const { error } = await client.auth.updateUser({ password });
      if (error) throw error;
    },
    async signup(payload) {
      const response = await fetch("/api/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "회원가입에 실패했습니다.");
      return data;
    },
    async loadData() {
      const client = await getClient();
      const { data: authData } = await client.auth.getUser();
      if (!authData.user) return null;
      const [{ data: profile, error: profileError }, { data: companyRows, error: companyError }, { data: configRows }, { data: noticeRows }] = await Promise.all([
        client.from("profiles").select("id,email,role,name,company_id").eq("id", authData.user.id).single(),
        client.from("companies").select("id,data").order("id"),
        client.from("program_config").select("key,value"),
        client.from("notices").select("*").order("created_at", { ascending: false })
      ]);
      if (profileError) throw profileError;
      if (companyError) throw companyError;
      const config = Object.fromEntries((configRows || []).map(row => [row.key, row.value]));
      return {
        profile,
        companies: (companyRows || []).map(row => ({ ...row.data, id: row.id })),
        milestones: (noticeRows || []).filter(row => row.board === "program").map(row => row.payload),
        notices: (noticeRows || []).filter(row => row.board === "integrated").map(row => row.payload),
        coachName: config.coach_name || "전담코치",
        eduNames: config.edu_names || { hr: "1차 교육", accounting: "2차 교육", law: "3차 교육" }
      };
    },
    async saveState(companies, milestones, notices, coachName, eduNames) {
      const client = await getClient();
      const rows = companies.map(company => {
        const taskNumber = String(company.repDesc || "").match(/과제번호:\s*([^\)]+)/)?.[1]?.trim();
        return ({
        id: company.id,
        representative: company.representative || "-",
        login_email: company.loginEmail || (taskNumber ? `${taskNumber}@onboard.com` : `${company.id}@onboard.com`),
        invitation_key: company.invitationKey || `DISABLED-${company.id}`,
        data: company,
        updated_at: new Date().toISOString()
      });
      });
      const { error: companyError } = await client.from("companies").upsert(rows, { onConflict: "id" });
      if (companyError) throw companyError;
      const { data: authData } = await client.auth.getUser();
      const { data: profile } = await client.from("profiles").select("role").eq("id", authData.user.id).single();
      if (profile && profile.role === "coach") {
        const configRows = [
          { key: "coach_name", value: coachName, updated_at: new Date().toISOString() },
          { key: "edu_names", value: eduNames, updated_at: new Date().toISOString() }
        ];
        const { error: configError } = await client.from("program_config").upsert(configRows, { onConflict: "key" });
        if (configError) throw configError;
        const noticeRows = [
          ...milestones.map(item => ({ board: "program", payload: item })),
          ...notices.map(item => ({ board: "integrated", payload: item }))
        ];
        const { error: deleteError } = await client.from("notices").delete().in("board", ["program", "integrated"]);
        if (deleteError) throw deleteError;
        if (noticeRows.length) {
          const { error: noticeError } = await client.from("notices").insert(noticeRows);
          if (noticeError) throw noticeError;
        }
      }
    }
  };
})();
