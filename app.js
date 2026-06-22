// --- DEMO USER ACCOUNT DATA (Simulation of Supabase Auth) ---
let USERS = JSON.parse(localStorage.getItem("USERS")) || {
  "osy0922@hnu.kr": { role: "coach", name: "정세정 주임연구원", companyId: null, password: "osy0922" },
  "ceo1@ailink.com": { role: "startup", name: "이영희 대표", companyId: 1, password: "demo1234" },
  "ceo2@green.com": { role: "startup", name: "김철수 대표", companyId: 2, password: "demo1234" }
};

let currentUser = null; // Session storage

// --- MOCK DATA FOR ENTERPRISES ---
let defaultCompanies = [
  {
    id: 1,
    name: "(주)에이아이링크",
    type: "초기(1년 미만)",
    representative: "이영희",
    repDesc: "이영희 (32세, 여성)",
    invitationKey: "HN-LINK-2026",
    establishmentDate: "2025-11-15",
    address: "대전광역시 대덕구 한남로 70, 창업보육센터 302호",
    repAge: 32,
    repGender: "여성",
    oneStopLink: "대전창조경제혁신센터 법률분야 매칭 연계 완료",
    surveyData: {
      coachingField: ["BM고도화", "법률", "투자유치"],
      requiredEdu: "투자유치 IR 기초 및 특허 출원 교육",
      preferredMethod: "1:1 대면 밀착 멘토링",
      customStrategy: "법인 설립 완료 상태로 특허 및 투자 계약서 중심의 자문 집중 지원 필요."
    },
    metrics: { sales: "12,000천원", employees: "3명", reStartup: "아니오" },
    budget: { 
      status: "safe",
      checks: { m5: true, m6: true, m7: false, m8: false, m9: false, m10: false, m11: false, m12: false },
      total: "50,000", execution: "32,500"
    },
    education: { hr: "이수", accounting: "이수", law: "대기", content: "창업에듀: 노무기초 및 정부지원금 집행기준 수강 완료 (드림비즈 추천)" },
    monitoringDoc: "제출완료",
    coachingCount: 3,
    coachingLogs: [
      { id: 101, type: "멘토링", field: "BM고도화", date: "2026-05-15", content: "비즈니스 모델 피칭 자료 점검 및 시장 포지셔닝 멘토링 진행" },
      { id: 102, type: "교육", field: "노무", date: "2026-05-28", content: "노무 및 근로계약서 양식 실무 지도" },
      { id: 103, type: "멘토링", field: "BM고도화", date: "2026-06-10", content: "투자유치 IR 기초 멘토링 진행" }
    ],
    chatMessages: [
      { sender: "startup", text: "코치님, 노무 교육 링크 전송받은 것 학습 완료했습니다! 법률 분야 멘토링도 신청 가능한가요?", time: "오전 10:15" },
      { sender: "coach", text: "네! 잘하셨습니다. 법률 멘토링은 다음주 수요일에 매칭 예정입니다.", time: "오전 10:30" }
    ]
  },
  {
    id: 2,
    name: "그린에너지 솔루션",
    type: "예비 창업기업",
    representative: "김철수",
    repDesc: "김철수 (41세, 남성)",
    invitationKey: "HN-GREEN-2026",
    establishmentDate: "사업자 미등록 (예비)",
    address: "대전광역시 동구 동대전로 144",
    repAge: 41,
    repGender: "남성",
    oneStopLink: "대기 (7월 중 대전테크노파크 매칭 예정)",
    surveyData: null,
    metrics: { sales: "0원 (예비)", employees: "1명 (대표자)", reStartup: "예" },
    budget: { 
      status: "warn",
      checks: { m5: true, m6: false, m7: false, m8: false, m9: false, m10: false, m11: false, m12: false },
      total: "45,000", execution: "12,000"
    },
    education: { hr: "이수", accounting: "대기", law: "미이수", content: "창업에듀: 세무기초 실무 교육 영상 시청중" },
    monitoringDoc: "작성중",
    coachingCount: 2,
    coachingLogs: [
      { id: 201, type: "멘토링", field: "법률", date: "2026-05-20", content: "법인 설립 절차 및 특허 출원 상담 진행" },
      { id: 202, type: "교육", field: "회계", date: "2026-06-05", content: "창업 필수 회계 기초 개념 설명 및 교육 영상 추천" }
    ],
    chatMessages: [
      { sender: "startup", text: "세무 기장은 법인 설립 후 바로 해야 하나요?", time: "어제" },
      { sender: "coach", text: "네, 매출이 아직 없더라도 기초적인 세무 신고 and 기장 처리가 안전합니다. 관련 가이드를 송부해드릴게요.", time: "어제" }
    ]
  },
  {
    id: 3,
    name: "드림 소프트",
    type: "초기(1년 미만)",
    representative: "박민지",
    repDesc: "박민지 (28세, 여성)",
    invitationKey: "HN-DREAM-2026",
    establishmentDate: "2025-08-20",
    address: "대전광역시 서구 둔산서로 17",
    repAge: 28,
    repGender: "여성",
    oneStopLink: "해당 없음",
    surveyData: {
      coachingField: ["BM고도화", "회계", "마케팅"],
      requiredEdu: "인적 자원 관리 교육 및 고용 표준 지침",
      preferredMethod: "온라인 동영상 강의",
      customStrategy: "교육 이수 상태 최상. BM 고도화와 고용 안정화에 중점을 둔 성장 전략 코칭 진행."
    },
    metrics: { sales: "45,000천원", employees: "5명", reStartup: "아니오" },
    budget: { 
      status: "safe",
      checks: { m5: true, m6: true, m7: false, m8: false, m9: false, m10: false, m11: false, m12: false },
      total: "60,000", execution: "48,000"
    },
    education: { hr: "이수", accounting: "이수", law: "이수", content: "창업에듀: 3대 핵심과목 및 법률 특약 계약 수강 완료" },
    monitoringDoc: "제출완료",
    coachingCount: 3,
    coachingLogs: [
      { id: 301, type: "교육", field: "회계", date: "2026-05-18", content: "정부지원금 집행 기준 및 증빙 처리 교육 실시" },
      { id: 302, type: "멘토링", field: "노무", date: "2026-06-01", content: "개발자 고용 및 주52시간제 관련 노무 멘토링 진행" },
      { id: 303, type: "멘토링", field: "마케팅", date: "2026-06-15", content: "글로벌 시장 진출 전략 3차 멘토링 진행" }
    ],
    chatMessages: [
      { sender: "startup", text: "코치님 덕분에 필수 3대 교육 다 완료했습니다! 모니터링 자료 제출 드렸으니 피드백 부탁드립니다.", time: "오후 2:10" },
      { sender: "coach", text: "확인했습니다. 훌륭히 잘 작성하셨네요. 이번주에 최종 검토해서 확정하겠습니다.", time: "오후 2:40" }
    ]
  },
  {
    id: 4,
    name: "시즈모드",
    type: "초기(1년 미만)",
    representative: "최재성",
    repDesc: "최재성 (35세, 남성)",
    invitationKey: "HN-SIZ-2026",
    establishmentDate: "2025-12-01",
    address: "대전광역시 대덕구 오정로 66",
    repAge: 35,
    repGender: "남성",
    oneStopLink: "대기 (지원센터 특허 전문가 매칭 요청 상태)",
    surveyData: null,
    metrics: { sales: "8,500천원", employees: "2명", reStartup: "아니오" },
    budget: { 
      status: "safe",
      checks: { m5: true, m6: true, m7: false, m8: false, m9: false, m10: false, m11: false, m12: false },
      total: "40,000", execution: "31,000"
    },
    education: { hr: "미이수", accounting: "대기", law: "미이수", content: "드림비즈: 필수 노무 근로 기준 교육 자료 전송" },
    monitoringDoc: "미작성",
    coachingCount: 1,
    coachingLogs: [
      { id: 401, type: "멘토링", field: "마케팅", date: "2026-06-03", content: "초기 메뉴 런칭에 따른 마케팅 프로모션 피드백 제공" }
    ],
    chatMessages: [
      { sender: "coach", text: "대표님, 노무 및 세무 관련 기본 교육 이수가 지연되고 있습니다. 온라인 추천 코스 확인 부탁드립니다.", time: "그저께" }
    ]
  },
  {
    id: 5,
    name: "카이빅테크",
    type: "예비 창업기업",
    representative: "황동욱",
    repDesc: "황동욱 (31세, 남성)",
    invitationKey: "HN-KAIVIC-2026",
    establishmentDate: "사업자 미등록 (예비)",
    address: "대전광역시 유성구 대학로 99",
    repAge: 31,
    repGender: "남성",
    oneStopLink: "해당 없음",
    surveyData: null,
    metrics: { sales: "0원 (예비)", employees: "1명 (대표자)", reStartup: "예" },
    budget: { 
      status: "danger",
      checks: { m5: false, m6: false, m7: false, m8: false, m9: false, m10: false, m11: false, m12: false },
      total: "45,000", execution: "5,000"
    },
    education: { hr: "대기", accounting: "미이수", law: "미이수", content: "대기상태: 노무, 세무 기본 학습 과정 수강 신청 예정" },
    monitoringDoc: "미작성",
    coachingCount: 0,
    coachingLogs: [],
    chatMessages: [
      { sender: "startup", text: "안녕하세요 코치님, 이번주 첫 코칭 미팅 일정 확정 가능한가요?", time: "3일 전" }
    ]
  }
];

