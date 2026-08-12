const json = (res, status, body) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.status(status).json(body);
};

const requestSupabase = async (baseUrl, secretKey, path, options = {}) => {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      apikey: secretKey,
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (_) { data = { message: text }; }
  if (!response.ok) {
    const message = data?.message || data?.msg || data?.error_description || data?.error || `HTTP ${response.status}`;
    throw new Error(message);
  }
  return data;
};

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

    const baseUrl = String(process.env.SUPABASE_URL || "").replace(/\/$/, "");
    const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!baseUrl || !secretKey) {
      return json(res, 500, { error: "가입 서버의 Supabase 환경변수가 누락되었습니다." });
    }

    const { representativeName, password, invitationKey } = req.body || {};
    if (!representativeName || !password || !invitationKey || String(password).length < 8) {
      return json(res, 400, { error: "대표자명, 8자 이상 비밀번호, 가입 키가 필요합니다." });
    }

    const normalizedKey = String(invitationKey).trim().toUpperCase();
    const params = new URLSearchParams({
      select: "id,representative,login_email,invitation_key_used",
      invitation_key: `eq.${normalizedKey}`,
      limit: "1"
    });
    const companies = await requestSupabase(baseUrl, secretKey, `/rest/v1/companies?${params}`);
    const company = companies?.[0];
    if (!company) return json(res, 400, { error: "유효하지 않은 가입 키입니다." });
    if (company.invitation_key_used) return json(res, 409, { error: "이미 사용된 가입 키입니다." });
    if (String(company.representative).trim() !== String(representativeName).trim()) {
      return json(res, 403, { error: "등록된 대표자명과 일치하지 않습니다." });
    }

    const created = await requestSupabase(baseUrl, secretKey, "/auth/v1/admin/users", {
      method: "POST",
      body: JSON.stringify({
        email: company.login_email,
        password: String(password),
        email_confirm: true,
        user_metadata: { role: "startup", company_id: company.id, name: `${company.representative} 대표` }
      })
    });

    try {
      await requestSupabase(baseUrl, secretKey, "/rest/v1/profiles", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          id: created.id,
          email: company.login_email,
          role: "startup",
          name: `${company.representative} 대표`,
          company_id: company.id
        })
      });
    } catch (profileError) {
      await requestSupabase(baseUrl, secretKey, `/auth/v1/admin/users/${encodeURIComponent(created.id)}`, { method: "DELETE" }).catch(() => {});
      throw new Error(`프로필 생성 실패: ${profileError.message}`);
    }

    const companyFilter = new URLSearchParams({ id: `eq.${company.id}` });
    await requestSupabase(baseUrl, secretKey, `/rest/v1/companies?${companyFilter}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ invitation_key_used: true })
    });

    return json(res, 201, { email: company.login_email });
  } catch (error) {
    console.error("signup function error", error);
    return json(res, 500, { error: `가입 처리 실패: ${error?.message || "알 수 없는 서버 오류"}` });
  }
}
