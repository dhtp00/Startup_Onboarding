// --- AUTO STORAGE MIGRATION FOR NEW DATASET ---
if (localStorage.getItem("COMPANIES") && (!localStorage.getItem("USERS")?.includes("20422754@onboard.com") || !localStorage.getItem("USERS")?.includes("0426298510@onboard.com") || localStorage.getItem("COMPANIES")?.includes("사티부스"))) {
  localStorage.removeItem("USERS"); // 강제 로그아웃만 유도하여 companies 선언부에서 머지가 이뤄지도록 함
}

// --- DEMO USER ACCOUNT DATA (Simulation of Supabase Auth) ---
let USERS = JSON.parse(localStorage.getItem("USERS")) || {
  "osy0922@hnu.kr": { role: "coach", name: "오세연 코치", companyId: null, password: "" },
  "20424601@onboard.com": { role: "startup", name: "박지훈 대표", companyId: 1, password: "", isFirstLogin: true },
  "20425162@onboard.com": { role: "startup", name: "신상호 대표", companyId: 2, password: "", isFirstLogin: true },
  "20418716@onboard.com": { role: "startup", name: "오영웅 대표", companyId: 3, password: "", isFirstLogin: true },
  "20420729@onboard.com": { role: "startup", name: "염준 대표", companyId: 4, password: "", isFirstLogin: true },
  "20429473@onboard.com": { role: "startup", name: "이준석 대표", companyId: 5, password: "", isFirstLogin: true },
  "20420909@onboard.com": { role: "startup", name: "최성환 대표", companyId: 6, password: "", isFirstLogin: true },
  "20417065@onboard.com": { role: "startup", name: "이서진 대표", companyId: 7, password: "", isFirstLogin: true },
  "20415562@onboard.com": { role: "startup", name: "이수빈 대표", companyId: 8, password: "", isFirstLogin: true },
  "20411989@onboard.com": { role: "startup", name: "정수민 대표", companyId: 9, password: "", isFirstLogin: true },
  "20417505@onboard.com": { role: "startup", name: "지세빈 대표", companyId: 10, password: "", isFirstLogin: true },
  "20426983@onboard.com": { role: "startup", name: "김영준 대표", companyId: 11, password: "", isFirstLogin: true },
  "20433275@onboard.com": { role: "startup", name: "이광록 대표", companyId: 12, password: "", isFirstLogin: true },
  "20430190@onboard.com": { role: "startup", name: "권태균 대표", companyId: 13, password: "", isFirstLogin: true },
  "20419158@onboard.com": { role: "startup", name: "신민준 대표", companyId: 14, password: "", isFirstLogin: true },
  "20427627@onboard.com": { role: "startup", name: "이남주 대표", companyId: 15, password: "", isFirstLogin: true },
  "20422754@onboard.com": { role: "startup", name: "Gupta 대표", companyId: 16, password: "", isFirstLogin: true },
  "20431435@onboard.com": { role: "startup", name: "이준원 대표", companyId: 17, password: "", isFirstLogin: true },
  "0426298510@onboard.com": { role: "startup", name: "오세연 대표", companyId: 18, password: "", isFirstLogin: true }
};

let currentUser = null; // Session storage

// --- MOCK DATA FOR ENTERPRISES ---
let defaultCompanies = [
  {
    id: 1,
    name: "주식회사 엑스알로보틱스",
    type: "초기 창업기업 (사업자 등록 후 1~3년 이하)",
    representative: "박지훈",
    repDesc: "박지훈 대표 (과제번호: 20424601)",
    invitationKey: "HN-XR-2026",
    establishmentDate: "2025-05-23",
    address: "",
    contact: "",
    corpType: "법인사업자",
    oneStopLink: "대기",
    surveyData: null,
    metrics: { sales: "0원 (대기)", employees: "대기", reStartup: "아니오" },
    budget: { status: "safe", checks: { m7: false, m8: false, m9: false, m10: false, m11: false, m12: false }, total: "50,000", execution: "0" },
    education: { hr: "대기", accounting: "대기", law: "대기", content: "노무, 세무 기본 과정 교육 대기 상태" },
    monitoringDoc: "미작성",
    coachingCount: 0,
    coachingLogs: [],
    chatMessages: []
  },
  {
    id: 2,
    name: "주식회사 메이스온",
    type: "예비 창업기업 (사업자 미등록)",
    representative: "신상호",
    repDesc: "신상호 대표 (과제번호: 20425162)",
    invitationKey: "HN-MAIS-2026",
    establishmentDate: "",
    address: "",
    contact: "",
    corpType: "예비창업자",
    oneStopLink: "대기",
    surveyData: null,
    metrics: { sales: "0원 (대기)", employees: "대기", reStartup: "아니오" },
    budget: { status: "safe", checks: { m7: false, m8: false, m9: false, m10: false, m11: false, m12: false }, total: "50,000", execution: "0" },
    education: { hr: "대기", accounting: "대기", law: "대기", content: "노무, 세무 기본 과정 교육 대기 상태" },
    monitoringDoc: "미작성",
    coachingCount: 0,
    coachingLogs: [],
    chatMessages: []
  },
  {
    id: 3,
    name: "에듀포인터",
    type: "예비 창업기업 (사업자 미등록)",
    representative: "오영웅",
    repDesc: "오영웅 대표 (과제번호: 20418716)",
    invitationKey: "HN-HERO-2026",
    establishmentDate: "",
    address: "",
    contact: "",
    corpType: "예비창업자",
    oneStopLink: "대기",
    surveyData: null,
    metrics: { sales: "0원 (대기)", employees: "대기", reStartup: "아니오" },
    budget: { status: "safe", checks: { m7: false, m8: false, m9: false, m10: false, m11: false, m12: false }, total: "50,000", execution: "0" },
    education: { hr: "대기", accounting: "대기", law: "대기", content: "노무, 세무 기본 과정 교육 대기 상태" },
    monitoringDoc: "미작성",
    coachingCount: 0,
    coachingLogs: [],
    chatMessages: []
  },
  {
    id: 4,
    name: "카고",
    type: "예비 창업기업 (사업자 미등록)",
    representative: "염준",
    repDesc: "염준 대표 (과제번호: 20420729)",
    invitationKey: "HN-CARGO-2026",
    establishmentDate: "",
    address: "",
    contact: "",
    corpType: "예비창업자",
    oneStopLink: "대기",
    surveyData: null,
    metrics: { sales: "0원 (대기)", employees: "대기", reStartup: "아니오" },
    budget: { status: "safe", checks: { m7: false, m8: false, m9: false, m10: false, m11: false, m12: false }, total: "50,000", execution: "0" },
    education: { hr: "대기", accounting: "대기", law: "대기", content: "노무, 세무 기본 과정 교육 대기 상태" },
    monitoringDoc: "미작성",
    coachingCount: 0,
    coachingLogs: [],
    chatMessages: []
  },
  {
    id: 5,
    name: "주식회사 쉘비빌",
    type: "초기 창업기업 (사업자 등록 후 1~3년 이하)",
    representative: "이준석",
    repDesc: "이준석 대표 (과제번호: 20429473)",
    invitationKey: "HN-SHELBY-2026",
    establishmentDate: "2025-05-22",
    address: "",
    contact: "",
    corpType: "법인사업자",
    oneStopLink: "대기",
    surveyData: null,
    metrics: { sales: "0원 (대기)", employees: "대기", reStartup: "아니오" },
    budget: { status: "safe", checks: { m7: false, m8: false, m9: false, m10: false, m11: false, m12: false }, total: "50,000", execution: "0" },
    education: { hr: "대기", accounting: "대기", law: "대기", content: "노무, 세무 기본 과정 교육 대기 상태" },
    monitoringDoc: "미작성",
    coachingCount: 0,
    coachingLogs: [],
    chatMessages: []
  },
  {
    id: 6,
    name: "앱스터",
    type: "예비 창업기업 (사업자 미등록)",
    representative: "최성환",
    repDesc: "최성환 대표 (과제번호: 20420909)",
    invitationKey: "HN-APPSTER-2026",
    establishmentDate: "",
    address: "",
    contact: "",
    corpType: "예비창업자",
    oneStopLink: "대기",
    surveyData: null,
    metrics: { sales: "0원 (대기)", employees: "대기", reStartup: "아니오" },
    budget: { status: "safe", checks: { m7: false, m8: false, m9: false, m10: false, m11: false, m12: false }, total: "50,000", execution: "0" },
    education: { hr: "대기", accounting: "대기", law: "대기", content: "노무, 세무 기본 과정 교육 대기 상태" },
    monitoringDoc: "미작성",
    coachingCount: 0,
    coachingLogs: [],
    chatMessages: []
  },
  {
    id: 7,
    name: "트랜지언트랩",
    type: "예비 창업기업 (사업자 미등록)",
    representative: "이서진",
    repDesc: "이서진 대표 (과제번호: 20417065)",
    invitationKey: "HN-TRANS-2026",
    establishmentDate: "",
    address: "",
    contact: "",
    corpType: "예비창업자",
    oneStopLink: "대기",
    surveyData: null,
    metrics: { sales: "0원 (대기)", employees: "대기", reStartup: "아니오" },
    budget: { status: "safe", checks: { m7: false, m8: false, m9: false, m10: false, m11: false, m12: false }, total: "50,000", execution: "0" },
    education: { hr: "대기", accounting: "대기", law: "대기", content: "노무, 세무 기본 과정 교육 대기 상태" },
    monitoringDoc: "미작성",
    coachingCount: 0,
    coachingLogs: [],
    chatMessages: []
  },
  {
    id: 8,
    name: "테리웰",
    type: "예비 창업기업 (사업자 미등록)",
    representative: "이수빈",
    repDesc: "이수빈 대표 (과제번호: 20415562)",
    invitationKey: "HN-TERI-2026",
    establishmentDate: "",
    address: "",
    contact: "",
    corpType: "예비창업자",
    oneStopLink: "대기",
    surveyData: null,
    metrics: { sales: "0원 (대기)", employees: "대기", reStartup: "아니오" },
    budget: { status: "safe", checks: { m7: false, m8: false, m9: false, m10: false, m11: false, m12: false }, total: "50,000", execution: "0" },
    education: { hr: "대기", accounting: "대기", law: "대기", content: "노무, 세무 기본 과정 교육 대기 상태" },
    monitoringDoc: "미작성",
    coachingCount: 0,
    coachingLogs: [],
    chatMessages: []
  },
  {
    id: 9,
    name: "주식회사 위노잇",
    type: "초기 창업기업 (사업자 등록 후 1~3년 이하)",
    representative: "정수민",
    repDesc: "정수민 대표 (과제번호: 20411989)",
    invitationKey: "HN-WINO-2026",
    establishmentDate: "2025-12-29",
    address: "",
    contact: "",
    corpType: "법인사업자",
    oneStopLink: "대기",
    surveyData: null,
    metrics: { sales: "0원 (대기)", employees: "대기", reStartup: "아니오" },
    budget: { status: "safe", checks: { m7: false, m8: false, m9: false, m10: false, m11: false, m12: false }, total: "50,000", execution: "0" },
    education: { hr: "대기", accounting: "대기", law: "대기", content: "노무, 세무 기본 과정 교육 대기 상태" },
    monitoringDoc: "미작성",
    coachingCount: 0,
    coachingLogs: [],
    chatMessages: []
  },
  {
    id: 10,
    name: "지담산업",
    type: "초기 창업기업 (사업자 등록 후 1~3년 이하)",
    representative: "지세빈",
    repDesc: "지세빈 대표 (과제번호: 20417505)",
    invitationKey: "HN-GIDAM-2026",
    establishmentDate: "2025-07-08",
    address: "",
    contact: "",
    corpType: "법인사업자",
    oneStopLink: "대기",
    surveyData: null,
    metrics: { sales: "0원 (대기)", employees: "대기", reStartup: "아니오" },
    budget: { status: "safe", checks: { m7: false, m8: false, m9: false, m10: false, m11: false, m12: false }, total: "50,000", execution: "0" },
    education: { hr: "대기", accounting: "대기", law: "대기", content: "노무, 세무 기본 과정 교육 대기 상태" },
    monitoringDoc: "미작성",
    coachingCount: 0,
    coachingLogs: [],
    chatMessages: []
  },
  {
    id: 11,
    name: "로컬웨이브",
    type: "초기 창업기업 (사업자 등록 후 1~3년 이하)",
    representative: "김영준",
    repDesc: "김영준 대표 (과제번호: 20426983)",
    invitationKey: "HN-LOCAL-2026",
    establishmentDate: "2026-01-16",
    address: "",
    contact: "",
    corpType: "법인사업자",
    oneStopLink: "대기",
    surveyData: null,
    metrics: { sales: "0원 (대기)", employees: "대기", reStartup: "아니오" },
    budget: { status: "safe", checks: { m7: false, m8: false, m9: false, m10: false, m11: false, m12: false }, total: "50,000", execution: "0" },
    education: { hr: "대기", accounting: "대기", law: "대기", content: "노무, 세무 기본 과정 교육 대기 상태" },
    monitoringDoc: "미작성",
    coachingCount: 0,
    coachingLogs: [],
    chatMessages: []
  },
  {
    id: 12,
    name: "매크로테라퓨틱스",
    type: "예비 창업기업 (사업자 미등록)",
    representative: "이광록",
    repDesc: "이광록 대표 (과제번호: 20433275)",
    invitationKey: "HN-GWANG-2026",
    establishmentDate: "",
    address: "",
    contact: "",
    corpType: "예비창업자",
    oneStopLink: "대기",
    surveyData: null,
    metrics: { sales: "0원 (대기)", employees: "대기", reStartup: "아니오" },
    budget: { status: "safe", checks: { m7: false, m8: false, m9: false, m10: false, m11: false, m12: false }, total: "50,000", execution: "0" },
    education: { hr: "대기", accounting: "대기", law: "대기", content: "노무, 세무 기본 과정 교육 대기 상태" },
    monitoringDoc: "미작성",
    coachingCount: 0,
    coachingLogs: [],
    chatMessages: []
  },
  {
    id: 13,
    name: "주식회사 소리",
    type: "초기 창업기업 (사업자 등록 후 1~3년 이하)",
    representative: "권태균",
    repDesc: "권태균 대표 (과제번호: 20430190)",
    invitationKey: "HN-SORI-2026",
    establishmentDate: "2025-08-01",
    address: "",
    contact: "",
    corpType: "법인사업자",
    oneStopLink: "대기",
    surveyData: null,
    metrics: { sales: "0원 (대기)", employees: "대기", reStartup: "아니오" },
    budget: { status: "safe", checks: { m7: false, m8: false, m9: false, m10: false, m11: false, m12: false }, total: "50,000", execution: "0" },
    education: { hr: "대기", accounting: "대기", law: "대기", content: "노무, 세무 기본 과정 교육 대기 상태" },
    monitoringDoc: "미작성",
    coachingCount: 0,
    coachingLogs: [],
    chatMessages: []
  },
  {
    id: 14,
    name: "주식회사 액트",
    type: "초기 창업기업 (사업자 등록 후 1~3년 이하)",
    representative: "신민준",
    repDesc: "신민준 대표 (과제번호: 20419158)",
    invitationKey: "HN-ACT-2026",
    establishmentDate: "2025-12-15",
    address: "",
    contact: "",
    corpType: "법인사업자",
    oneStopLink: "대기",
    surveyData: null,
    metrics: { sales: "0원 (대기)", employees: "대기", reStartup: "아니오" },
    budget: { status: "safe", checks: { m7: false, m8: false, m9: false, m10: false, m11: false, m12: false }, total: "50,000", execution: "0" },
    education: { hr: "대기", accounting: "대기", law: "대기", content: "노무, 세무 기본 과정 교육 대기 상태" },
    monitoringDoc: "미작성",
    coachingCount: 0,
    coachingLogs: [],
    chatMessages: []
  },
  {
    id: 15,
    name: "뉴로모먼트 주식회사",
    type: "초기 창업기업 (사업자 등록 후 1~3년 이하)",
    representative: "이남주",
    repDesc: "이남주 대표 (과제번호: 20427627)",
    invitationKey: "HN-NEURO-2026",
    establishmentDate: "2025-07-01",
    address: "",
    contact: "",
    corpType: "법인사업자",
    oneStopLink: "대기",
    surveyData: null,
    metrics: { sales: "0원 (대기)", employees: "대기", reStartup: "아니오" },
    budget: { status: "safe", checks: { m7: false, m8: false, m9: false, m10: false, m11: false, m12: false }, total: "50,000", execution: "0" },
    education: { hr: "대기", accounting: "대기", law: "대기", content: "노무, 세무 기본 과정 교육 대기 상태" },
    monitoringDoc: "미작성",
    coachingCount: 0,
    coachingLogs: [],
    chatMessages: []
  },
  {
    id: 16,
    name: "Dr.X",
    type: "초기 창업기업 (사업자 등록 후 1~3년 이하)",
    representative: "GUPTA AMAR PRASAD",
    repDesc: "Gupta 대표 (과제번호: 20422754)",
    invitationKey: "HN-DRX-2026",
    establishmentDate: "2025-09-12",
    address: "",
    contact: "",
    corpType: "법인사업자",
    oneStopLink: "대기",
    surveyData: null,
    metrics: { sales: "0원 (대기)", employees: "대기", reStartup: "아니오" },
    budget: { status: "safe", checks: { m7: false, m8: false, m9: false, m10: false, m11: false, m12: false }, total: "50,000", execution: "0" },
    education: { hr: "대기", accounting: "대기", law: "대기", content: "노무, 세무 기본 과정 교육 대기 상태" },
    monitoringDoc: "미작성",
    coachingCount: 0,
    coachingLogs: [],
    chatMessages: []
  },
  {
    id: 17,
    name: "주식회사 에이치엔로보틱스",
    type: "초기 창업기업 (사업자 등록 후 1~4년 이하)",
    representative: "이준원",
    repDesc: "이준원 대표 (과제번호: 20431435)",
    invitationKey: "HN-HNROBO-2026",
    establishmentDate: "2026-01-01",
    address: "",
    contact: "",
    corpType: "법인사업자",
    oneStopLink: "대기",
    surveyData: null,
    metrics: { sales: "0원 (대기)", employees: "대기", reStartup: "아니오" },
    budget: { status: "safe", checks: { m7: false, m8: false, m9: false, m10: false, m11: false, m12: false }, total: "50,000", execution: "0" },
    education: { hr: "대기", accounting: "대기", law: "대기", content: "노무, 세무 기본 과정 교육 대기 상태" },
    monitoringDoc: "미작성",
    coachingCount: 0,
    coachingLogs: [],
    chatMessages: []
  },
  {
    id: 18,
    name: "오세연",
    type: "초기 창업기업 (사업자 등록 후 1~4년 이하)",
    representative: "오세연",
    repDesc: "오세연 대표 (과제번호: 0426298510)",
    invitationKey: "HN-OSY-2026",
    establishmentDate: "2026-01-01",
    address: "대전광역시 대덕구 한남로 70",
    contact: "042-629-8510",
    corpType: "법인사업자",
    oneStopLink: "대기",
    surveyData: null,
    metrics: { sales: "0원 (대기)", employees: "대기", reStartup: "아니오" },
    budget: { status: "safe", checks: { m7: false, m8: false, m9: false, m10: false, m11: false, m12: false }, total: "50,000", execution: "0" },
    education: { hr: "대기", accounting: "대기", law: "대기", content: "노무, 세무 기본 과정 교육 대기 상태" },
    monitoringDoc: "미작성",
    coachingCount: 0,
    coachingLogs: [],
    chatMessages: []
  }
];