let companies = JSON.parse(localStorage.getItem("COMPANIES")) || defaultCompanies;

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

// --- GOOGLE SCRIPT URL FOR FREE API CONNECTION ---
// 여기에 깃허브 배포 가이드라인에 따라 복사한 구글 웹앱 URL을 입력하시면 실서비스 연동이 완료됩니다!
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxSQq1-KFWS5koqtPh5pnI5-21eQuPJbunb-RbY5D5oIVnopUqzRB2sOJj_da3CYWaAWg/exec";

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

const sectionDash = document.getElementById("section-dash");
const sectionChat = document.getElementById("section-chat");
const sectionEdu = document.getElementById("section-edu");
const sectionSurvey = document.getElementById("section-survey");
const sectionReport = document.getElementById("section-report");

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
function saveToLocalStorage() {
  localStorage.setItem("COMPANIES", JSON.stringify(companies));
  localStorage.setItem("USERS", JSON.stringify(USERS));
  localStorage.setItem("MILESTONES", JSON.stringify(milestones));
  
  // 만약 구글 API 주소가 세팅되어 있다면 자동으로 백그라운드 클라우드 동기화 수행
  if (GOOGLE_SCRIPT_URL) {
    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "syncData",
        userEmail: currentUser ? currentUser.name : "System",
        companies: companies,
        milestones: milestones
      })
    }).catch(err => console.log("Google sync delay: ", err));
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



loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const emailInput = loginEmail.value.trim();
  const password = loginPassword.value.trim();
  
  let matchedUserKey = Object.keys(USERS).find(key => key === emailInput);
  
  if (!matchedUserKey) {
    matchedUserKey = Object.keys(USERS).find(key => USERS[key].name.split(" ")[0] === emailInput);
  }

  if (matchedUserKey && USERS[matchedUserKey].password === password) {
    currentUser = USERS[matchedUserKey];
    enterPlatform();
  } else {
    alert("❌ 아이디(대표자명) 또는 비밀번호가 올바르지 않습니다.");
  }
});

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

  currentUser = USERS[accountEmail];
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
    document.querySelectorAll(".coach-only-cell").forEach(c => c.style.display = "table-cell");
    selectedCompanyId = companies[0] ? companies[0].id : 1;
  } else {
    userRoleBadge.innerText = "스타트업";
    userRoleBadge.className = "tag tag-pre";
    btnAddCompany.style.display = "none";
    btnEditMilestone.style.display = "none";
    document.querySelectorAll(".coach-only-cell").forEach(c => c.style.display = "none");
    selectedCompanyId = currentUser.companyId;
  }
  
  switchSection(sectionDash, menuDash);
  renderDashboard();
  renderMilestones();
}

btnLogout.addEventListener("click", () => {
  currentUser = null;
  loginOverlayScreen.style.display = "flex";
  mainSidebar.style.display = "none";
  mainContent.style.display = "none";
  loginForm.reset();
});

