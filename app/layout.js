import "./globals.css";
import Nav from "@/components/Nav";

export const metadata = {
  title: "SkillTwin — 스킬 온톨로지 인재관리 데모",
  description:
    "스킬 온톨로지 기반 AI 인재관리 시스템 데모. 가상 조직 데이터로 스킬 현황, 퇴사 영향 시뮬레이션, 인력 전망을 시연합니다.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Nav />
        <main className="container">{children}</main>
        <div className="container">
          <p className="footer-note">
            본 사이트는 성균관대학교 AI융합운영전공 학술연구
            (스킬 온톨로지 기반 AI 인재관리 시스템 직원 수용성 연구)의 데모입니다.
            직원·조직 데이터는 전부 가상이며, 업계 기준선만 공식 통계(고용노동부
            사업체노동력조사 등)를 사용합니다.
          </p>
        </div>
      </body>
    </html>
  );
}