// --- HELPER FUNCTION TO MERGE OLD DATA INTO NEW SPEC ---
function mergeOldDataToDefault(oldCompanies, defaultCompanies) {
  if (!oldCompanies || !Array.isArray(oldCompanies)) return defaultCompanies;
  const migrated = JSON.parse(JSON.stringify(defaultCompanies));
  migrated.forEach(newC => {
    const oldC = oldCompanies.find(old => 
      old.name === newC.name || 
      old.representative === newC.representative ||
      (old.repDesc && newC.repDesc && old.repDesc.includes(newC.representative))
    );
    if (oldC) {
      newC.chatMessages = oldC.chatMessages || [];
      newC.coachingLogs = oldC.coachingLogs || [];
      newC.coachingCount = oldC.coachingCount || 0;
      newC.surveyData = oldC.surveyData || null;
      if (oldC.budget && oldC.budget.checks && newC.budget && newC.budget.checks) {
        Object.keys(newC.budget.checks).forEach(k => {
          if (oldC.budget.checks[k] !== undefined) newC.budget.checks[k] = oldC.budget.checks[k];
        });
      }
      if (oldC.education && newC.education) {
        newC.education.hr = oldC.education.hr || newC.education.hr;
        newC.education.accounting = oldC.education.accounting || newC.education.accounting;
        newC.education.law = oldC.education.law || newC.education.law;
        newC.education.content = oldC.education.content || newC.education.content;
      }
      if (oldC.metrics && newC.metrics) {
        newC.metrics.sales = oldC.metrics.sales || newC.metrics.sales;
        newC.metrics.employees = oldC.metrics.employees || newC.metrics.employees;
        newC.metrics.reStartup = oldC.metrics.reStartup || newC.metrics.reStartup;
      }
      newC.address = oldC.address || newC.address;
      newC.contact = oldC.contact || newC.contact;
      newC.oneStopLink = oldC.oneStopLink || newC.oneStopLink;
      newC.finalEvaluation = oldC.finalEvaluation || newC.finalEvaluation || "";
    }
  });
  return migrated;
}

let companies = JSON.parse(localStorage.getItem("COMPANIES")) || defaultCompanies;

// --- FORCE DATA RESET IF OLD DEMO DATA DETECTED ---
const hasOldDemoData = companies.some(c => c.name.includes("에이아이링크") || c.name.includes("사티부스") || c.name.includes("그린에스텍")) || companies.length < 18;
if (hasOldDemoData) {
  console.log("⚙️ 구식 데이터 감지: 기존 대화 내역 및 데이터를 보존하며 18개사 구조로 지능형 머지(Merge)를 실행합니다.");
  companies = mergeOldDataToDefault(companies, defaultCompanies);
  USERS = {
    "osy0922@hnu.kr": { role: "coach", name: "오세연 코치", companyId: null, password: "" },
    "20424601@onboard.com": { role: "startup", name: "박지훈 대표", companyId: 1, password: "", isFirstLogin: true },
    "20425162@onboard.com": { role: "startup", name: "신상호 대표", companyId: 2, password: "", isFirstLogin: true },
    "20418716@onboard.com": { role: "startup", name: "오영웅 대표", companyId: 3, password: "", isFirstLogin: true },
    "20420729@onboard.com": { role: "startup", name: "염준 대표", companyId: 4, password: "", isFirstLogin: true },
    "20429473@onboard.com": { role: "startup", name: "이준석 대표", companyId: 5, password: "", isFirstLogin: true },
    "20420909@onboard.com": { role: "startup", name: "최성환 대표", companyId: 6, password: "", isFirstLogin: true },
    "20417065@onboard.com": { role: "startup", name: "이서진 대표", companyId: 7, password: "", isFirstLogin: true },
    "20415562@onboard.com": { role: "startup", name: "이수빈 대표", companyId: 8, password: "", isFirstLogin: true },
    "20411989@onboard.com": { role: "startup", name: "정수민 대표", companyId: 9, password: "", isFirstLogin: true },
    "20417505@onboard.com": { role: "startup", name: "지세빈 대표", companyId: 10, password: "", isFirstLogin: true },
    "20426983@onboard.com": { role: "startup", name: "김영준 대표", companyId: 11, password: "", isFirstLogin: true },
    "20433275@onboard.com": { role: "startup", name: "이광록 대표", companyId: 12, password: "", isFirstLogin: true },
    "20430190@onboard.com": { role: "startup", name: "권태균 대표", companyId: 13, password: "", isFirstLogin: true },
    "20419158@onboard.com": { role: "startup", name: "신민준 대표", companyId: 14, password: "", isFirstLogin: true },
    "20427627@onboard.com": { role: "startup", name: "이남주 대표", companyId: 15, password: "", isFirstLogin: true },
    "20422754@onboard.com": { role: "startup", name: "Gupta 대표", companyId: 16, password: "", isFirstLogin: true },
    "20431435@onboard.com": { role: "startup", name: "이준원 대표", companyId: 17, password: "", isFirstLogin: true },
    "0426298510@onboard.com": { role: "startup", name: "오세연 대표", companyId: 18, password: "", isFirstLogin: true }
  };
  localStorage.setItem("COMPANIES", JSON.stringify(companies));
  localStorage.setItem("USERS", JSON.stringify(USERS));
}

// --- CONFIG DATA WITH LOCAL STORAGE & CLOUD DB ---
let coachName = localStorage.getItem("COACH_NAME") || "오세연 코치";
if (!coachName || coachName.includes("\uFFFD") || coachName.includes("?") || coachName.trim() === "" || coachName.includes("ġ") || coachName.includes("g")) {
  coachName = "오세연 코치";
  localStorage.setItem("COACH_NAME", "오세연 코치");
}

let defaultEduNames = {
  hr: "기본 노무 실무",
  accounting: "스타트업 회계/세무 기초",
  law: "창업 법률 및 계약서 검토"
};
let eduNames = JSON.parse(localStorage.getItem("EDU_NAMES")) || defaultEduNames;

let defaultNotices = [
  { type: "[공지]", date: "2026-06-18", title: "노무·세무 실무 드림비즈 필수 교육 동영상 강의 시청 기간 안내" },
  { type: "[안내]", date: "2026-06-10", title: "6월 오프라인 대면 네트워킹 데이 일정 및 수요 분야별 멘토링 신청 방법 안내" }
];
let notices = JSON.parse(localStorage.getItem("NOTICES")) || defaultNotices;

// MILESTONES
let defaultMilestones = [
  "<strong>1단계:</strong> 기업 사전 실태 및 교육 수요조사 완료 (26.6)",
  "<strong>2단계:</strong> 전담 코칭(멘토링/교육) 및 상시 피드백 운영 (진행중)",
  "<strong>3단계:</strong> 필수 3대 분야(노무, 회계, 법률) 교육 이수 달성 (진행중)",
  "<strong>4단계:</strong> 기업별 사업화 정착 모니터링 결과보고서 1건 필수 제출 (~27.1)"
];
let milestones = JSON.parse(localStorage.getItem("MILESTONES")) || defaultMilestones;

let selectedCompanyId = 1;
let currentAttachedFile = null;
let selectedReportType = "1st"; // "1st" (Mid-term) | "final" (Final)

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// --- GOOGLE SCRIPT URL FOR FREE API CONNECTION ---
// 여기에 깃허브 배포 가이드라인에 따라 복사한 구글 웹앱 URL을 입력하시면 실서비스 연동이 완료됩니다!
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwMO0h5m247mBUwTkt_yDWqxOKajOV7xMO5_lCiGUGZ-L1ivQFFxkwuMgqjLKEl_SBD/exec";

// --- DOM ELEMENTS ---
const loginOverlayScreen = document.getElementById("login-overlay-screen");
const cardLogin = document.getElementById("card-login");
const cardSignup = document.getElementById("card-signup");

const linkGoSignup = document.getElementById("link-go-signup");
const linkGoLogin = document.getElementById("link-go-login");

const loginForm = document.getElementById("login-form");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");

const signupForm = document.getElementById("signup-form");
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");
const signupKey = document.getElementById("signup-key");

const mainSidebar = document.getElementById("main-sidebar");
const mainContent = document.getElementById("main-content");
const userRoleBadge = document.getElementById("user-role-badge");
const userNameDisplay = document.getElementById("user-name-display");
const btnLogout = document.getElementById("btn-logout");

const menuDash = document.getElementById("menu-dash");
const menuChat = document.getElementById("menu-chat");
const menuEdu = document.getElementById("menu-edu");
const menuSurvey = document.getElementById("menu-survey");
const menuReport = document.getElementById("menu-report");
const menuStrategyReport = document.getElementById("menu-strategy-report"); // 신규 추가
const menuSetting = document.getElementById("menu-setting"); // 설정 추가

const sectionDash = document.getElementById("section-dash");
const sectionChat = document.getElementById("section-chat");
const sectionEdu = document.getElementById("section-edu");
const sectionSurvey = document.getElementById("section-survey");
const sectionReport = document.getElementById("section-report");
const sectionStrategyReport = document.getElementById("section-strategy-report"); // 신규 추가
const sectionSetting = document.getElementById("section-setting"); // 설정 추가
const surveyCompanySelect = document.getElementById("survey-company-select");
const surveyCompanySelectContainer = document.getElementById("survey-company-select-container");
const btnReport1st = document.getElementById("btn-report-1st");
const btnReportFinal = document.getElementById("btn-report-final");
const repFinalEvalSection = document.getElementById("rep-final-eval-section");
const repFinalEvalText = document.getElementById("rep-final-eval-text");
const reportCoachEvalInputContainer = document.getElementById("report-coach-eval-input-container");
const reportFinalEvalTextarea = document.getElementById("report-final-eval-textarea");
const btnSaveReportEval = document.getElementById("btn-save-report-eval");

const mainHeaderTitle = document.getElementById("main-header-title");

const companyTableBody = document.getElementById("company-table-body");
const educationTableBody = document.getElementById("education-table-body");
const chatCompanyList = document.getElementById("chat-company-list");
const chatMessagesContainer = document.getElementById("chat-messages-container");
const currentChatTitle = document.getElementById("current-chat-title");
const chatTextInput = document.getElementById("chat-text-input");
const btnSendMessage = document.getElementById("btn-send-message");
const btnArchiveChat = document.getElementById("btn-archive-chat");

// COACH MODAL
const coachModal = document.getElementById("coach-modal");
const modalCompanyTitle = document.getElementById("modal-company-title");
const modalCompanyId = document.getElementById("modal-company-id");
const coachLogForm = document.getElementById("coach-log-form");
const modalHistoryList = document.getElementById("modal-history-list");
const btnCloseModal = document.getElementById("btn-close-modal");
const btnCancelModal = document.getElementById("btn-cancel-modal");