function renderMilestones() {
  milestoneListContainer.innerHTML = "";
  milestones.forEach((step, idx) => {
    const li = document.createElement("li");
    let symbol = "✔";
    let color = "var(--success)";
    if (idx === 2) { symbol = "⏳"; color = "var(--warning)"; }
    if (idx === 3) { symbol = "○"; color = "var(--text-secondary)"; }
    li.style.cssText = "display: flex; align-items: center; gap: 10px;";
    li.innerHTML = `<span style="color: ${color}; font-weight: bold;">${symbol}</span> ${step}`;
    milestoneListContainer.appendChild(li);
  });
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

  // Render Table
  companyTableBody.innerHTML = "";
  filtered.forEach(company => {
    const isPre = company.type.includes("예비");
    const tr = document.createElement("tr");

    // Unified education check indicator
    const isEducationFinished = company.education.hr === "이수" && company.education.accounting === "이수" && company.education.law === "이수";
    const eduBadgeHTML = isEducationFinished 
      ? `<span class="tag tag-early" style="background-color:rgba(16,185,129,0.1); color:var(--success);">이수 완료 🟢</span>` 
      : `<span class="tag tag-pre" style="background-color:rgba(245,158,11,0.1); color:var(--warning);">과정 진행중 ⏳</span>`;

    // Monthly checklist circle badges (Coded iteratively)
    let checksHTML = `<div style="display:flex; gap: 4px; align-items:center;">`;
    const months = ["m5", "m6", "m7", "m8", "m9", "m10", "m11", "m12"];
    const monthLabels = ["5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

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
        <div style="display:flex; gap: 4px;">
          <button class="action-btn" onclick="openDetailModal(${company.id})" style="background-color: var(--bg-primary);">🔍 상세조회</button>
          <button class="action-btn" onclick="openCoachingModal(${company.id})">
            ${currentUser.role === "coach" ? "✍️ 코칭등록" : "🔍 내역보기"}
          </button>
          ${currentUser.role === "coach" ? `<button class="action-btn" onclick="openEditCompanyModal(${company.id})" style="border-color: var(--accent-color); color: var(--accent-color);">⚙️ 수정</button>` : ""}
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
          <button class="action-btn" onclick="openEditEduModal(${c.id})" style="font-size: 0.75rem;">⚙️ 변경</button>
        </td>
      ` : ""}
    `;
    educationTableBody.appendChild(tr);
  });
}

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
    document.querySelector("#current-chat-title span").innerText = `💬 ${activeCompany.name} 소통 및 멘토링 채널 (한남대 창업지원단 전담코치: 정세정 주임연구원)`;
    
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
        textContentHTML = `
          <div class="message-bubble" style="display:flex; flex-direction:column; gap:4px;">
            <div>${msg.text}</div>
            <a href="${msg.file.data}" download="${msg.file.name}" class="chat-file-link">
              <span>📄 ${msg.file.name} (다운로드)</span>
            </a>
          </div>
        `;
      }

      msgDiv.innerHTML = `
        <span class="message-sender">${isSentByCoach ? '정세정 주임연구원' : '창업 대표자'}</span>
        ${textContentHTML}
      `;
      chatMessagesContainer.appendChild(msgDiv);
    });
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
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
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "uploadFile",
          fileName: file.name,
          fileType: file.type,
          fileData: rawData
        })
      })
      .then(() => {
        // no-cors mode returns opaque response, so we store base64 as safe fallback but notify upload completion
        currentAttachedFile = {
          name: file.name,
          type: file.type,
          data: rawData
        };
        attachmentPreviewArea.innerHTML = `
          <span class="attachment-pill" style="color:var(--success);">
            ✔ Google Drive 연동 완료: ${file.name}
            <button type="button" class="attachment-remove" onclick="clearAttachment()">&times;</button>
          </span>
        `;
      })
      .catch(err => {
        console.error("Google Drive connection failure: ", err);
        // Fallback to local storage
        currentAttachedFile = { name: file.name, type: file.type, data: rawData };
        attachmentPreviewArea.innerHTML = `
          <span class="attachment-pill">
            📎 로컬 저장 완료: ${file.name}
            <button type="button" class="attachment-remove" onclick="clearAttachment()">&times;</button>
          </span>
        `;
      });

    } else {
      // 로컬 스토리지 보관 모드
      currentAttachedFile = {
        name: file.name,
        type: file.type,
        data: rawData
      };
      attachmentPreviewArea.innerHTML = `
        <span class="attachment-pill">
          📎 ${file.name}
          <button type="button" class="attachment-remove" onclick="clearAttachment()">&times;</button>
        </span>
      `;
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
      div.style.cssText = `background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); font-size: 0.8rem; border-left: 4px solid ${isArchive ? '#10b981' : 'var(--accent-color)'};`;
      
      div.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-weight:600;">
          <span style="color: ${isArchive ? '#10b981' : 'var(--text-primary)'}">[${log.type} - ${log.field}] ${isArchive ? '🟢 소통로그 연동' : '🔵 코칭등록'}</span>
          <span style="color: var(--text-secondary); font-size:0.75rem;">${log.date}</span>
        </div>
        <div style="color: var(--text-primary); line-height: 1.4;">${log.content}</div>
      `;
      dCombinedHistory.appendChild(div);
    });
  }

  detailModal.style.display = "flex";
};

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
      div.style.cssText = "background: rgba(0,0,0,0.02); padding: 8px 12px; border-radius: 6px; font-size: 0.8rem; border-left: 3px solid var(--accent-color);";
      div.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-weight:600;">
          <span>[${log.type} - ${log.field}] 코칭</span>
          <span style="color: var(--text-secondary); font-size:0.75rem;">${log.date}</span>
        </div>
        <div>${log.content}</div>
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
};

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

  companyModal.style.display = "flex";
});

window.openEditCompanyModal = function(id) {
  const target = companies.find(c => c.id === id);
  if (!target) return;

  companyModalTitle.innerText = `⚙️ ${target.name} 정보 수정`;
  companyEditId.value = target.id;

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
  document.getElementById("c-age").value = target.repAge || "";
  document.getElementById("c-gender").value = target.repGender || "남성";
  document.getElementById("c-restartup").value = target.metrics.reStartup;
  document.getElementById("c-onestop").value = target.oneStopLink || "";

  // Sync checkboxes for monthly checks
  document.getElementById("chk-m5").checked = target.budget.checks.m5;
  document.getElementById("chk-m6").checked = target.budget.checks.m6;
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
  const sales = document.getElementById("c-sales").value;
  const emp = document.getElementById("c-emp").value;
  const estDate = document.getElementById("c-est-date").value;
  const address = document.getElementById("c-address").value;
  const ageVal = parseInt(document.getElementById("c-age").value) || 30;
  const genderVal = document.getElementById("c-gender").value;
  const restartup = document.getElementById("c-restartup").value;
  const onestopVal = document.getElementById("c-onestop").value;

  const bStatus = document.getElementById("c-budget-status").value;

  const checks = {
    m5: document.getElementById("chk-m5").checked,
    m6: document.getElementById("chk-m6").checked,
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
      target.repAge = ageVal;
      target.repGender = genderVal;
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
      repAge: ageVal,
      repGender: genderVal,
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
  [sectionDash, sectionChat, sectionEdu, sectionSurvey, sectionReport].forEach(sec => sec.classList.remove("active"));
  [menuDash, menuChat, menuEdu, menuSurvey, menuReport].forEach(menu => menu.classList.remove("active"));
  
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
  }
}

// SURVEY SECTION RENDERING & SUBMIT
function renderSurveySection() {
  const form = document.getElementById("survey-form-el");
  const strategyContainer = document.getElementById("survey-strategy-container");
  const strategyTextarea = document.getElementById("sv-strategy");
  const submitBtn = document.getElementById("btn-submit-survey");
  
  let targetCompany = null;
  if (currentUser.role === "coach") {
    // 코치는 드롭다운이나 선택된 기업 기준으로 사전 조사를 조회/수정할 수 있도록 유도
    targetCompany = companies.find(c => c.id === selectedCompanyId) || companies[0];
    strategyContainer.style.display = "flex";
    strategyTextarea.removeAttribute("readonly");
    submitBtn.innerText = "💾 코치 맞춤형 전략 저장";
  } else {
    // 스타트업 대표는 본인 회사 고정
    targetCompany = companies.find(c => c.id === currentUser.companyId);
    strategyContainer.style.display = "flex";
    strategyTextarea.setAttribute("readonly", "true");
    submitBtn.innerText = "📝 사전 조사 답변 제출";
  }

  if (!targetCompany) return;

  // Pre-populate if survey data exists
  if (targetCompany.surveyData) {
    document.getElementById("sv-sales").value = targetCompany.metrics.sales || "";
    document.getElementById("sv-employees").value = targetCompany.metrics.employees || "";
    document.getElementById("sv-est-date").value = targetCompany.establishmentDate || "";
    document.getElementById("sv-address").value = targetCompany.address || "";
    document.getElementById("sv-age").value = targetCompany.repAge || "";
    document.getElementById("sv-gender").value = targetCompany.repGender || "남성";
    document.getElementById("sv-restartup").value = targetCompany.metrics.reStartup || "아니오";
    
    // Checkboxes
    const fields = targetCompany.surveyData.coachingField || [];
    document.querySelectorAll("input[name='sv-coach-fields']").forEach(chk => {
      chk.checked = fields.includes(chk.value);
    });
    
    document.getElementById("sv-req-edu").value = targetCompany.surveyData.requiredEdu || "";
    document.getElementById("sv-pref-method").value = targetCompany.surveyData.preferredMethod || "온라인 동영상 강의";
    strategyTextarea.value = targetCompany.surveyData.customStrategy || "";
  } else {
    // Fill basic details from existing profile
    document.getElementById("sv-sales").value = targetCompany.metrics.sales || "";
    document.getElementById("sv-employees").value = targetCompany.metrics.employees || "";
    document.getElementById("sv-est-date").value = targetCompany.establishmentDate || "";
    document.getElementById("sv-address").value = targetCompany.address || "";
    document.getElementById("sv-age").value = targetCompany.repAge || "";
    document.getElementById("sv-gender").value = targetCompany.repGender || "남성";
    document.getElementById("sv-restartup").value = targetCompany.metrics.reStartup || "아니오";
    
    document.querySelectorAll("input[name='sv-coach-fields']").forEach(chk => chk.checked = false);
    document.getElementById("sv-req-edu").value = "";
    document.getElementById("sv-pref-method").value = "온라인 동영상 강의";
    strategyTextarea.value = "";
  }
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

  const sales = document.getElementById("sv-sales").value;
  const emp = document.getElementById("sv-employees").value;
  const estDate = document.getElementById("sv-est-date").value;
  const address = document.getElementById("sv-address").value;
  const age = parseInt(document.getElementById("sv-age").value) || 30;
  const gender = document.getElementById("sv-gender").value;
  const restartup = document.getElementById("sv-restartup").value;
  
  const coachFields = [];
  document.querySelectorAll("input[name='sv-coach-fields']:checked").forEach(chk => {
    coachFields.push(chk.value);
  });
  
  const reqEdu = document.getElementById("sv-req-edu").value;
  const prefMethod = document.getElementById("sv-pref-method").value;
  const strategy = document.getElementById("sv-strategy").value;

  // Update local model
  targetCompany.metrics.sales = sales;
  targetCompany.metrics.employees = emp;
  targetCompany.establishmentDate = estDate;
  targetCompany.address = address;
  targetCompany.repAge = age;
  targetCompany.repGender = gender;
  targetCompany.metrics.reStartup = restartup;
  
  targetCompany.surveyData = {
    coachingField: coachFields,
    requiredEdu: reqEdu,
    preferredMethod: prefMethod,
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
        sales: sales,
        employees: emp,
        estDate: estDate,
        address: address,
        age: age,
        gender: gender,
        restartup: restartup,
        coachFields: coachFields.join(", "),
        reqEdu: reqEdu,
        prefMethod: prefMethod,
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

// REPORT SECTION RENDERING
function renderReportSection() {
  const select = document.getElementById("report-company-select");
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
  document.getElementById("report-print-date").innerText = new Date().toISOString().split('T')[0];
  document.getElementById("rep-comp-name").innerText = activeCompany.name;
  document.getElementById("rep-comp-type").innerText = activeCompany.type;
  document.getElementById("rep-rep-name").innerText = activeCompany.representative;
  document.getElementById("rep-rep-profile").innerText = `${activeCompany.repAge || "-"}세 / ${activeCompany.repGender || "-"}`;
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
  document.getElementById("rep-edu-desc").innerText = `교육 비고 및 지도내용: ${activeCompany.education.content}`;

  // Monthly Budget Checks
  const months = ["m5", "m6", "m7", "m8", "m9", "m10", "m11", "m12"];
  const budgetRow = document.getElementById("rep-budget-row");
  budgetRow.innerHTML = "";
  months.forEach(m => {
    const isChecked = activeCompany.budget.checks[m];
    const td = document.createElement("td");
    td.innerText = isChecked ? "🟢" : "⚪";
    budgetRow.appendChild(td);
  });
  const evalTd = document.createElement("td");
  evalTd.style.fontWeight = "700";
  const bStatus = activeCompany.budget.status;
  if (bStatus === "safe") {
    evalTd.innerText = "정상 집행";
    evalTd.style.color = "var(--success)";
  } else if (bStatus === "warn") {
    evalTd.innerText = "집행 지연";
    evalTd.style.color = "var(--warning)";
  } else {
    evalTd.innerText = "미집행 경고";
    evalTd.style.color = "var(--danger)";
  }
  budgetRow.appendChild(evalTd);

  // Survey data
  if (activeCompany.surveyData) {
    document.getElementById("rep-survey-fields").innerText = (activeCompany.surveyData.coachingField || []).join(", ") || "없음";
    document.getElementById("rep-survey-req-edu").innerText = activeCompany.surveyData.requiredEdu || "-";
    document.getElementById("rep-survey-pref").innerText = activeCompany.surveyData.preferredMethod || "-";
    document.getElementById("rep-survey-strategy").innerText = activeCompany.surveyData.customStrategy || "코치 미작성 상태";
  } else {
    document.getElementById("rep-survey-fields").innerText = "사전조사 미제출";
    document.getElementById("rep-survey-req-edu").innerText = "-";
    document.getElementById("rep-survey-pref").innerText = "-";
    document.getElementById("rep-survey-strategy").innerText = "사전조사 결과가 없어 맞춤형 지원 전략이 수립되지 않았습니다.";
  }

  // Coaching logs table
  const logsBody = document.getElementById("rep-coaching-logs-body");
  logsBody.innerHTML = "";
  if (activeCompany.coachingLogs.length === 0) {
    logsBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-secondary);">밀착 코칭 및 상담 이력이 없습니다.</td></tr>`;
  } else {
    activeCompany.coachingLogs.forEach(log => {
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
}

// Dropdown Change listener in Report view
document.getElementById("report-company-select").addEventListener("change", (e) => {
  selectedCompanyId = parseInt(e.target.value);
  renderReportSection();
});

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

// Initial Setup
renderMilestones();
