# SkillTwin — 스킬 온톨로지 인재관리 데모

성균관대 AI융합운영전공 학술연구 「스킬 온톨로지 기반 AI 인재관리 시스템 직원 수용성 연구」의 데모 사이트.
파나소닉 공장 디지털 트윈(팔란티어 파운드리)의 구조를 인사(HR)에 옮긴 시연입니다.

- **조직 대시보드**: 팀×스킬 히트맵, 단일 실패점 탐지, 선제 알림 피드
- **인재 프로필**: 직원별 스킬 프로필 + 온톨로지 그래프
- **시뮬레이션**: 퇴사 영향 what-if, 신규 AI 프로젝트 스킬 수요, 이직률 기반 12개월 인력 전망
- **수용성 진단(/survey)**: 연구 설문 25문항 → 수용 준비도 점수·유형·6요인 레이더 차트 즉시 제공, 동의 시 Supabase에 익명 저장 (구글폼과 문항 동일 — 이중 수집 채널)
- 직원·조직 데이터는 **전부 가상**, 업계 기준선만 공식 통계(고용노동부 사업체노동력조사) 사용

스택: **Next.js 14 (App Router) + Supabase(선택) + Vercel 배포**, 차트는 무의존 인라인 SVG.

---

## 로컬에서 실행

```bash
npm install
npm run dev   # http://localhost:3000
```

## 배포 순서 (GitHub → Vercel)

### 1. GitHub에 올리기 (설계 히스토리 저장창고)

1. GitHub 로그인 후 우측 상단 **+ → New repository** → 이름 `skill-twin-demo`, **Private** 권장 → Create
2. 터미널에서 이 폴더로 이동 후:

```bash
git init
git add .
git commit -m "SkillTwin 데모 초기 버전"
git branch -M main
git remote add origin https://github.com/<내아이디>/skill-twin-demo.git
git push -u origin main
```

이후 수정할 때마다 `git add . && git commit -m "변경 내용" && git push` — 이게 히스토리로 쌓입니다.

### 2. Vercel로 배포

1. https://vercel.com 가입 — **Continue with GitHub** 선택 (계정 연동이 한 번에 됨)
2. 대시보드에서 **Add New → Project**
3. 방금 만든 `skill-twin-demo` 저장소 옆 **Import** 클릭
4. Framework에 Next.js가 자동 감지됨 — 설정 그대로 **Deploy**
5. 1~2분 뒤 `https://skill-twin-demo-xxxx.vercel.app` 주소 발급 완료

이후 GitHub에 push할 때마다 **자동으로 재배포**됩니다. (이게 GitHub-Vercel 연동의 핵심)

### 3. (선택) KOSIS 실제 통계 연동

1. https://kosis.kr → 공유서비스(Open API) → 활용신청으로 인증키 발급
2. 사업체노동력조사 이직률 통계표에서 API URL 생성 (JSON 형식)
3. Vercel → 프로젝트 → **Settings → Environment Variables**에 추가:
   - `KOSIS_API_URL` = 생성한 전체 URL
4. Redeploy — 대시보드 기준선이 "폴백 예시값" 대신 "KOSIS 실시간"으로 바뀜

미설정 시 `lib/benchmarks.js`의 폴백 예시값이 쓰입니다. **폴백 값은 발표 전에 최신 공표치로 직접 갱신하세요.**

### 4. Supabase — 설문/진단 응답 저장 (설문 수집하려면 필수)

/survey의 응답을 저장하는 데 필요합니다. 미설정이어도 진단 결과 표시는 정상 동작하고, 저장만 건너뜁니다.

1. https://supabase.com 가입 → New project
2. SQL Editor에서 테이블 생성:

```sql
create table responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  channel text,
  consent boolean,
  demographics jsonb,
  answers jsonb,
  attention_passed boolean
);
alter table responses enable row level security;
create policy "insert only" on responses for insert with check (true);
```

3. Settings → API에서 URL과 anon key를 복사해 Vercel 환경변수에 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Redeploy 후 /survey 응답이 `responses` 테이블에 쌓입니다. 구글폼 응답과 합칠 때는 `channel` 컬럼(web)으로 구분하세요.

## 폴더 구조

```
app/
  page.js             랜딩 (스킬 온톨로지 소개)
  dashboard/          조직 대시보드 (히트맵·알림)
  people/             직원 목록 · [id] 프로필+퇴사 시뮬레이션
  simulation/         수요 예측 · 인력 전망 (클라이언트)
  survey/             수용성 진단 설문 (동의→기본정보→25문항→결과)
  api/benchmarks/     KOSIS 프록시 (폴백 내장)
  api/responses/      Supabase 응답 저장 (선택)
components/           Nav, 차트(SVG), 알림 피드
lib/data.js           가상 조직 데이터 + 시뮬레이션 로직
lib/benchmarks.js     공식 통계 기준선 (폴백 포함)
lib/survey.js         설문 문항·점수 로직 (구글폼 질문지와 동일 문구 유지 필수)
```

## 주의

- 발표·배포 시 "직원 데이터는 가상, 기준선만 공식 통계"임을 반드시 표기 (푸터에 이미 포함)
- 설문 데이터를 Supabase에 모을 경우 개인 식별 정보(이름·이메일·IP)는 저장하지 않을 것