// DETAIL MODAL
const detailModal = document.getElementById("detail-modal");
const detailCompanyTitle = document.getElementById("detail-company-title");
const btnCloseDetail = document.getElementById("btn-close-detail");
const btnCloseDetailFooter = document.getElementById("btn-close-detail-footer");

const dName = document.getElementById("detail-name");
const dType = document.getElementById("detail-type");
const dRep = document.getElementById("detail-representative");
const dRe = document.getElementById("detail-restartup");
const dSales = document.getElementById("detail-sales");
const dEmp = document.getElementById("detail-employees");
const dEstDate = document.getElementById("detail-est-date");
const dAddress = document.getElementById("detail-address");
const dOneStop = document.getElementById("detail-onestop");
const dKey = document.getElementById("detail-invitation-key");

const dBudgetChecks = document.getElementById("detail-budget-checks");
const dBudgetStatus = document.getElementById("detail-budget-status");

const dEduHr = document.getElementById("detail-edu-hr");
const dEduAcc = document.getElementById("detail-edu-accounting");
const dEduLaw = document.getElementById("detail-edu-law");

const dCombinedHistory = document.getElementById("detail-combined-history");

// BUTTONS
const btnAddCompany = document.getElementById("btn-add-company");
const btnEditMilestone = document.getElementById("btn-edit-milestone");
const milestoneListContainer = document.getElementById("milestone-list");

// Milestone Modal
const milestoneModal = document.getElementById("milestone-modal");
const milestoneForm = document.getElementById("milestone-form");
const btnCloseMilestone = document.getElementById("btn-close-milestone");
const btnCancelMilestone = document.getElementById("btn-cancel-milestone");

// Company Modal
const companyModal = document.getElementById("company-modal");
const companyModalTitle = document.getElementById("company-modal-title");
const companyForm = document.getElementById("company-form");
const companyEditId = document.getElementById("company-edit-id");
const btnCloseCompany = document.getElementById("btn-close-company");
const btnCancelCompany = document.getElementById("btn-cancel-company");
const btnGenKey = document.getElementById("btn-gen-key");
const btnDeleteCompanyModal = document.getElementById("btn-delete-company-modal");

// Education Edit Modal
const eduModal = document.getElementById("edu-modal");
const eduForm = document.getElementById("edu-form");
const eduModalCompanyId = document.getElementById("edu-modal-company-id");
const eduModalCompanyTitle = document.getElementById("edu-modal-company-title");
const btnCloseEdu = document.getElementById("btn-close-edu");
const btnCancelEdu = document.getElementById("btn-cancel-edu");

// Attachment
const chatFileInput = document.getElementById("chat-file-input");
const btnTriggerFile = document.getElementById("btn-trigger-file");
const attachmentPreviewArea = document.getElementById("attachment-preview-area");

// --- LOCAL STORAGE SYNC & GOOGLE SHEET BACKUP ---
let isSyncingCloud = false;

async function loadCloudData() {
  if (!GOOGLE_SCRIPT_URL) return;
  
  isSyncingCloud = true;
  const loadingStatus = document.getElementById("login-loading-status");
  const loginSubmitBtn = document.getElementById("btn-login-submit");
  
  if (loadingStatus) loadingStatus.style.display = "block";
  if (loginSubmitBtn) loginSubmitBtn.disabled = true;
  
  try {
    if (!currentUser) {
      isSyncingCloud = false;
      if (loadingStatus) loadingStatus.style.display = "none";
      if (loginSubmitBtn) loginSubmitBtn.disabled = false;
      return;
    }
    const email = currentUser.email || Object.keys(USERS).find(k => USERS[k].name === currentUser.name && USERS[k].companyId === currentUser.companyId);
    const password = currentUser.password;
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=loadData&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
      method: "GET",
      mode: "cors"
    });
    
    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }
    
    const resData = await response.json();
    if (resData && resData.status === "success" && resData.data) {
      const data = resData.data;
      
      const isCloudEmpty = !data.COMPANIES || data.COMPANIES.length === 0;
      const isCloudOld = data.COMPANIES && (data.COMPANIES.some(c => c.name.includes("에이아이링크") || c.name.includes("사티부스") || c.name.includes("그린에스텍")) || data.COMPANIES.length < 18);
      
      if (isCloudEmpty || isCloudOld) {
        console.log("⚙️ 클라우드 데이터가 구식입니다. 기존 데이터(대화/로그)를 새 18개사 명단으로 병합(Merge)하여 클라우드를 업데이트합니다.");
        companies = mergeOldDataToDefault(data.COMPANIES, defaultCompanies);
        USERS = {
          "osy0922@hnu.kr": { role: "coach", name: "오세연 코치", companyId: null, password: "" },
          "20424601@onboard.com": { role: "startup", name: "박지훈 대표", companyId: 1, password: "", isFirstLogin: true },
          "20425162@onboard.com": { role: "startup", name: "신상호 대표", companyId: 2, password: "", isFirstLogin: true },
          "20418716@onboard.com": { role: "startup", name: "오영웅 대표", companyId: 3, password: "", isFirstLogin: true },
          "20420729@onboard.com": { role: "startup", name: "염준 대표", companyId: 4, password: "", isFirstLogin: true },
          "20429473@onboard.com": { role: "startup", name: "이준석 대표", companyId: 5, password: "", isFirstLogin: true },
          "20420909@onboard.com": { role: "startup", name: "최성환 대표", companyId: 6, password: "", isFirstLogin: true },
          "20417065@onboard.com": { role: "startup", name: "이서진 대표", companyId: 7, password: "", isFirstLogin: true },
          "20415562@onboard.com": { role: "startup", name: "이수빈 대표", companyId: 8, password: "", isFirstLogin: true },
          "20411989@onboard.com": { role: "startup", name: "정수민 대표", companyId: 9, password: "", isFirstLogin: true },
          "20417505@onboard.com": { role: "startup", name: "지세빈 대표", companyId: 10, password: "", isFirstLogin: true },
          "20426983@onboard.com": { role: "startup", name: "김영준 대표", companyId: 11, password: "", isFirstLogin: true },
          "20433275@onboard.com": { role: "startup", name: "이광록 대표", companyId: 12, password: "", isFirstLogin: true },
          "20430190@onboard.com": { role: "startup", name: "권태균 대표", companyId: 13, password: "", isFirstLogin: true },
          "20419158@onboard.com": { role: "startup", name: "신민준 대표", companyId: 14, password: "", isFirstLogin: true },
          "20427627@onboard.com": { role: "startup", name: "이남주 대표", companyId: 15, password: "", isFirstLogin: true },
          "20422754@onboard.com": { role: "startup", name: "Gupta 대표", companyId: 16, password: "", isFirstLogin: true },
          "20431435@onboard.com": { role: "startup", name: "이준원 대표", companyId: 17, password: "", isFirstLogin: true },
          "0426298510@onboard.com": { role: "startup", name: "오세연 대표", companyId: 18, password: "", isFirstLogin: true }
        };
        localStorage.setItem("COMPANIES", JSON.stringify(companies));
        localStorage.setItem("USERS", JSON.stringify(USERS));
        saveToLocalStorage(); // Trigger syncData post to overwrite cloud!
      } else {
        if (data.USERS) {
          USERS = data.USERS;
          localStorage.setItem("USERS", JSON.stringify(USERS));
        }
        if (data.COMPANIES) {
          companies = data.COMPANIES;
          localStorage.setItem("COMPANIES", JSON.stringify(companies));
        }
        if (data.MILESTONES) {
          milestones = data.MILESTONES;
          localStorage.setItem("MILESTONES", JSON.stringify(milestones));
        }
        if (data.coachName) {
          coachName = data.coachName;
          localStorage.setItem("COACH_NAME", coachName);
        }
        if (data.eduNames) {
          eduNames = data.eduNames;
          localStorage.setItem("EDU_NAMES", JSON.stringify(eduNames));
        }
        if (data.notices) {
          notices = data.notices;
          localStorage.setItem("NOTICES", JSON.stringify(notices));
        }
      }
      console.log("☁️ 구글 스프레드시트 클라우드 데이터 동기화 완료.");
      // 불러온 데이터를 UI에 동적 바인딩하기 위해 필요한 렌더링 호출
      if (currentUser) {
        renderDashboard();
        renderMilestones();
        // Render current active tab content to keep UI updated in real-time
        const chatSection = document.getElementById("section-chat");
        if (chatSection && chatSection.classList.contains("active")) {
          renderChatSection();
        }
        const reportSection = document.getElementById("section-report");
        if (reportSection && reportSection.classList.contains("active")) {
          renderReportSection();
        }
      }
    }
  } catch (err) {
    console.error("❌ 클라우드 데이터 로딩 실패, 로컬 저장소 데이터를 유지합니다.", err);
  } finally {
    isSyncingCloud = false;
    if (loadingStatus) loadingStatus.style.display = "none";
    if (loginSubmitBtn) loginSubmitBtn.disabled = false;
  }
}

// 최초 구동 시 클라우드 동기화 개시 및 백그라운드 실시간 동기화 루프 작동
window.addEventListener("DOMContentLoaded", () => {
  loadCloudData();
  
  // 10초마다 백그라운드에서 실시간 클라우드 동기화 수행 (채팅 피드 실시간 반영용)
  setInterval(async () => {
    if (currentUser && !isSyncingCloud) {
      console.log("🔄 백그라운드 클라우드 데이터 실시간 동기화 중...");
      await loadCloudData();
    }
  }, 10000);
});

function saveToLocalStorage() {
  localStorage.setItem("COMPANIES", JSON.stringify(companies));
  localStorage.setItem("USERS", JSON.stringify(USERS));
  localStorage.setItem("MILESTONES", JSON.stringify(milestones));
  localStorage.setItem("COACH_NAME", coachName);
  localStorage.setItem("EDU_NAMES", JSON.stringify(eduNames));
  localStorage.setItem("NOTICES", JSON.stringify(notices));
  
  // 만약 구글 API 주소가 세팅되어 있다면 자동으로 백그라운드 클라우드 동기화 수행
  // 만약 구글 API 주소가 세팅되어 있고 로그인 상태라면 클라우드 동기화 수행
  if (GOOGLE_SCRIPT_URL && currentUser) {
    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        action: "syncData",
        email: currentUser.email || Object.keys(USERS).find(k => USERS[k].name === currentUser.name && USERS[k].companyId === currentUser.companyId),
        password: currentUser.password,
        companies: companies,
        USERS: USERS,
        milestones: milestones,
        coachName: coachName,
        eduNames: eduNames,
        notices: notices
      })
    })
    .then(r => r.json())
    .then(res => {
      if (res && res.status === "error") {
        console.warn("⚠️ 동기화 실패: ", res.message);
      } else {
        console.log("✔ 클라우드 동기화 성공");
      }
    })
    .catch(err => console.log("Google sync delay: ", err));
  }
}

// --- LOGIN/SIGNUP SCREEN TOGGLE ---
linkGoSignup.addEventListener("click", (e) => {
  e.preventDefault();
  cardLogin.style.display = "none";
  cardSignup.style.display = "block";
});

