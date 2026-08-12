import { createClient } from "@supabase/supabase-js";

const json = (res, status, body) => {
  res.setHeader("Cache-Control", "no-store");
  return res.status(status).json(body);
};

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });
  const { representativeName, password, invitationKey } = req.body || {};
  if (!representativeName || !password || !invitationKey || password.length < 8) {
    return json(res, 400, { error: "대표자명, 8자 이상 비밀번호, 가입 키가 필요합니다." });
  }

  const admin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  const { data: company, error: companyError } = await admin
    .from("companies")
    .select("id, representative, login_email, invitation_key_used")
    .eq("invitation_key", String(invitationKey).trim().toUpperCase())
    .maybeSingle();
  if (companyError || !company) return json(res, 400, { error: "유효하지 않은 가입 키입니다." });
  if (company.invitation_key_used) return json(res, 409, { error: "이미 사용된 가입 키입니다." });
  if (company.representative.trim() !== String(representativeName).trim()) return json(res, 403, { error: "등록된 대표자명과 일치하지 않습니다." });

  const email = company.login_email;
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email, password, email_confirm: true,
    user_metadata: { role: "startup", company_id: company.id, name: `${company.representative} 대표` }
  });
  if (createError) return json(res, 400, { error: createError.message });

  const { error: profileError } = await admin.from("profiles").insert({
    id: created.user.id, email, role: "startup", name: `${company.representative} 대표`, company_id: company.id
  });
  if (profileError) {
    await admin.auth.admin.deleteUser(created.user.id);
    return json(res, 500, { error: "프로필 생성에 실패했습니다." });
  }
  await admin.from("companies").update({ invitation_key_used: true }).eq("id", company.id);
  return json(res, 201, { email });
}
