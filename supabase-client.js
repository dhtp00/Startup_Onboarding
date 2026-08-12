(function () {
  let clientPromise;
  let lastSyncedState = null;
  const stableJson = value => JSON.stringify(value ?? null);
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

  // Users type the representative name; Supabase still authenticates with its internal email ID.
  const startupLoginEmails = {
    "박지훈": "20424601@onboard.com",
    "신상호": "20425162@onboard.com",
    "오영웅": "20418716@onboard.com",
    "염준": "20420729@onboard.com",
    "이준석": "20429473@onboard.com",
    "최성환": "20420909@onboard.com",
    "이서진": "20417065@onboard.com",
    "이수빈": "20415562@onboard.com",
    "정수민": "20411989@onboard.com",
    "지세빈": "20417505@onboard.com",
    "김영준": "20426983@onboard.com",
    "이광록": "20433275@onboard.com",
    "권태균": "20430190@onboard.com",
    "신민준": "20419158@onboard.com",
    "GUPTA AMAR PRASAD": "20422754@onboard.com",
    "이준원": "20431435@onboard.com",
    "오세연": "0426298510@onboard.com"
  };
  const normalizeEmail = value => {
    const identifier = String(value || "").trim();
    if (identifier.includes("@")) return identifier.toLowerCase();
    return startupLoginEmails[identifier] || startupLoginEmails[identifier.toUpperCase()] || `${identifier}@onboard.com`;
  };
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
      const responseText = await response.text();
      let data = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (_) {
        throw new Error(`가입 서버 오류 (${response.status}). Vercel Function 로그를 확인해 주세요.`);
      }
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
      const result = {
        profile,
        companies: (companyRows || []).map(row => ({ ...row.data, id: row.id })),
        milestones: (noticeRows || []).filter(row => row.board === "program").map(row => row.payload),
        notices: (noticeRows || []).filter(row => row.board === "integrated").map(row => row.payload),
        coachName: config.coach_name || "전담코치",
        eduNames: config.edu_names || { hr: "1차 교육", accounting: "2차 교육", law: "3차 교육" }
      };
      lastSyncedState = {
        companies: Object.fromEntries(result.companies.map(company => [String(company.id), stableJson(company)])),
        coachName: stableJson(result.coachName),
        eduNames: stableJson(result.eduNames),
        milestones: stableJson(result.milestones),
        notices: stableJson(result.notices)
      };
      return result;
    },
    async saveState(companies, milestones, notices, coachName, eduNames) {
      const client = await getClient();
      const { data: authData } = await client.auth.getUser();
      if (!authData.user) throw new Error("로그인 세션이 만료되었습니다.");
      const { data: profile, error: profileError } = await client
        .from("profiles")
        .select("role,company_id")
        .eq("id", authData.user.id)
        .single();
      if (profileError || !profile) throw profileError || new Error("사용자 프로필을 찾을 수 없습니다.");

      if (profile.role === "coach") {
        const changedCompanies = companies.filter(company => !lastSyncedState || lastSyncedState.companies[String(company.id)] !== stableJson(company));
        for (const company of changedCompanies) {
          const taskNumber = String(company.repDesc || "").match(/과제번호:\s*([^\)]+)/)?.[1]?.trim();
          const { data: updatedRows, error: updateError } = await client
            .from("companies")
            .update({ data: company, updated_at: new Date().toISOString() })
            .eq("id", company.id)
            .select("id");
          if (updateError) throw new Error(`기업 데이터 저장 실패: ${updateError.message}`);
          if (!updatedRows || updatedRows.length === 0) {
            const { error: insertError } = await client.from("companies").insert({
              id: company.id,
              representative: company.representative || "-",
              login_email: company.loginEmail || (taskNumber ? `${taskNumber}@onboard.com` : `${company.id}@onboard.com`),
              invitation_key: company.invitationKey || `DISABLED-${company.id}`,
              data: company,
              updated_at: new Date().toISOString()
            });
            if (insertError) throw new Error(`신규 기업 저장 실패: ${insertError.message}`);
          }
          if (lastSyncedState) lastSyncedState.companies[String(company.id)] = stableJson(company);
        }
      } else {
        const ownCompany = companies.find(company => Number(company.id) === Number(profile.company_id));
        if (!ownCompany) throw new Error("연결된 기업 정보를 찾을 수 없습니다.");
        const { error: companyError } = await client
          .from("companies")
          .update({ data: ownCompany, updated_at: new Date().toISOString() })
          .eq("id", profile.company_id);
        if (companyError) throw new Error(`기업 데이터 저장 실패: ${companyError.message}`);
        if (lastSyncedState) lastSyncedState.companies[String(ownCompany.id)] = stableJson(ownCompany);
      }

      if (profile && profile.role === "coach") {
        const configChanged = !lastSyncedState || lastSyncedState.coachName !== stableJson(coachName) || lastSyncedState.eduNames !== stableJson(eduNames);
        if (configChanged) {
          const configRows = [
            { key: "coach_name", value: coachName, updated_at: new Date().toISOString() },
            { key: "edu_names", value: eduNames, updated_at: new Date().toISOString() }
          ];
          const { error: configError } = await client.from("program_config").upsert(configRows, { onConflict: "key" });
          if (configError) throw new Error(`환경설정 저장 실패: ${configError.message}`);
          if (lastSyncedState) {
            lastSyncedState.coachName = stableJson(coachName);
            lastSyncedState.eduNames = stableJson(eduNames);
          }
        }
        const noticesChanged = !lastSyncedState || lastSyncedState.milestones !== stableJson(milestones) || lastSyncedState.notices !== stableJson(notices);
        if (noticesChanged) {
          const noticeRows = [
            ...milestones.map(item => ({ board: "program", payload: item })),
            ...notices.map(item => ({ board: "integrated", payload: item }))
          ];
          const { error: deleteError } = await client.from("notices").delete().in("board", ["program", "integrated"]);
          if (deleteError) throw new Error(`공지사항 기존 데이터 정리 실패: ${deleteError.message}`);
          if (noticeRows.length) {
            const { error: noticeError } = await client.from("notices").insert(noticeRows);
            if (noticeError) throw new Error(`공지사항 저장 실패: ${noticeError.message}`);
          }
          if (lastSyncedState) {
            lastSyncedState.milestones = stableJson(milestones);
            lastSyncedState.notices = stableJson(notices);
          }
        }
      }
    }
  };
})();