linkGoLogin.addEventListener("click", (e) => {
  e.preventDefault();
  cardSignup.style.display = "none";
  cardLogin.style.display = "block";
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const emailInput = loginEmail.value.trim();
  const password = loginPassword.value.trim();
  
  // 1. 입력값을 이메일 포맷으로 찾기
  let targetEmail = "";
  const matchedUserKey = Object.keys(USERS).find(key => {
    const u = USERS[key];
    if (u.role === "coach") {
      // 코치 계정은 이름 매칭 대상에서 제외 (이메일로만 로그인 허용)
      return (key.toLowerCase() === emailInput.toLowerCase()) ||
             (key.split("@")[0].toLowerCase() === emailInput.toLowerCase());
    } else {
      // 스타트업 계정은 대표자 실명 또는 이메일 매칭 허용
      return (key.toLowerCase() === emailInput.toLowerCase()) ||
             (key.split("@")[0].toLowerCase() === emailInput.toLowerCase()) ||
             (u.name.split(" ")[0] === emailInput) ||
             (u.name.replace(/\s+/g, "") === emailInput.replace(/\s+/g, ""));
    }
  });
  
  if (matchedUserKey) {
    targetEmail = matchedUserKey;
  } else {
    // USERS 매핑 테이블에 없는 경우 이메일 직접 입력으로 간주
    targetEmail = emailInput;
  }
  
  // 2. 구글 클라우드에 로그인 요청 & 데이터 로드 실행
  const loadingStatus = document.getElementById("login-loading-status");
  const loginSubmitBtn = document.getElementById("btn-login-submit");
  if (loadingStatus) loadingStatus.style.display = "block";
  if (loginSubmitBtn) loginSubmitBtn.disabled = true;
  
  try {
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=loadData&email=${encodeURIComponent(targetEmail)}&password=${encodeURIComponent(password)}`, {
      method: "GET",
      mode: "cors"
    });
    
    if (!response.ok) {
      throw new Error("서버 응답 오류 (HTTP " + response.status + ")");
    }
    
    const resData = await response.json();
    if (resData && resData.status === "success" && resData.data) {
      const data = resData.data;
      
      // 3. 로그인 성공 시 반환받은 필터링된 데이터셋 로컬에 적재
      companies = data.COMPANIES || [];
      milestones = data.milestones || [];
      coachName = data.coachName || "오세연 코치";
      eduNames = data.eduNames || eduNames;
      notices = data.notices || notices;
      
      // (중요) 서버에서 반환해준 내 프로필 정보로 로컬 USERS 정보 동기화 및 임시 비밀번호 세팅
      // (비밀번호 변경 요청을 위해 currentUser.password는 메모리에 임시 보관해야 함)
      const returnedUser = data.USERS[targetEmail];
      if (returnedUser) {
        currentUser = { ...returnedUser, password: password, email: targetEmail };
        USERS[targetEmail] = { ...returnedUser, password: password };
      } else {
        currentUser = { role: targetEmail.includes("osy0922") ? "coach" : "startup", name: "사용자", password: password, email: targetEmail };
      }
      
      localStorage.setItem("COMPANIES", JSON.stringify(companies));
      
      // 첫 로그인 패스워드 변경 확인
      if (currentUser.isFirstLogin) {
        if (loadingStatus) loadingStatus.style.display = "none";
        if (loginSubmitBtn) loginSubmitBtn.disabled = false;
        cardLogin.style.display = "none";
        document.getElementById("card-change-password").style.display = "block";
        return;
      }
      
      enterPlatform();
    } else {
      throw new Error(resData ? resData.message : "인증 실패");
    }
  } catch (err) {
    console.error(err);
    alert(`❌ 로그인 실패\n\n이유: ${err.message}\n\n로그인 문제가 지속될 경우 오세연 연구원(042-629-8510)으로 연락 바랍니다.`);
  } finally {
    if (loadingStatus) loadingStatus.style.display = "none";
    if (loginSubmitBtn) loginSubmitBtn.disabled = false;
  }
});

const changePasswordForm = document.getElementById("change-password-form");
if (changePasswordForm) {
  changePasswordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newPassword = document.getElementById("new-password").value.trim();
    const newPasswordConfirm = document.getElementById("new-password-confirm").value.trim();
    
    if (newPassword !== newPasswordConfirm) {
      alert("❌ 비밀번호가 일치하지 않습니다. 다시 입력해 주세요.");
      return;
    }
    
    const currentUserKey = currentUser.email || Object.keys(USERS).find(key => USERS[key].name === currentUser.name && USERS[key].companyId === currentUser.companyId);
    if (currentUserKey && USERS[currentUserKey]) {
      USERS[currentUserKey].password = newPassword;
      delete USERS[currentUserKey].isFirstLogin;
      
      currentUser = { ...USERS[currentUserKey], password: newPassword, email: currentUserKey };
      saveToLocalStorage();
      
      alert("🎉 비밀번호가 안전하게 변경되었습니다!");
      document.getElementById("card-change-password").style.display = "none";
      enterPlatform();
    } else {
      alert("❌ 사용자 정보를 찾을 수 없습니다.");
    }
  });
}

// --- SIGNUP ACTION ---
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const representativeName = signupEmail.value.trim();
  const password = signupPassword.value.trim();
  const keyInput = signupKey.value.trim().toUpperCase();

  const matchedCompany = companies.find(c => c.invitationKey === keyInput);

  if (!matchedCompany) {
    alert("❌ 유효하지 않은 가입 키입니다. 정세정 주임연구원에게 문의해 주세요.");
    return;
  }

  if (matchedCompany.representative !== representativeName) {
    alert(`❌ 회원가입 오류: 등록된 대표자명(${matchedCompany.representative})과 다릅니다.`);
    return;
  }

  const isKeyAlreadyUsed = Object.values(USERS).some(u => u.companyId === matchedCompany.id);
  if (isKeyAlreadyUsed) {
    alert("❌ 해당 가입 키는 이미 회원가입이 완료되었습니다.");
    return;
  }

  const accountEmail = `${representativeName.toLowerCase()}@onboard.com`;
  USERS[accountEmail] = {
    role: "startup",
    name: `${representativeName} 대표`,
    companyId: matchedCompany.id,
    password: password
  };

  currentUser = { ...USERS[accountEmail], password: password, email: accountEmail };
  saveToLocalStorage();
  
  alert(`🎉 회원가입이 완료되었습니다!\n이제 대표자명 '${representativeName}'으로 로그인 하실 수 있습니다.`);
  
  signupForm.reset();
  cardSignup.style.display = "none";
  cardLogin.style.display = "block";
  enterPlatform();
});

// ENTER PLATFORM
function enterPlatform() {
  loginOverlayScreen.style.display = "none";
  mainSidebar.style.display = "flex";
  mainContent.style.display = "flex";
  
  userNameDisplay.innerText = currentUser.name;
  
  if (currentUser.role === "coach") {
    userRoleBadge.innerText = "전담코치";
    userRoleBadge.className = "tag tag-early";
    btnAddCompany.style.display = "inline-block";
    btnEditMilestone.style.display = "inline-block";
    if (menuStrategyReport) menuStrategyReport.style.display = "block"; // 코치인 경우 노출
    if (menuSetting) menuSetting.style.display = "block";
    document.querySelectorAll(".coach-only-cell").forEach(c => c.style.display = "table-cell");
    selectedCompanyId = companies[0] ? companies[0].id : 1;
  } else {
    userRoleBadge.innerText = "스타트업";
    userRoleBadge.className = "tag tag-pre";
    btnAddCompany.style.display = "none";
    btnEditMilestone.style.display = "none";
    if (menuStrategyReport) menuStrategyReport.style.display = "none"; // 스타트업인 경우 비노출
    if (menuSetting) menuSetting.style.display = "none";
    document.querySelectorAll(".coach-only-cell").forEach(c => c.style.display = "none");
    selectedCompanyId = currentUser.companyId;
  }
  
  switchSection(sectionDash, menuDash);
  applyDynamicConfigs();
  renderDashboard();
  renderMilestones();
}

btnLogout.addEventListener("click", () => {
  currentUser = null;
  localStorage.removeItem("COMPANIES");
  localStorage.removeItem("USERS");
  loginOverlayScreen.style.display = "flex";
  mainSidebar.style.display = "none";
  mainContent.style.display = "none";
  loginForm.reset();
});
function renderNoticeBoard() {
  const container = document.getElementById("notice-board-container");
  if (!container) return;
  container.innerHTML = "";
  
  notices.forEach(notice => {
    const div = document.createElement("div");
    div.style.borderBottom = "1px solid var(--border-color)";
    div.style.paddingBottom = "8px";
    
    const isNotice = notice.type.includes("공지");
    const color = isNotice ? "var(--accent-color)" : "var(--text-secondary)";
    
    div.innerHTML = `
      <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 4px;">
        <strong style="color: ${color};">${notice.type}</strong>
        <span style="color: var(--text-secondary);">${notice.date}</span>
      </div>
      <p style="font-size: 0.8rem; color: var(--text-primary);">${notice.title}</p>
    `;
    container.appendChild(div);
  });
}

function applyDynamicConfigs() {
  // 대시보드 코치명 카드 변경
  const coachCard = document.querySelector(".summary-grid .card:first-child .card-value");
  if (coachCard) coachCard.innerText = coachName;

  // 교육 이수 탭의 3대 교육과목 테이블 헤더 명칭 동적화
  const eduHrTh = document.querySelector("#section-edu table th:nth-child(2)");
  const eduAccTh = document.querySelector("#section-edu table th:nth-child(3)");
  const eduLawTh = document.querySelector("#section-edu table th:nth-child(4)");
  if (eduHrTh) eduHrTh.innerText = eduNames.hr;
  if (eduAccTh) eduAccTh.innerText = eduNames.accounting;
  if (eduLawTh) eduLawTh.innerText = eduNames.law;

  // 모니터링 보고서 내의 교육 과목명 헤더 동적화
  const repEdu1 = document.getElementById("rep-hdr-edu1");
  const repEdu2 = document.getElementById("rep-hdr-edu2");
  const repEdu3 = document.getElementById("rep-hdr-edu3");
  if (repEdu1) repEdu1.innerText = eduNames.hr;
  if (repEdu2) repEdu2.innerText = eduNames.accounting;
  if (repEdu3) repEdu3.innerText = eduNames.law;

  // 상세조회 모달 내부의 교육 과목명 동적화
  const dEduHrLabel = document.querySelector("#detail-modal div:nth-child(3) div div:nth-child(1) div:first-child");
  const dEduAccLabel = document.querySelector("#detail-modal div:nth-child(3) div div:nth-child(2) div:first-child");
  const dEduLawLabel = document.querySelector("#detail-modal div:nth-child(3) div div:nth-child(3) div:first-child");
  if (dEduHrLabel) dEduHrLabel.innerText = eduNames.hr;
  if (dEduAccLabel) dEduAccLabel.innerText = eduNames.accounting;
  if (dEduLawLabel) dEduLawLabel.innerText = eduNames.law;

  // 모니터링 보고서 하단의 코치 작성자 이름 변경
  const repSubtitle = document.querySelector("#printable-report-area .report-header p");
  if (repSubtitle) {
    repSubtitle.innerHTML = `발행일자: <span id="report-print-date">-</span> | 작성자: 한남대 창업지원단 전담코치 ${coachName}`;
  }

  // 공지사항 렌더링
  renderNoticeBoard();
  refreshIcons();
}
function renderMilestones() {
  milestoneListContainer.innerHTML = "";
  milestones.forEach((step, idx) => {
    const li = document.createElement("li");
    let iconName = "check-circle-2";
    let color = "var(--success)";
    if (idx === 2) { iconName = "clock"; color = "var(--warning)"; }
    if (idx === 3) { iconName = "circle"; color = "var(--text-secondary)"; }
    li.style.cssText = "display: flex; align-items: center; gap: 10px;";
    li.innerHTML = `<i data-lucide="${iconName}" style="width: 16px; height: 16px; color: ${color}; flex-shrink: 0;"></i> ${step}`;
    milestoneListContainer.appendChild(li);
  });
  refreshIcons();
}

function getFilteredCompanies() {
  if (currentUser.role === "coach") {
    return companies;
  } else {
    return companies.filter(c => c.id === currentUser.companyId);
  }
}

// --- RENDER DASHBOARD (SIMPLIFIED VERSION) ---
function renderDashboard() {
  const filtered = getFilteredCompanies();

  const total = filtered.length;
  document.getElementById("stat-total-companies").innerText = `${total}개사`;
  
  const totalCoaching = filtered.reduce((acc, c) => acc + c.coachingCount, 0);
  const targetCoaching = total * 3;
  const rate = targetCoaching > 0 ? Math.round((totalCoaching / targetCoaching) * 100) : 0;
  document.getElementById("stat-coaching-rate").innerText = `${rate}%`;

  // Calculate Monthly Checkpoint Progress
  let totalChecks = 0;
  let activeChecks = 0;
  filtered.forEach(c => {
    Object.keys(c.budget.checks).forEach(k => {
      totalChecks++;
      if (c.budget.checks[k]) activeChecks++;
    });
  });
  const checkRate = totalChecks > 0 ? Math.round((activeChecks / totalChecks) * 100) : 0;
  document.getElementById("stat-doc-count").innerText = `${checkRate}%`;

  // Update training stats on Education sub-panel
  // Update training stats on Education sub-panel
  if (currentUser.role === "coach") {
    const totalEdu = companies.length;
    if (totalEdu > 0) {
      const hrCount = companies.filter(c => c.education.hr === "이수").length;
      const accCount = companies.filter(c => c.education.accounting === "이수").length;
      const lawCount = companies.filter(c => c.education.law === "이수").length;
      document.getElementById("edu-stat-hr").innerText = `${Math.round(hrCount / totalEdu * 100)}%`;
      document.getElementById("edu-stat-hr").nextElementSibling.innerText = `${totalEdu}개사 중 ${hrCount}개사 이수`;
      document.getElementById("edu-stat-acc").innerText = `${Math.round(accCount / totalEdu * 100)}%`;
      document.getElementById("edu-stat-acc").nextElementSibling.innerText = `${totalEdu}개사 중 ${accCount}개사 이수`;
      document.getElementById("edu-stat-law").innerText = `${Math.round(lawCount / totalEdu * 100)}%`;
      document.getElementById("edu-stat-law").nextElementSibling.innerText = `${totalEdu}개사 중 ${lawCount}개사 이수`;
    }
  } else {
    const myCompany = companies.find(c => c.id === currentUser.companyId);
    if (myCompany) {
      const hrFin = myCompany.education.hr === "이수";
      const accFin = myCompany.education.accounting === "이수";
      const lawFin = myCompany.education.law === "이수";
      
      document.getElementById("edu-stat-hr").innerText = hrFin ? "100%" : "0%";
      document.getElementById("edu-stat-hr").nextElementSibling.innerText = hrFin ? "이수 완료" : "교육 대기 (미이수)";
      
      document.getElementById("edu-stat-acc").innerText = accFin ? "100%" : "0%";
      document.getElementById("edu-stat-acc").nextElementSibling.innerText = accFin ? "이수 완료" : "교육 대기 (미이수)";
      
      document.getElementById("edu-stat-law").innerText = lawFin ? "100%" : "0%";
      document.getElementById("edu-stat-law").nextElementSibling.innerText = lawFin ? "이수 완료" : "교육 대기 (미이수)";
    }
  }

  // Render Table
  companyTableBody.innerHTML = "";
  filtered.forEach(company => {
    const isPre = company.type.includes("예비");
    const tr = document.createElement("tr");

    // Unified education check indicator
    const isEducationFinished = company.education.hr === "이수" && company.education.accounting === "이수" && company.education.law === "이수";
    const eduBadgeHTML = isEducationFinished 
      ? `<span class="tag tag-success"><i data-lucide="check-circle" style="width: 14px; height: 14px;"></i>이수 완료</span>` 
      : `<span class="tag tag-pre"><i data-lucide="clock" style="width: 14px; height: 14px;"></i>과정 진행중</span>`;

    // Monthly checklist circle badges (Coded iteratively)
    let checksHTML = `<div style="display:flex; gap: 4px; align-items:center;">`;
    const months = ["m7", "m8", "m9", "m10", "m11", "m12"];
    const monthLabels = ["7월", "8월", "9월", "10월", "11월", "12월"];

    months.forEach((m, idx) => {
      const isChecked = company.budget.checks[m];
      const color = isChecked ? "var(--success)" : "rgba(0,0,0,0.15)";
      const bg = isChecked ? "rgba(16,185,129,0.15)" : "transparent";
      const border = isChecked ? "1px solid var(--success)" : "1px solid rgba(0,0,0,0.15)";
      
      checksHTML += `
        <span 
          style="display:inline-block; font-size:0.7rem; padding: 2px 4px; border-radius:4px; border:${border}; background:${bg}; color:${color}; cursor:pointer;" 
          onclick="toggleMonthCheck(${company.id}, '${m}')"
          title="${monthLabels[idx]} 집행 점검">
          ${monthLabels[idx].replace("월", "")}
        </span>`;
    });
    checksHTML += `</div>`;

    tr.innerHTML = `
      <td><span class="company-name">${company.name}</span></td>
      <td><span class="tag ${isPre ? 'tag-pre' : 'tag-early'}">${company.type}</span></td>
      <td style="font-size: 0.85rem; color: var(--text-secondary);">${company.repDesc}</td>
      <td style="font-size: 0.82rem;">매출: ${company.metrics.sales}<br>고용: ${company.metrics.employees}</td>
      <td>${checksHTML}</td>
      <td>${eduBadgeHTML}</td>
      <td style="text-align: center; font-weight: 600;">${company.coachingCount}회</td>
      <td>
        <div style="display:flex; gap: 4px; align-items: center;">
          <button class="action-btn table-action-btn" onclick="openDetailModal(${company.id})" style="background-color: var(--bg-primary); display: flex; align-items: center; gap: 4px;"><i data-lucide="search" style="width: 12px; height: 12px;"></i>상세조회</button>
          <button class="action-btn table-action-btn" onclick="openCoachingModal(${company.id})" style="display: flex; align-items: center; gap: 4px;">
            ${currentUser.role === "coach" ? '<i data-lucide="edit-3" style="width: 12px; height: 12px;"></i>코칭등록' : '<i data-lucide="eye" style="width: 12px; height: 12px;"></i>내역보기'}
          </button>
          ${currentUser.role === "coach" ? `
            <button class="action-btn table-action-btn" onclick="openEditCompanyModal(${company.id})" style="border-color: var(--accent-color); color: var(--accent-color); display: flex; align-items: center; gap: 4px;"><i data-lucide="settings" style="width: 12px; height: 12px;"></i>수정</button>
          ` : ""}
        </div>
      </td>
    `;
    companyTableBody.appendChild(tr);
  });

  // Render Education Table
  educationTableBody.innerHTML = "";
  filtered.forEach(c => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="company-name">${c.name}</span></td>
      <td><span class="tag ${c.education.hr === '이수' ? 'tag-early' : 'tag-pre'}">${c.education.hr}</span></td>
      <td><span class="tag ${c.education.accounting === '이수' ? 'tag-early' : 'tag-pre'}">${c.education.accounting}</span></td>
      <td><span class="tag ${c.education.law === '이수' ? 'tag-early' : 'tag-pre'}">${c.education.law}</span></td>
      <td style="font-size: 0.85rem; color: var(--text-secondary);">${c.education.content}</td>
      ${currentUser.role === "coach" ? `
        <td class="coach-only-cell">
          <button class="action-btn" onclick="openEditEduModal(${c.id})" style="font-size: 0.75rem; display: flex; align-items: center; gap: 4px;"><i data-lucide="settings" style="width: 12px; height: 12px;"></i>변경</button>
        </td>
      ` : ""}
    `;
    educationTableBody.appendChild(tr);
  });
  refreshIcons();
}

