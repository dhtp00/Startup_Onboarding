# GitHub → Vercel → Supabase 보안 배포

1. Supabase 새 프로젝트를 만든 뒤 SQL Editor에서 `supabase/schema.sql`을 실행합니다.
2. Authentication에서 코치 계정을 생성하고 `profiles`에 동일한 UUID로 `role='coach'` 프로필을 추가합니다.
3. 기존 기업 데이터는 `companies.data`에 넣되 비밀번호는 절대 저장하지 않습니다. `login_email`은 실제 Supabase Auth 로그인 이메일로 지정합니다.
4. Vercel 프로젝트의 Settings → Environment Variables에 다음 값을 등록합니다.
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (서버 전용, 브라우저 노출 금지)
5. GitHub 저장소를 Vercel에 연결하고 재배포합니다.
6. 기존 Google Apps Script 배포는 즉시 접근 중지/삭제하고, 노출됐던 모든 비밀번호를 Supabase Auth에서 새 비밀번호로 재설정합니다.

## 보안 원칙

- 비밀번호는 앱 데이터나 localStorage에 저장하지 않습니다.
- service role key는 `/api/signup`에서만 사용합니다.
- 기업 계정은 RLS에 의해 자기 회사 행만 조회·수정합니다.
- 코치 계정만 전체 기업, 공지, 환경설정을 관리합니다.
- `.env*`와 Vercel 환경변수 값은 GitHub에 커밋하지 않습니다.