// --- DELETE COMPANY (COACH ONLY) ---
window.deleteCompany = function(id) {
  if (currentUser.role !== "coach") {
    alert("기업 정보 삭제는 한남대 창업지원단 코치 계정만 가능합니다.");
    return;
  }
  const target = companies.find(c => c.id === id);
  if (!target) return;
  
  if (confirm(`⚠️ 정말로 '${target.name}' 기업을 삭제하시겠습니까?\n이 기업의 모든 데이터(채팅, 코칭록 등)가 영구 삭제됩니다.`)) {
    // 1. 기업 데이터 삭제
    companies = companies.filter(c => c.id !== id);
    
    // 2. 매칭되는 사용자 계정도 USERS에서 삭제
    const matchedUserKey = Object.keys(USERS).find(key => USERS[key].companyId === id);
    if (matchedUserKey) {
      delete USERS[matchedUserKey];
    }
    
    // 3. 로컬 및 구글 클라우드 저장
    saveToLocalStorage();
    
    // 4. 화면 갱신
    renderDashboard();
    alert(`정상적으로 삭제되었습니다.`);
  }
};

// --- INTERACTIVE MONTH CHECK TOGGLE (COACH ONLY) ---
window.toggleMonthCheck = function(companyId, monthKey) {
  if (currentUser.role !== "coach") {
    alert("월별 사업비 집행 점검은 한남대 창업지원단 코치 계정만 체크할 수 있습니다.");
    return;
  }
  const target = companies.find(c => c.id === companyId);
  if (target) {
    target.budget.checks[monthKey] = !target.budget.checks[monthKey];
    saveToLocalStorage();
    renderDashboard();
  }
};

// --- CHAT SYSTEM ---
function renderChatSection() {
  chatCompanyList.innerHTML = "";
  const filtered = getFilteredCompanies();
  
  filtered.forEach(c => {
    const div = document.createElement("div");
    div.className = `company-chat-item ${c.id === selectedCompanyId ? 'active' : ''}`;
    div.onclick = () => {
      selectedCompanyId = c.id;
      renderChatSection();
    };
    
    const lastMsg = c.chatMessages[c.chatMessages.length - 1] || { text: "등록된 대화가 없습니다.", time: "" };
    
    div.innerHTML = `
      <div class="chat-item-header">
        <span class="chat-item-name">${c.name}</span>
        <span class="chat-item-time">${lastMsg.time}</span>
      </div>
      <div class="chat-item-preview">${lastMsg.text}</div>
    `;
    chatCompanyList.appendChild(div);
  });

  // Load chat box
  const activeCompany = filtered.find(c => c.id === selectedCompanyId);
  if (activeCompany) {
    document.querySelector("#current-chat-title span").innerText = `${activeCompany.name} 소통 및 멘토링 채널 (전담코치: ${coachName})`;
    
    if (currentUser.role === "coach") {
      btnArchiveChat.style.display = "inline-block";
    } else {
      btnArchiveChat.style.display = "none";
    }

    chatMessagesContainer.innerHTML = "";
    activeCompany.chatMessages.forEach(msg => {
      const msgDiv = document.createElement("div");
      const isSentByCoach = msg.sender === "coach";
      
      const isMyMessage = (currentUser.role === "coach" && isSentByCoach) || (currentUser.role === "startup" && !isSentByCoach);
      msgDiv.className = `message ${isMyMessage ? 'sent' : 'received'}`;
      
      let textContentHTML = `<div class="message-bubble">${msg.text}</div>`;
      if (msg.file) {
        const isUrl = msg.file.data.startsWith("http://") || msg.file.data.startsWith("https://");
        const downloadAttr = isUrl ? "" : `download="${msg.file.name}"`;
        const targetAttr = isUrl ? 'target="_blank"' : "";
        textContentHTML = `
          <div class="message-bubble" style="display:flex; flex-direction:column; gap:4px;">
            <div>${msg.text}</div>
            <a href="${msg.file.data}" ${downloadAttr} ${targetAttr} class="chat-file-link" style="display: flex; align-items: center; gap: 6px;">
              <i data-lucide="file" style="width: 14px; height: 14px;"></i>
              <span>${msg.file.name} ${isUrl ? '(구글 드라이브)' : '(다운로드)'}</span>
            </a>
          </div>
        `;
      }

      msgDiv.innerHTML = `
        <span class="message-sender">${isSentByCoach ? coachName : `${activeCompany.name} ${activeCompany.representative} 대표`}</span>
        ${textContentHTML}
      `;
      chatMessagesContainer.appendChild(msgDiv);
    });
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    refreshIcons();
  } else {
    document.querySelector("#current-chat-title span").innerText = "선택된 대화 채널이 없거나 권한이 없습니다.";
    chatMessagesContainer.innerHTML = "";
    btnArchiveChat.style.display = "none";
  }
}

// --- FILE UPLOADER WITH GOOGLE SHEETS & DRIVE BACKUP INTEGRATION ---
btnTriggerFile.addEventListener("click", () => chatFileInput.click());
chatFileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    const rawData = evt.target.result;

    // 만약 구글 API 주소가 세팅되어 있다면 직접 구글 드라이브 무료 클라우드로 파일 업로드 수행
    if (GOOGLE_SCRIPT_URL) {
      attachmentPreviewArea.innerHTML = `<span class="attachment-pill" style="color:var(--warning);">⏳ Google Drive에 업로드 중...</span>`;
      
      fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          action: "uploadFile",
          fileName: file.name,
          fileType: file.type,
          fileData: rawData
        })
      })
      .then(response => response.json())
      .then((res) => {
        if (res && res.status === "success" && res.fileUrl) {
          currentAttachedFile = {
            name: file.name,
            type: file.type,
            data: res.fileUrl // 구글 드라이브 파일 링크 저장
          };
          attachmentPreviewArea.innerHTML = `
            <span class="attachment-pill" style="color:var(--success); display: flex; align-items: center; gap: 4px;">
              <i data-lucide="check-circle" style="width: 14px; height: 14px;"></i>
              Google Drive 연동 완료: ${file.name}
              <button type="button" class="attachment-remove" onclick="clearAttachment()">&times;</button>
            </span>
          `;
          refreshIcons();
        } else {
          throw new Error(res ? res.message : "응답 에러");
        }
      })
      .catch(err => {
        console.error("Google Drive connection failure: ", err);
        // Fallback to local storage base64
        currentAttachedFile = { name: file.name, type: file.type, data: rawData };
        attachmentPreviewArea.innerHTML = `
          <span class="attachment-pill" style="display: flex; align-items: center; gap: 4px;">
            <i data-lucide="paperclip" style="width: 14px; height: 14px;"></i>
            로컬 저장 완료: ${file.name}
            <button type="button" class="attachment-remove" onclick="clearAttachment()">&times;</button>
          </span>
        `;
        refreshIcons();
      });

    } else {
      // 로컬 스토리지 보관 모드
      currentAttachedFile = {
        name: file.name,
        type: file.type,
        data: rawData
      };
      attachmentPreviewArea.innerHTML = `
        <span class="attachment-pill" style="display: flex; align-items: center; gap: 4px;">
          <i data-lucide="paperclip" style="width: 14px; height: 14px;"></i>
          ${file.name}
          <button type="button" class="attachment-remove" onclick="clearAttachment()">&times;</button>
        </span>
      `;
      refreshIcons();
    }
  };
  reader.readAsDataURL(file);
});

window.clearAttachment = function() {
  currentAttachedFile = null;
  attachmentPreviewArea.innerHTML = "";
  chatFileInput.value = "";
};

// SEND MESSAGE
btnSendMessage.addEventListener("click", () => {
  const text = chatTextInput.value.trim();
  if (!text && !currentAttachedFile) return;

  const filtered = getFilteredCompanies();
  const activeCompany = filtered.find(c => c.id === selectedCompanyId);
  
  if (activeCompany) {
    let msgObj = {
      sender: currentUser.role,
      text: text || "파일을 첨부했습니다.",
      time: new Date().toLocaleTimeString("ko-KR", { hour: '2-digit', minute: '2-digit' })
    };

    if (currentAttachedFile) {
      msgObj.file = currentAttachedFile;
    }

    activeCompany.chatMessages.push(msgObj);
    chatTextInput.value = "";
    clearAttachment();
    saveToLocalStorage();
    renderChatSection();
  }
});

chatTextInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") btnSendMessage.click();
});

// ARCHIVE
btnArchiveChat.addEventListener("click", () => {
  if (currentUser.role !== "coach") return;

  const activeCompany = companies.find(c => c.id === selectedCompanyId);
  if (!activeCompany) return;

  const lastStartupMsg = [...activeCompany.chatMessages].reverse().find(msg => msg.sender === "startup");
  
  if (!lastStartupMsg) {
    alert("로그로 아카이빙할 창업기업의 문의 내역이 존재하지 않습니다.");
    return;
  }

  const archiveContent = `[상시채널 질의연동] 기업측 문의: "${lastStartupMsg.text}" 사항에 대해 비대면 답변 및 즉각 코칭 완료.`;
  
  activeCompany.coachingLogs.push({
    id: Date.now(),
    type: "멘토링",
    field: "BM고도화",
    date: new Date().toISOString().split('T')[0],
    content: archiveContent
  });
  activeCompany.coachingCount += 1;
  
  saveToLocalStorage();
  alert(`${activeCompany.name}의 질의응답이 성공적으로 코칭 로그로 아카이빙 되었습니다!`);
  renderDashboard();
});

// DETAIL MODAL
window.openDetailModal = function(id) {
  if (currentUser.role === "startup" && id !== currentUser.companyId) {
    alert("본인 기업 정보 이외에는 조회가 불가합니다.");
    return;
  }

  const activeCompany = companies.find(c => c.id === id);
  if (!activeCompany) return;

  dName.innerText = activeCompany.name;
  dType.innerText = activeCompany.type;
  dRep.innerText = activeCompany.representative;
  dRe.innerText = activeCompany.metrics.reStartup;
  dSales.innerText = activeCompany.metrics.sales;
  dEmp.innerText = activeCompany.metrics.employees;
  dEstDate.innerText = activeCompany.establishmentDate || "-";
  dAddress.innerText = activeCompany.address || "-";
  dOneStop.innerText = activeCompany.oneStopLink || "대기";
  dKey.innerText = activeCompany.invitationKey;

  // Format monthly check status lists
  let checkedMonthsStr = [];
  const monthLabels = ["5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
  const months = ["m5", "m6", "m7", "m8", "m9", "m10", "m11", "m12"];
  months.forEach((m, idx) => {
    if (activeCompany.budget.checks[m]) checkedMonthsStr.push(monthLabels[idx]);
  });
  dBudgetChecks.innerText = checkedMonthsStr.length > 0 ? checkedMonthsStr.join(", ") + " 점검완료" : "점검 내역 없음";
  dBudgetStatus.innerText = activeCompany.budget.status === "safe" ? "정상 집행" : (activeCompany.budget.status === "warn" ? "집행 지연" : "미집행 경고");

  dEduHr.innerText = activeCompany.education.hr;
  dEduAcc.innerText = activeCompany.education.accounting;
  dEduLaw.innerText = activeCompany.education.law;

  dCombinedHistory.innerHTML = "";
  if (activeCompany.coachingLogs.length === 0) {
    dCombinedHistory.innerHTML = `<p style="font-size: 0.8rem; color: var(--text-secondary); text-align: center; padding: 20px 0;">기록된 누적 피드백이 존재하지 않습니다.</p>`;
  } else {
    activeCompany.coachingLogs.forEach(log => {
      const isArchive = log.content.includes("[상시채널 질의연동]");
      const div = document.createElement("div");
      div.style.cssText = `background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); font-size: 0.8rem; box-shadow: 0 1px 3px rgba(0,0,0,0.02);`;
      
      const logBadge = isArchive 
        ? `<span class="tag tag-success" style="font-size: 0.7rem; padding: 2px 6px; margin-right: 6px;"><i data-lucide="message-square" style="width: 10px; height: 10px;"></i>소통로그 연동</span>`
        : `<span class="tag tag-early" style="font-size: 0.7rem; padding: 2px 6px; margin-right: 6px;"><i data-lucide="edit-3" style="width: 10px; height: 10px;"></i>코칭등록</span>`;

      div.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items: center; margin-bottom:6px; font-weight:600;">
          <div style="display: flex; align-items: center;">
            ${logBadge}
            <span style="color: var(--text-primary); font-size: 0.8rem; font-weight: 700;">${log.type} - ${log.field}</span>
          </div>
          <span style="color: var(--text-secondary); font-size:0.75rem;">${log.date}</span>
        </div>
        <div style="color: var(--text-primary); line-height: 1.4; padding-left: 4px;">${log.content}</div>
      `;
      dCombinedHistory.appendChild(div);
    });
  }

  detailModal.style.display = "flex";
  refreshIcons();
}

const closeDetailModal = () => detailModal.style.display = "none";
btnCloseDetail.addEventListener("click", closeDetailModal);
btnCloseDetailFooter.addEventListener("click", closeDetailModal);

// COACHING LOG
window.openCoachingModal = function(id) {
  if (currentUser.role === "startup" && id !== currentUser.companyId) {
    alert("본인 기업 정보 이외에는 조회가 불가합니다.");
    return;
  }

  const activeCompany = companies.find(c => c.id === id);
  if (!activeCompany) return;

  modalCompanyId.value = activeCompany.id;
  modalCompanyTitle.innerText = `${activeCompany.name} - 코칭 현황 & 이력 관리`;
  
  modalHistoryList.innerHTML = "";
  if (activeCompany.coachingLogs.length === 0) {
    modalHistoryList.innerHTML = `<p style="font-size: 0.8rem; color: var(--text-secondary);">등록된 코칭 이력이 없습니다.</p>`;
  } else {
    activeCompany.coachingLogs.forEach(log => {
      const div = document.createElement("div");
      div.style.cssText = "background: #f8fafc; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-color); font-size: 0.8rem; box-shadow: 0 1px 2px rgba(0,0,0,0.01);";
      div.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-weight:600;">
          <span style="display: flex; align-items: center; gap: 4px;"><i data-lucide="calendar" style="width: 12px; height: 12px; color: var(--accent-color);"></i>[${log.type} - ${log.field}] 코칭</span>
          <span style="color: var(--text-secondary); font-size:0.75rem;">${log.date}</span>
        </div>
        <div style="padding-top: 4px; color: var(--text-primary); line-height: 1.4;">${log.content}</div>
      `;
      modalHistoryList.appendChild(div);
    });
  }

  const formFields = coachLogForm.querySelectorAll(".form-group, button[type='submit']");
  if (currentUser.role === "startup") {
    formFields.forEach(f => f.style.display = "none");
  } else {
    formFields.forEach(f => f.style.display = "flex");
  }

  coachModal.style.display = "flex";
  refreshIcons();
}

function closeModal() {
  coachModal.style.display = "none";
  coachLogForm.reset();
}

btnCloseModal.addEventListener("click", closeModal);
btnCancelModal.addEventListener("click", closeModal);

coachLogForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (currentUser.role !== "coach") return;

  const cid = parseInt(modalCompanyId.value);
  const type = document.getElementById("coach-type").value;
  const field = document.getElementById("coach-field").value;
  const content = document.getElementById("coach-content").value;

  const targetCompany = companies.find(c => c.id === cid);
  if (targetCompany) {
    targetCompany.coachingLogs.push({
      id: Date.now(),
      type: type,
      field: field,
      date: new Date().toISOString().split('T')[0],
      content: content
    });
    targetCompany.coachingCount += 1;
    saveToLocalStorage();
    closeModal();
    renderDashboard();
  }
});

// MILESTONES EDIT
btnEditMilestone.addEventListener("click", () => {
  const strip = html => html.replace(/<[^>]*>/g, "");
  document.getElementById("ms-step1").value = strip(milestones[0] || "");
  document.getElementById("ms-step2").value = strip(milestones[1] || "");
  document.getElementById("ms-step3").value = strip(milestones[2] || "");
  document.getElementById("ms-step4").value = strip(milestones[3] || "");
  milestoneModal.style.display = "flex";
});

const closeMilestoneModal = () => milestoneModal.style.display = "none";
btnCloseMilestone.addEventListener("click", closeMilestoneModal);
btnCancelMilestone.addEventListener("click", closeMilestoneModal);

milestoneForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (currentUser.role !== "coach") return;

  milestones = [
    `<strong>1단계:</strong> ${document.getElementById("ms-step1").value}`,
    `<strong>2단계:</strong> ${document.getElementById("ms-step2").value}`,
    `<strong>3단계:</strong> ${document.getElementById("ms-step3").value}`,
    `<strong>4단계:</strong> ${document.getElementById("ms-step4").value}`
  ];

  saveToLocalStorage();
  closeMilestoneModal();
  renderMilestones();
});

// COMPANY CRUD
btnAddCompany.addEventListener("click", () => {
  companyForm.reset();
  companyEditId.value = "";
  companyModalTitle.innerText = "🏫 신규 창업기업 등록";
  
  const randNum = Math.floor(1000 + Math.random() * 9000);
  document.getElementById("c-key").value = `HN-NEW-${randNum}`;
  document.getElementById("c-password").value = "1234";

  if (btnDeleteCompanyModal) btnDeleteCompanyModal.style.display = "none";
  companyModal.style.display = "flex";
});

window.openEditCompanyModal = function(id) {
  const target = companies.find(c => c.id === id);
  if (!target) return;

  companyModalTitle.innerText = `⚙️ ${target.name} 정보 수정`;
  companyEditId.value = target.id;
  if (btnDeleteCompanyModal) btnDeleteCompanyModal.style.display = "inline-flex";

  document.getElementById("c-name").value = target.name;
  document.getElementById("c-type").value = target.type;
  document.getElementById("c-rep").value = target.representative;
  document.getElementById("c-rep-desc").value = target.repDesc;
  
  const matchedAccount = Object.keys(USERS).find(key => USERS[key].companyId === target.id);
  document.getElementById("c-password").value = matchedAccount ? USERS[matchedAccount].password : "1234";

  document.getElementById("c-key").value = target.invitationKey;
  document.getElementById("c-sales").value = target.metrics.sales;
  document.getElementById("c-emp").value = target.metrics.employees;
  document.getElementById("c-est-date").value = target.establishmentDate || "";
  document.getElementById("c-address").value = target.address || "";
  document.getElementById("c-contact").value = target.contact || "";
  document.getElementById("c-corp-type").value = target.corpType || "예비창업자";
  document.getElementById("c-restartup").value = target.metrics.reStartup;
  document.getElementById("c-onestop").value = target.oneStopLink || "";

  // Sync checkboxes for monthly checks
  document.getElementById("chk-m7").checked = target.budget.checks.m7;
  document.getElementById("chk-m8").checked = target.budget.checks.m8;
  document.getElementById("chk-m9").checked = target.budget.checks.m9;
  document.getElementById("chk-m10").checked = target.budget.checks.m10;
  document.getElementById("chk-m11").checked = target.budget.checks.m11;
  document.getElementById("chk-m12").checked = target.budget.checks.m12;

  document.getElementById("c-budget-status").value = target.budget.status;

  companyModal.style.display = "flex";
};

const closeCompanyModal = () => companyModal.style.display = "none";
btnCloseCompany.addEventListener("click", closeCompanyModal);
btnCancelCompany.addEventListener("click", closeCompanyModal);

if (btnDeleteCompanyModal) {
  btnDeleteCompanyModal.addEventListener("click", () => {
    const idVal = companyEditId.value;
    if (idVal) {
      const companyId = parseInt(idVal);
      closeCompanyModal();
      deleteCompany(companyId);
    }
  });
}

btnGenKey.addEventListener("click", () => {
  const randNum = Math.floor(1000 + Math.random() * 9000);
  document.getElementById("c-key").value = `HN-GEN-${randNum}`;
});

companyForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (currentUser.role !== "coach") return;

  const idVal = companyEditId.value;
  const name = document.getElementById("c-name").value;
  const type = document.getElementById("c-type").value;
  const representative = document.getElementById("c-rep").value;
  const repDesc = document.getElementById("c-rep-desc").value;
  const password = document.getElementById("c-password").value;
  const keyVal = document.getElementById("c-key").value.toUpperCase();
  const sales = document.getElementById("c-sales").value.trim() || "0원 (대기)";
  const emp = document.getElementById("c-emp").value.trim() || "대기";
  const estDate = document.getElementById("c-est-date").value.trim() || "";
  const address = document.getElementById("c-address").value.trim() || "";
  const contactVal = document.getElementById("c-contact").value.trim() || "";
  const corpTypeVal = document.getElementById("c-corp-type").value;
  const restartup = document.getElementById("c-restartup").value;
  const onestopVal = document.getElementById("c-onestop").value.trim() || "대기";

  const bStatus = document.getElementById("c-budget-status").value;

  const checks = {
    m7: document.getElementById("chk-m7").checked,
    m8: document.getElementById("chk-m8").checked,
    m9: document.getElementById("chk-m9").checked,
    m10: document.getElementById("chk-m10").checked,
    m11: document.getElementById("chk-m11").checked,
    m12: document.getElementById("chk-m12").checked
  };

  if (idVal) {
    const target = companies.find(c => c.id === parseInt(idVal));
    if (target) {
      target.name = name;
      target.type = type;
      target.representative = representative;
      target.repDesc = repDesc;
      target.invitationKey = keyVal;
      target.establishmentDate = estDate;
      target.address = address;
      target.contact = contactVal;
      target.corpType = corpTypeVal;
      target.oneStopLink = onestopVal;
      target.metrics = { sales: sales, employees: emp, reStartup: restartup };
      target.budget.status = bStatus;
      target.budget.checks = checks;

      const matchedAccountKey = Object.keys(USERS).find(k => USERS[k].companyId === target.id);
      if (matchedAccountKey) {
        USERS[matchedAccountKey].name = `${representative} 대표`;
        USERS[matchedAccountKey].password = password;
      }
    }
  } else {
    const newId = companies.length > 0 ? Math.max(...companies.map(c => c.id)) + 1 : 1;
    
    companies.push({
      id: newId,
      name: name,
      type: type,
      representative: representative,
      repDesc: repDesc,
      invitationKey: keyVal,
      establishmentDate: estDate,
      address: address,
      contact: contactVal,
      corpType: corpTypeVal,
      oneStopLink: onestopVal,
      surveyData: null,
      metrics: { sales: sales, employees: emp, reStartup: restartup },
      budget: { 
        status: bStatus, 
        checks: checks,
        total: "50,000", execution: "0" // safe fallbacks
      },
      education: { hr: "대기", accounting: "대기", law: "대기", content: "노무, 세무 기본 과정 교육 대기 상태" },
      monitoringDoc: "미작성",
      coachingCount: 0,
      coachingLogs: [],
      chatMessages: [
        { sender: "coach", text: "신규 매칭을 환영합니다. 초기 사업화 온보딩에 대한 문의를 남겨주세요.", time: "방금 전" }
      ]
    });

    const accountEmail = `${representative.toLowerCase()}@onboard.com`;
    USERS[accountEmail] = {
      role: "startup",
      name: `${representative} 대표`,
      companyId: newId,
      password: password
    };
  }

  saveToLocalStorage();
  closeCompanyModal();
  renderDashboard();
});

// EDUCATION EDIT
window.openEditEduModal = function(id) {
  const target = companies.find(c => c.id === id);
  if (!target) return;

  eduModalCompanyId.value = target.id;
  eduModalCompanyTitle.innerText = `${target.name} - 필수 교육 상태 수정`;

  document.getElementById("edu-hr").value = target.education.hr;
  document.getElementById("edu-acc").value = target.education.accounting;
  document.getElementById("edu-law").value = target.education.law;
  document.getElementById("edu-content").value = target.education.content;

  eduModal.style.display = "flex";
};

const closeEduModal = () => eduModal.style.display = "none";
btnCloseEdu.addEventListener("click", closeEduModal);
btnCancelEdu.addEventListener("click", closeEduModal);

eduForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (currentUser.role !== "coach") return;

  const id = parseInt(eduModalCompanyId.value);
  const target = companies.find(c => c.id === id);
  
  if (target) {
    target.education.hr = document.getElementById("edu-hr").value;
    target.education.accounting = document.getElementById("edu-acc").value;
    target.education.law = document.getElementById("edu-law").value;
    target.education.content = document.getElementById("edu-content").value;

    saveToLocalStorage();
    closeEduModal();
    renderDashboard();
  }
});

// --- SECTION SWITCHING & SIDEBAR MENU EVENT LISTENERS ---
function switchSection(targetSection, activeMenu) {
  [sectionDash, sectionChat, sectionEdu, sectionSurvey, sectionReport, sectionStrategyReport, sectionSetting].forEach(sec => {
    if (sec) sec.classList.remove("active");
  });
  [menuDash, menuChat, menuEdu, menuSurvey, menuReport, menuStrategyReport, menuSetting].forEach(menu => {
    if (menu) menu.classList.remove("active");
  });
  
  targetSection.classList.add("active");
  activeMenu.classList.add("active");

  if (targetSection === sectionDash) {
    mainHeaderTitle.innerText = "종합 대시보드";
    renderDashboard();
  } else if (targetSection === sectionChat) {
    mainHeaderTitle.innerText = "상시 소통 채널";
    renderChatSection();
  } else if (targetSection === sectionEdu) {
    mainHeaderTitle.innerText = "필수 교육 현황";
    renderDashboard();
  } else if (targetSection === sectionSurvey) {
    mainHeaderTitle.innerText = "기업 사전 조사";
    renderSurveySection();
  } else if (targetSection === sectionReport) {
    mainHeaderTitle.innerText = "모니터링 보고서";
    renderReportSection();
  } else if (targetSection === sectionStrategyReport) {
    mainHeaderTitle.innerText = "사전기업 조사 및 맞춤형 지원전략 수립 결과보고서";
    renderStrategyReportSection();
  } else if (targetSection === sectionSetting) {
    mainHeaderTitle.innerText = "플랫폼 환경설정 (관리자)";
    renderSettingSection();
  }
}

// SURVEY SECTION RENDERING & SUBMIT
function renderSurveySection() {
  const strategyContainer = document.getElementById("survey-strategy-container");
  const strategyTextarea = document.getElementById("sv-strategy");
  const submitBtn = document.getElementById("btn-submit-survey");
  const saveDraftBtn = document.getElementById("btn-save-draft");
  
  let targetCompany = null;
  if (currentUser.role === "coach") {
    if (surveyCompanySelectContainer) {
      surveyCompanySelectContainer.style.display = "flex";
    }
    if (surveyCompanySelect) {
      surveyCompanySelect.innerHTML = "";
      companies.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.innerText = c.name;
        if (c.id === selectedCompanyId) {
          opt.selected = true;
        }
        surveyCompanySelect.appendChild(opt);
      });
    }
    targetCompany = companies.find(c => c.id === selectedCompanyId) || companies[0];
    strategyContainer.style.display = "flex";
  } else {
    if (surveyCompanySelectContainer) {
      surveyCompanySelectContainer.style.display = "none";
    }
    targetCompany = companies.find(c => c.id === currentUser.companyId);
    strategyContainer.style.display = "flex";
  }

  if (!targetCompany) return;

  const allInputs = document.querySelectorAll("#survey-form-el input, #survey-form-el select, #survey-form-el textarea");
  
  if (currentUser.role === "coach") {
    // 코치는 스타트업 입력 정보를 수정할 수 없고 오직 육성 전략 수립 란만 수정할 수 있음
    allInputs.forEach(input => {
      if (input.id === "sv-strategy") {
        input.removeAttribute("readonly");
        input.disabled = false;
      } else {
        input.disabled = true;
      }
    });
    submitBtn.style.display = "inline-block";
    submitBtn.disabled = false;
    submitBtn.innerText = "💾 코치 맞춤형 전략 저장";
    if (saveDraftBtn) saveDraftBtn.style.display = "none";
    document.getElementById("survey-startup-info").innerHTML = `<strong>ℹ️ 안내(코치용):</strong> 해당 기업의 사전 실태조사 진단 결과를 분석하고 하단에 코치 맞춤형 지원 전략을 작성/수정해 주세요.`;
  } else {
    // 스타트업인 경우
    const isFinalSubmitted = targetCompany.surveyData && !targetCompany.surveyData.isDraft;
    if (isFinalSubmitted) {
      // 이미 최종 제출 완료했으면 모든 필드 비활성화 및 버튼 숨김
      allInputs.forEach(input => input.disabled = true);
      submitBtn.style.display = "none";
      if (saveDraftBtn) saveDraftBtn.style.display = "none";
      document.getElementById("survey-startup-info").innerHTML = `<strong>✔️ 안내:</strong> 사전 조사가 성공적으로 제출되었습니다. 제출 완료된 서식은 수정이 불가능합니다.`;
    } else {
      // 아직 미제출 또는 임시저장 상태면 작성 가능
      allInputs.forEach(input => {
        if (input.id === "sv-strategy") {
          input.disabled = true; // 코치 기재란은 작성 불가
        } else {
          input.disabled = false;
        }
      });
      submitBtn.style.display = "inline-block";
      submitBtn.disabled = false;
      submitBtn.innerText = "📝 사전 조사 답변 제출";
      if (saveDraftBtn) saveDraftBtn.style.display = "inline-block";
      document.getElementById("survey-startup-info").innerHTML = `<strong>ℹ️ 안내:</strong> 본 설문조사는 기업의 현재 역량을 정확하게 진단하고 맞춤형 성장 전략을 수립하기 위한 서식입니다. (작성 중 '임시 저장'이 가능합니다)`;
    }
  }

  // 기업명 및 대표자 실명 자동 연동
  document.getElementById("sv-company-name").value = targetCompany.name || "";
  document.getElementById("sv-representative").value = targetCompany.representative || "";

  // Pre-populate if survey data exists
  if (targetCompany.surveyData) {
    document.getElementById("sv-contact").value = targetCompany.surveyData.contact || targetCompany.contact || "";
    document.getElementById("sv-corp-type").value = targetCompany.surveyData.corpType || targetCompany.corpType || "예비창업자";
    document.getElementById("sv-est-date").value = targetCompany.surveyData.estDate || targetCompany.establishmentDate || "";
    document.getElementById("sv-address").value = targetCompany.surveyData.address || targetCompany.address || "";
    document.getElementById("sv-sales").value = targetCompany.surveyData.sales || "매출 미발생 (R&D, 기술 개발 및 제품 기획 단계)";
    document.getElementById("sv-employees").value = targetCompany.surveyData.employees || "0명 (단독 창업)";
    document.getElementById("sv-restartup").value = targetCompany.surveyData.reStartup || (targetCompany.metrics && targetCompany.metrics.reStartup) || "아니오";

    document.getElementById("sv-item-intro").value = targetCompany.surveyData.itemIntro || "";
    document.getElementById("sv-item-target").value = targetCompany.surveyData.itemTarget || "";
    document.getElementById("sv-item-model").value = targetCompany.surveyData.itemModel || "";

    document.getElementById("sv-market-target").value = targetCompany.surveyData.marketTarget || "";

    document.getElementById("sv-team-comp").value = targetCompany.surveyData.teamComp || "";
    document.getElementById("sv-team-core").value = targetCompany.surveyData.teamCore || "";
    document.getElementById("sv-team-needs").value = targetCompany.surveyData.teamNeeds || "";

    // 복수 선택 체크박스 바인딩
    const sourceStr = targetCompany.surveyData.financeSource || "";
    document.querySelectorAll("input[name='sv-finance-source-chk']").forEach(chk => {
      chk.checked = sourceStr.includes(chk.value);
    });

    document.getElementById("sv-finance-fixedcost").value = targetCompany.surveyData.financeFixedcost || "매월 연구원 급여, 임차료, 시제품 제작비 등 고정비 내역을 정기적으로 파악 중";
    document.getElementById("sv-finance-runway").value = targetCompany.surveyData.financeRunway || "3개월 ~ 6개월";

    document.getElementById("sv-need-pain").value = targetCompany.surveyData.needPain || "";
    document.getElementById("sv-need-goal").value = targetCompany.surveyData.needGoal || "";
    document.getElementById("sv-need-deliverable").value = targetCompany.surveyData.needDeliverable || "";
    document.getElementById("sv-edu-content").value = targetCompany.surveyData.eduContent || "";
    const eduMethodStr = targetCompany.surveyData.eduMethod || "";
    document.querySelectorAll("input[name='sv-edu-method-chk']").forEach(chk => {
      chk.checked = eduMethodStr.includes(chk.value);
    });
    strategyTextarea.value = targetCompany.surveyData.customStrategy || "";
  } else {
    // Fill basic details from existing profile
    document.getElementById("sv-contact").value = targetCompany.contact || "";
    document.getElementById("sv-corp-type").value = targetCompany.corpType || "예비창업자";
    document.getElementById("sv-est-date").value = targetCompany.establishmentDate || "";
    document.getElementById("sv-address").value = targetCompany.address || "";
    document.getElementById("sv-sales").value = "매출 미발생 (R&D, 기술 개발 및 제품 기획 단계)";
    document.getElementById("sv-employees").value = "0명 (단독 창업)";
    document.getElementById("sv-restartup").value = (targetCompany.metrics && targetCompany.metrics.reStartup) || "아니오";

    document.getElementById("sv-item-intro").value = "";
    document.getElementById("sv-item-target").value = "";
    document.getElementById("sv-item-model").value = "";

    document.getElementById("sv-market-target").value = "";

    document.getElementById("sv-team-comp").value = "";
    document.getElementById("sv-team-core").value = "";
    document.getElementById("sv-team-needs").value = "";

    // 복수 선택 체크박스 초기화
    document.querySelectorAll("input[name='sv-finance-source-chk']").forEach(chk => {
      chk.checked = false;
    });

    document.getElementById("sv-finance-fixedcost").value = "매월 연구원 급여, 임차료, 시제품 제작비 등 고정비 내역을 정기적으로 파악 중";
    document.getElementById("sv-finance-runway").value = "3개월 ~ 6개월";

    document.getElementById("sv-need-pain").value = "";
    document.getElementById("sv-need-goal").value = "";
    document.getElementById("sv-need-deliverable").value = "";
    document.getElementById("sv-edu-content").value = "";
    document.querySelectorAll("input[name='sv-edu-method-chk']").forEach(chk => {
      chk.checked = false;
    });
    strategyTextarea.value = "";
  }
  refreshIcons();
}

// Submit Survey Form Listener
document.getElementById("survey-form-el").addEventListener("submit", (e) => {
  e.preventDefault();
  
  let targetCompany = null;
  if (currentUser.role === "coach") {
    targetCompany = companies.find(c => c.id === selectedCompanyId) || companies[0];
  } else {
    targetCompany = companies.find(c => c.id === currentUser.companyId);
  }

  if (!targetCompany) return;

  const contact = document.getElementById("sv-contact").value;
  const corpType = document.getElementById("sv-corp-type").value;
  const estDate = document.getElementById("sv-est-date").value;
  const address = document.getElementById("sv-address").value;
  const sales = document.getElementById("sv-sales").value;
  const emp = document.getElementById("sv-employees").value;
  const restartup = document.getElementById("sv-restartup").value;

  const itemIntro = document.getElementById("sv-item-intro").value;
  const itemTarget = document.getElementById("sv-item-target").value;
  const itemModel = document.getElementById("sv-item-model").value;

  const marketTarget = document.getElementById("sv-market-target").value;

  const teamComp = document.getElementById("sv-team-comp").value;
  const teamCore = document.getElementById("sv-team-core").value;
  const teamNeeds = document.getElementById("sv-team-needs").value;

  // 체크박스 복수 선택 값을 쉼표로 병합
  const checkedSources = [];
  document.querySelectorAll("input[name='sv-finance-source-chk']:checked").forEach(chk => {
    checkedSources.push(chk.value);
  });
  const financeSource = checkedSources.join(", ") || "없음";

  const financeFixedcost = document.getElementById("sv-finance-fixedcost").value;
  const financeRunway = document.getElementById("sv-finance-runway").value;

  const needPain = document.getElementById("sv-need-pain").value;
  const needGoal = document.getElementById("sv-need-goal").value;
  const needDeliverable = document.getElementById("sv-need-deliverable").value;
  const eduContent = document.getElementById("sv-edu-content").value;
  const checkedEduMethods = [];
  document.querySelectorAll("input[name='sv-edu-method-chk']:checked").forEach(chk => {
    checkedEduMethods.push(chk.value);
  });
  const eduMethod = checkedEduMethods.join(", ") || "없음";
  const strategy = document.getElementById("sv-strategy").value;

  // Sync basic metrics to company model
  targetCompany.contact = contact;
  targetCompany.corpType = corpType;
  targetCompany.establishmentDate = estDate;
  targetCompany.address = address;
  targetCompany.metrics.sales = sales;
  targetCompany.metrics.employees = emp;
  targetCompany.metrics.reStartup = restartup;
  
  targetCompany.surveyData = {
    contact,
    corpType,
    estDate,
    address,
    sales,
    employees: emp,
    reStartup: restartup,
    itemIntro,
    itemTarget,
    itemModel,
    marketTarget,
    teamComp,
    teamCore,
    teamNeeds,
    financeSource,
    financeFixedcost,
    financeRunway,
    needPain,
    needGoal,
    needDeliverable,
    eduContent,
    eduMethod,
    customStrategy: strategy
  };

  saveToLocalStorage();

  // Send to Google Sheets (action: "submitSurvey")
  if (GOOGLE_SCRIPT_URL) {
    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "submitSurvey",
        companyId: targetCompany.id,
        companyName: targetCompany.name,
        representative: targetCompany.representative,
        contact: contact,
        corpType: corpType,
        estDate: estDate,
        address: address,
        sales: sales,
        employees: emp,
        reStartup: restartup,
        itemIntro: itemIntro,
        itemTarget: itemTarget,
        itemModel: itemModel,
        marketTarget: marketTarget,
        teamComp: teamComp,
        teamCore: teamCore,
        teamNeeds: teamNeeds,
        financeSource: financeSource,
        financeFixedcost: financeFixedcost,
        financeRunway: financeRunway,
        needPain: needPain,
        needGoal: needGoal,
        needDeliverable: needDeliverable,
        eduContent: eduContent,
        eduMethod: eduMethod,
        customStrategy: strategy
      })
    }).then(() => {
      alert("🎉 구글 스프레드시트 및 드라이브에 조사 데이터가 성공적으로 백업 연동되었습니다!");
    }).catch(err => {
      console.error("Google Sync error:", err);
      alert("💾 로컬 저장 완료 (구글 시트 연동 실패: 인터넷 상태를 확인해 주세요)");
    });
  } else {
    alert("💾 설문 결과가 로컬 스토리지에 안전하게 저장되었습니다!");
  }

  renderSurveySection();
});

// Save Survey Draft Listener
const btnSaveDraftEl = document.getElementById("btn-save-draft");
if (btnSaveDraftEl) {
  btnSaveDraftEl.addEventListener("click", () => {
    let targetCompany = null;
    if (currentUser.role === "coach") {
      targetCompany = companies.find(c => c.id === selectedCompanyId) || companies[0];
    } else {
      targetCompany = companies.find(c => c.id === currentUser.companyId);
    }

    if (!targetCompany) return;

    const contact = document.getElementById("sv-contact").value;
    const corpType = document.getElementById("sv-corp-type").value;
    const estDate = document.getElementById("sv-est-date").value;
    const address = document.getElementById("sv-address").value;
    const sales = document.getElementById("sv-sales").value;
    const emp = document.getElementById("sv-employees").value;
    const restartup = document.getElementById("sv-restartup").value;

    const itemIntro = document.getElementById("sv-item-intro").value;
    const itemTarget = document.getElementById("sv-item-target").value;
    const itemModel = document.getElementById("sv-item-model").value;

    const marketTarget = document.getElementById("sv-market-target").value;

    const teamComp = document.getElementById("sv-team-comp").value;
    const teamCore = document.getElementById("sv-team-core").value;
    const teamNeeds = document.getElementById("sv-team-needs").value;

    const checkedSources = [];
    document.querySelectorAll("input[name='sv-finance-source-chk']:checked").forEach(chk => {
      checkedSources.push(chk.value);
    });
    const financeSource = checkedSources.join(", ") || "없음";

    const financeFixedcost = document.getElementById("sv-finance-fixedcost").value;
    const financeRunway = document.getElementById("sv-finance-runway").value;

    const needPain = document.getElementById("sv-need-pain").value;
    const needGoal = document.getElementById("sv-need-goal").value;
    const needDeliverable = document.getElementById("sv-need-deliverable").value;
    const eduContent = document.getElementById("sv-edu-content").value;
    
    const checkedEduMethods = [];
    document.querySelectorAll("input[name='sv-edu-method-chk']:checked").forEach(chk => {
      checkedEduMethods.push(chk.value);
    });
    const eduMethod = checkedEduMethods.join(", ") || "없음";
    const strategy = document.getElementById("sv-strategy").value;

    // Save as draft
    targetCompany.surveyData = {
      isDraft: true,
      contact,
      corpType,
      estDate,
      address,
      sales,
      employees: emp,
      reStartup: restartup,
      itemIntro,
      itemTarget,
      itemModel,
      marketTarget,
      teamComp,
      teamCore,
      teamNeeds,
      financeSource,
      financeFixedcost,
      financeRunway,
      needPain,
      needGoal,
      needDeliverable,
      eduContent,
      eduMethod,
      customStrategy: strategy
    };

    saveToLocalStorage();
    alert("💾 사전 조사 내용이 임시 저장되었습니다!\n\n이제 페이지를 새로고침하거나 다른 탭으로 이동해도 작성 중인 내용이 그대로 복구됩니다.");
    renderSurveySection();
  });
}

// REPORT SECTION RENDERING
function renderReportSection() {
  const select = document.getElementById("report-company-select");
  select.innerHTML = "";
  
  if (typeof updateReportTabActiveStates === "function") {
    updateReportTabActiveStates();
  }
  const filtered = getFilteredCompanies();
  filtered.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.innerText = c.name;
    if (c.id === selectedCompanyId) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });

  const activeCompany = filtered.find(c => c.id === parseInt(select.value)) || filtered[0];
  if (!activeCompany) return;

  // Map values
  document.getElementById("report-print-date").innerText = new Date().toISOString().split('T')[0];
  document.getElementById("rep-comp-name").innerText = activeCompany.name;
  document.getElementById("rep-comp-type").innerText = activeCompany.corpType || activeCompany.type || "-";
  document.getElementById("rep-rep-name").innerText = activeCompany.representative;
  document.getElementById("rep-rep-contact").innerText = activeCompany.contact || "-";
  document.getElementById("rep-est-date").innerText = activeCompany.establishmentDate || "-";
  document.getElementById("rep-restartup").innerText = activeCompany.metrics.reStartup || "아니오";
  document.getElementById("rep-address").innerText = activeCompany.address || "-";
  
  document.getElementById("rep-sales").innerText = activeCompany.metrics.sales || "-";
  document.getElementById("rep-employees").innerText = activeCompany.metrics.employees || "-";
  document.getElementById("rep-onestop").innerText = activeCompany.oneStopLink || "대기";

  // Education
  document.getElementById("rep-edu-hr").innerText = activeCompany.education.hr;
  document.getElementById("rep-edu-acc").innerText = activeCompany.education.accounting;
  document.getElementById("rep-edu-law").innerText = activeCompany.education.law;
  document.getElementById("rep-edu-desc").innerText = activeCompany.education.content || "등록된 맞춤형 추천 강좌 및 학습 로그가 없습니다.";

  // Monthly Budget Checks - Dynamic based on report type
  let reportMonths = [];
  let reportMonthLabels = [];
  if (selectedReportType === "1st") {
    reportMonths = ["m7", "m8", "m9", "m10"];
    reportMonthLabels = ["7월", "8월", "9월", "10월"];
  } else {
    reportMonths = ["m7", "m8", "m9", "m10", "m11", "m12"];
    reportMonthLabels = ["7월", "8월", "9월", "10월", "11월", "12월"];
  }

  // Update budget table headers
  const budgetTableHead = document.querySelector("#section-report table:nth-of-type(4) thead tr");
  if (budgetTableHead) {
    budgetTableHead.innerHTML = reportMonthLabels.map(label => `<th>${label}</th>`).join("");
  }

  const budgetRow = document.getElementById("rep-budget-row");
  budgetRow.innerHTML = "";
  reportMonths.forEach(m => {
    const isChecked = activeCompany.budget.checks[m];
    const td = document.createElement("td");
    td.innerHTML = isChecked 
      ? `<span style="color: var(--success); font-weight: 700;">완료</span>` 
      : `<span style="color: var(--text-secondary); opacity: 0.5;">-</span>`;
    budgetRow.appendChild(td);
  });

  // Survey data
  if (activeCompany.surveyData) {
    const sv = activeCompany.surveyData;
    document.getElementById("rep-sv-intro").innerText = sv.itemIntro || "-";
    document.getElementById("rep-sv-target").innerText = sv.itemTarget || "-";
    document.getElementById("rep-sv-model").innerText = sv.itemModel || "-";
    document.getElementById("rep-sv-market-size").innerText = sv.marketTarget || "-";
    document.getElementById("rep-sv-team-comp").innerText = sv.teamComp || "-";
    document.getElementById("rep-sv-team-core").innerText = sv.teamCore || "-";
    document.getElementById("rep-sv-team-needs").innerText = sv.teamNeeds || "-";
    document.getElementById("rep-sv-runway").innerText = sv.financeRunway || "-";
    document.getElementById("rep-sv-funding").innerText = sv.financeSource || "-";
    document.getElementById("rep-sv-pains").innerText = sv.needPain || "-";
    document.getElementById("rep-sv-goals").innerText = sv.needGoal || "-";
    document.getElementById("rep-sv-deliverable").innerText = sv.needDeliverable || "-";
    document.getElementById("rep-sv-edu-content").innerText = sv.eduContent || "-";
    document.getElementById("rep-sv-edu-method").innerText = sv.eduMethod || "-";
    document.getElementById("rep-survey-strategy").innerText = sv.customStrategy || "코치 미작성 상태";
  } else {
    const emptyFields = [
      "rep-sv-intro", "rep-sv-target", "rep-sv-model",
      "rep-sv-market-size",
      "rep-sv-team-comp", "rep-sv-team-core", "rep-sv-team-needs",
      "rep-sv-runway", "rep-sv-funding", "rep-sv-pains", "rep-sv-goals",
      "rep-sv-deliverable", "rep-sv-edu-content", "rep-sv-edu-method"
    ];
    emptyFields.forEach(id => {
      document.getElementById(id).innerText = "사전조사 미제출";
    });
    document.getElementById("rep-survey-strategy").innerText = "사전조사 결과가 없어 맞춤형 지원 전략이 수립되지 않았습니다.";
  }

  // Coaching logs table - Filtered by date range
  const logsBody = document.getElementById("rep-coaching-logs-body");
  logsBody.innerHTML = "";

  // Filter logs based on date range
  let filteredLogs = activeCompany.coachingLogs || [];
  if (selectedReportType === "1st") {
    filteredLogs = (activeCompany.coachingLogs || []).filter(log => {
      return log.date >= "2026-07-01" && log.date <= "2026-10-31";
    });
  }

  if (filteredLogs.length === 0) {
    logsBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-secondary);">해당 기간의 밀착 코칭 및 상담 이력이 없습니다.</td></tr>`;
  } else {
    filteredLogs.forEach(log => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="text-align:center;">${log.date}</td>
        <td style="text-align:center;"><span class="tag tag-early">${log.type}</span></td>
        <td style="text-align:center; font-weight:600;">${log.field}</td>
        <td>${log.content}</td>
      `;
      logsBody.appendChild(tr);
    });
  }

  // Update report title dynamically
  const reportMainTitle = document.querySelector("#printable-report-area .report-header h2");
  if (reportMainTitle) {
    if (selectedReportType === "1st") {
      reportMainTitle.innerText = "창업기업별 중간 모니터링 결과보고서 (7~10월)";
    } else {
      reportMainTitle.innerText = "창업기업별 온보딩 및 모니터링 종합 결과보고서 (최종)";
    }
  }

  // Final Evaluation display and edit panel
  if (selectedReportType === "final") {
    if (repFinalEvalSection) repFinalEvalSection.style.display = "block";
    if (repFinalEvalText) repFinalEvalText.innerText = activeCompany.finalEvaluation || "전담코치 최종 종합평가 의견이 아직 기재되지 않았습니다.";
    
    if (currentUser.role === "coach") {
      if (reportCoachEvalInputContainer) reportCoachEvalInputContainer.style.display = "block";
      if (reportFinalEvalTextarea) reportFinalEvalTextarea.value = activeCompany.finalEvaluation || "";
    } else {
      if (reportCoachEvalInputContainer) reportCoachEvalInputContainer.style.display = "none";
    }
  } else {
    if (repFinalEvalSection) repFinalEvalSection.style.display = "none";
    if (reportCoachEvalInputContainer) reportCoachEvalInputContainer.style.display = "none";
  }
  refreshIcons();
}

// Dropdown Change listener in Report view
document.getElementById("report-company-select").addEventListener("change", (e) => {
  selectedCompanyId = parseInt(e.target.value);
  renderReportSection();
});

// Dropdown Change listener in Strategy Report view
const strategyReportCompanySelect = document.getElementById("strategy-report-company-select");
if (strategyReportCompanySelect) {
  strategyReportCompanySelect.addEventListener("change", (e) => {
    selectedCompanyId = parseInt(e.target.value);
    renderStrategyReportSection();
  });
}

// Print listener in Strategy Report view
const btnPrintStrategyReport = document.getElementById("btn-print-strategy-report");
if (btnPrintStrategyReport) {
  btnPrintStrategyReport.addEventListener("click", () => {
    window.print();
  });
}

// RENDER STRATEGY REPORT SECTION
function renderStrategyReportSection() {
  const select = document.getElementById("strategy-report-company-select");
  if (!select) return;

  select.innerHTML = "";
  const filtered = getFilteredCompanies();
  filtered.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.innerText = c.name;
    if (c.id === selectedCompanyId) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });

  const activeCompany = filtered.find(c => c.id === parseInt(select.value)) || filtered[0];
  if (!activeCompany) return;

  // Map values
  document.getElementById("strategy-report-print-date").innerText = new Date().toISOString().split('T')[0];
  document.getElementById("strategy-report-coach-name").innerText = coachName;

  document.getElementById("st-rep-comp-name").innerText = activeCompany.name;
  document.getElementById("st-rep-comp-type").innerText = activeCompany.corpType || activeCompany.type || "-";
  document.getElementById("st-rep-rep-name").innerText = activeCompany.representative;
  document.getElementById("st-rep-rep-contact").innerText = activeCompany.contact || "-";
  document.getElementById("st-rep-est-date").innerText = activeCompany.establishmentDate || "-";
  document.getElementById("st-rep-restartup").innerText = activeCompany.metrics.reStartup || "아니오";
  document.getElementById("st-rep-address").innerText = activeCompany.address || "-";

  // Survey data
  if (activeCompany.surveyData) {
    const sv = activeCompany.surveyData;
    document.getElementById("st-rep-sv-intro").innerText = sv.itemIntro || "-";
    document.getElementById("st-rep-sv-target").innerText = sv.itemTarget || "-";
    document.getElementById("st-rep-sv-model").innerText = sv.itemModel || "-";
    document.getElementById("st-rep-sv-market-size").innerText = sv.marketTarget || "-";
    document.getElementById("st-rep-sv-team-comp").innerText = sv.teamComp || "-";
    document.getElementById("st-rep-sv-team-core").innerText = sv.teamCore || "-";
    document.getElementById("st-rep-sv-team-needs").innerText = sv.teamNeeds || "-";
    document.getElementById("st-rep-sv-runway").innerText = sv.financeRunway || "-";
    document.getElementById("st-rep-sv-funding").innerText = sv.financeSource || "-";
    document.getElementById("st-rep-sv-pains").innerText = sv.needPain || "-";
    document.getElementById("st-rep-sv-goals").innerText = sv.needGoal || "-";
    document.getElementById("st-rep-sv-deliverable").innerText = sv.needDeliverable || "-";
    document.getElementById("st-rep-sv-edu-content").innerText = sv.eduContent || "-";
    document.getElementById("st-rep-sv-edu-method").innerText = sv.eduMethod || "-";
    document.getElementById("st-rep-survey-strategy").innerText = sv.customStrategy || "코치 미작성 상태";
  } else {
    const emptyFields = [
      "st-rep-sv-intro", "st-rep-sv-target", "st-rep-sv-model",
      "st-rep-sv-market-size",
      "st-rep-sv-team-comp", "st-rep-sv-team-core", "st-rep-sv-team-needs",
      "st-rep-sv-runway", "st-rep-sv-funding", "st-rep-sv-pains", "st-rep-sv-goals",
      "st-rep-sv-deliverable", "st-rep-sv-edu-content", "st-rep-sv-edu-method"
    ];
    emptyFields.forEach(id => {
      document.getElementById(id).innerText = "사전조사 미제출";
    });
    document.getElementById("st-rep-survey-strategy").innerText = "사전조사 결과가 없어 맞춤형 지원 전략이 수립되지 않았습니다.";
  }
  refreshIcons();
}

// Dropdown Change listener in Survey view
if (surveyCompanySelect) {
  surveyCompanySelect.addEventListener("change", (e) => {
    selectedCompanyId = parseInt(e.target.value);
    renderSurveySection();
  });
}

// Report type tab clicks
function updateReportTabActiveStates() {
  [btnReport1st, btnReportFinal].forEach(btn => {
    if (btn) btn.classList.remove("active");
  });
  if (selectedReportType === "1st" && btnReport1st) btnReport1st.classList.add("active");
  if (selectedReportType === "final" && btnReportFinal) btnReportFinal.classList.add("active");
}

if (btnReport1st) {
  btnReport1st.addEventListener("click", () => {
    selectedReportType = "1st";
    updateReportTabActiveStates();
    renderReportSection();
  });
}
if (btnReportFinal) {
  btnReportFinal.addEventListener("click", () => {
    selectedReportType = "final";
    updateReportTabActiveStates();
    renderReportSection();
  });
}

// Save Report Evaluation
if (btnSaveReportEval) {
  btnSaveReportEval.addEventListener("click", () => {
    if (currentUser.role !== "coach") return;
    const select = document.getElementById("report-company-select");
    const activeCompany = companies.find(c => c.id === parseInt(select.value)) || companies[0];
    if (activeCompany) {
      activeCompany.finalEvaluation = reportFinalEvalTextarea.value.trim();
      saveToLocalStorage();
      renderReportSection();
      alert(`🎉 ${activeCompany.name}의 최종 종합 평가가 구글 클라우드에 성공적으로 저장 및 동기화되었습니다!`);
    }
  });
}

// Print Button
document.getElementById("btn-print-report").addEventListener("click", () => {
  window.print();
});

// MENU CLICKS
menuDash.addEventListener("click", (e) => {
  e.preventDefault();
  switchSection(sectionDash, menuDash);
});

menuChat.addEventListener("click", (e) => {
  e.preventDefault();
  switchSection(sectionChat, menuChat);
});

menuEdu.addEventListener("click", (e) => {
  e.preventDefault();
  switchSection(sectionEdu, menuEdu);
});

menuSurvey.addEventListener("click", (e) => {
  e.preventDefault();
  switchSection(sectionSurvey, menuSurvey);
});

menuReport.addEventListener("click", (e) => {
  e.preventDefault();
  switchSection(sectionReport, menuReport);
});

if (menuStrategyReport) {
  menuStrategyReport.addEventListener("click", (e) => {
    e.preventDefault();
    switchSection(sectionStrategyReport, menuStrategyReport);
  });
}

if (menuSetting) {
  menuSetting.addEventListener("click", (e) => {
    e.preventDefault();
    switchSection(sectionSetting, menuSetting);
  });
}

// RENDER SETTING SECTION
function renderSettingSection() {
  document.getElementById("cfg-coach-name").value = coachName;
  document.getElementById("cfg-edu-hr").value = eduNames.hr;
  document.getElementById("cfg-edu-acc").value = eduNames.accounting;
  document.getElementById("cfg-edu-law").value = eduNames.law;
  
  const strip = html => html ? html.replace(/<[^>]*>/g, "").replace(/^\d+단계:\s*/, "") : "";
  document.getElementById("cfg-ms-step1").value = strip(milestones[0]);
  document.getElementById("cfg-ms-step2").value = strip(milestones[1]);
  document.getElementById("cfg-ms-step3").value = strip(milestones[2]);
  document.getElementById("cfg-ms-step4").value = strip(milestones[3]);
  
  renderConfigNoticeList();
}

function renderConfigNoticeList() {
  const list = document.getElementById("cfg-notice-list");
  if (!list) return;
  list.innerHTML = "";
  
  notices.forEach((notice, idx) => {
    const li = document.createElement("li");
    li.style.cssText = "display: flex; justify-content: space-between; align-items: center; background: #fff; padding: 8px 12px; border-radius: 6px; border: 1px solid var(--border-color);";
    li.innerHTML = `
      <div>
        <span style="font-weight: 700; color: ${notice.type.includes("공지") ? "var(--accent-color)" : "var(--text-secondary)"}; margin-right: 6px;">${notice.type}</span>
        <span style="color: var(--text-primary); font-weight: 500;">${notice.title}</span>
        <span style="color: var(--text-secondary); font-size: 0.75rem; margin-left: 8px;">(${notice.date})</span>
      </div>
      <button type="button" class="action-btn" onclick="deleteNotice(${idx})" style="padding: 2px 6px; background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.2); color: var(--danger); font-size: 0.72rem;">삭제</button>
    `;
    list.appendChild(li);
  });
}

window.deleteNotice = function(idx) {
  notices.splice(idx, 1);
  renderConfigNoticeList();
};

const btnAddNotice = document.getElementById("btn-add-notice");
if (btnAddNotice) {
  btnAddNotice.addEventListener("click", () => {
    const type = document.getElementById("cfg-notice-type").value;
    const titleInput = document.getElementById("cfg-notice-title");
    const title = titleInput.value.trim();
    
    if (!title) {
      alert("공지사항 제목을 입력해 주세요.");
      return;
    }
    
    const today = new Date().toISOString().split("T")[0];
    notices.unshift({
      type: type,
      title: title,
      date: today
    });
    
    titleInput.value = "";
    renderConfigNoticeList();
  });
}

const settingFormEl = document.getElementById("setting-form-el");
if (settingFormEl) {
  settingFormEl.addEventListener("submit", (e) => {
    e.preventDefault();
    if (currentUser.role !== "coach") return;
    
    // 값 반영
    coachName = document.getElementById("cfg-coach-name").value.trim();
    eduNames.hr = document.getElementById("cfg-edu-hr").value.trim();
    eduNames.accounting = document.getElementById("cfg-edu-acc").value.trim();
    eduNames.law = document.getElementById("cfg-edu-law").value.trim();
    
    milestones = [
      `<strong>1단계:</strong> ${document.getElementById("cfg-ms-step1").value.trim()}`,
      `<strong>2단계:</strong> ${document.getElementById("cfg-ms-step2").value.trim()}`,
      `<strong>3단계:</strong> ${document.getElementById("cfg-ms-step3").value.trim()}`,
      `<strong>4단계:</strong> ${document.getElementById("cfg-ms-step4").value.trim()}`
    ];
    
    // 저장 및 실시간 연동
    saveToLocalStorage();
    applyDynamicConfigs();
    
    alert("🎉 플랫폼 환경 설정이 구글 클라우드 데이터베이스에 실시간 저장 및 백업되었습니다!");
    switchSection(sectionDash, menuDash);
  });
}

// Initial Setup
renderMilestones();
applyDynamicConfigs();
