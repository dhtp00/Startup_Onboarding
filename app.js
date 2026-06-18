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
    metrics: { sales: "12,000천원", employees: "3명", reStartup: "아니오" },
    budget: { total: "50,000", execution: "32,500", rate: "65%", status: "safe" },
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
    metrics: { sales: "0원 (예비)", employees: "1명 (대표자)", reStartup: "예" },
    budget: { total: "45,000", execution: "12,000", rate: "26%", status: "warn" },
    education: { hr: "이수", accounting: "대기", law: "미이수", content: "창업에듀: 세무기초 실무 교육 영상 시청중" },
    monitoringDoc: "작성중",
    coachingCount: 2,
    coachingLogs: [
      { id: 201, type: "멘토링", field: "법률", date: "2026-05-20", content: "법인 설립 절차 및 특허 출원 상담 진행" },
      { id: 202, type: "교육", field: "회계", date: "2026-06-05", content: "창업 필수 회계 기초 개념 설명 및 교육 영상 추천" }
    ],
    chatMessages: [
      { sender: "startup", text: "세무 기장은 법인 설립 후 바로 해야 하나요?", time: "어제" },
      { sender: "coach", text: "네, 매출이 아직 없더라도 기초적인 세무 신고와 기장 처리가 안전합니다. 관련 가이드를 송부해드릴게요.", time: "어제" }
    ]
  },
  {
    id: 3,
    name: "드림 소프트",
    type: "초기(1년 미만)",
    representative: "박민지",
    repDesc: "박민지 (28세, 여성)",
    invitationKey: "HN-DREAM-2026",
    metrics: { sales: "45,000천원", employees: "5명", reStartup: "아니오" },
    budget: { total: "60,000", execution: "48,000", rate: "80%", status: "safe" },
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
    metrics: { sales: "8,500천원", employees: "2명", reStartup: "아니오" },
    budget: { total: "40,000", execution: "31,000", rate: "77%", status: "safe" },
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
    metrics: { sales: "0원 (예비)", employees: "1명 (대표자)", reStartup: "예" },
    budget: { total: "45,000", execution: "5,000", rate: "11%", status: "danger" },
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
let currentAttachedFile = null; // Stored file object (DataURL)

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

const sectionDash = document.getElementById("section-dash");
const sectionChat = document.getElementById("section-chat");
const sectionEdu = document.getElementById("section-edu");

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
const dKey = document.getElementById("detail-invitation-key");

const dBudgetTotal = document.getElementById("detail-budget-total");
const dBudgetExecution = document.getElementById("detail-budget-execution");
const dBudgetRate = document.getElementById("detail-budget-rate");
const dBudgetStatus = document.getElementById("detail-budget-status");

const dEduHr = document.getElementById("detail-edu-hr");
const dEduAcc = document.getElementById("detail-edu-accounting");
const dEduLaw = document.getElementById("detail-edu-law");

const dCombinedHistory = document.getElementById("detail-combined-history");

// NEW DETAILED MODALS & BUTTONS
const btnAddCompany = document.getElementById("btn-add-company");
const btnEditMilestone = document.getElementById("btn-edit-milestone");
const milestoneListContainer = document.getElementById("milestone-list");

// Milestone Modal
const milestoneModal = document.getElementById("milestone-modal");
const milestoneForm = document.getElementById("milestone-form");
const btnCloseMilestone = document.getElementById("btn-close-milestone");
const btnCancelMilestone = document.getElementById("btn-cancel-milestone");

// Company Registration/Editing Modal
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

// Attachment elements
const chatFileInput = document.getElementById("chat-file-input");
const btnTriggerFile = document.getElementById("btn-trigger-file");
const attachmentPreviewArea = document.getElementById("attachment-preview-area");

// --- LOCAL STORAGE SYNC ---
function saveToLocalStorage() {
  localStorage.setItem("COMPANIES", JSON.stringify(companies));
  localStorage.setItem("USERS", JSON.stringify(USERS));
  localStorage.setItem("MILESTONES", JSON.stringify(milestones));
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

// --- LOGIN ACTION ---
window.prefillLogin = function(email) {
  loginEmail.value = email;
  loginPassword.value = email === "osy0922@hnu.kr" ? "osy0922" : "demo1234";
};

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const emailInput = loginEmail.value.trim();
  const password = loginPassword.value.trim();
  
  // Custom authentication check: Matches email (for coach) or matches Representative name (Startup ID)
  let matchedUserKey = Object.keys(USERS).find(key => key === emailInput);
  
  // If not found in email, check if they typed their representative name (ID)
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

// --- SIGNUP (WITH INVITATION KEY) ACTION ---
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const representativeName = signupEmail.value.trim(); // Rep name serves as Startup ID
  const password = signupPassword.value.trim();
  const keyInput = signupKey.value.trim().toUpperCase();

  const matchedCompany = companies.find(c => c.invitationKey === keyInput);

  if (!matchedCompany) {
    alert("❌ 유효하지 않은 가입 키입니다. 정세정 주임연구원에게 문의해 주세요.");
    return;
  }

  // Ensure Representative matches Name exactly
  if (matchedCompany.representative !== representativeName) {
    alert(`❌ 회원가입 오류: 등록된 대표자명(${matchedCompany.representative})과 입력하신 이름이 다릅니다.`);
    return;
  }

  const isKeyAlreadyUsed = Object.values(USERS).some(u => u.companyId === matchedCompany.id);
  if (isKeyAlreadyUsed) {
    alert("❌ 해당 가입 키는 이미 연동이 완료되었습니다.");
    return;
  }

  // Register 계정
  const accountEmail = `${representativeName.toLowerCase()}@onboard.com`; // Pseudo email
  USERS[accountEmail] = {
    role: "startup",
    name: `${representativeName} 대표`,
    companyId: matchedCompany.id,
    password: password
  };

  currentUser = USERS[accountEmail];
  saveToLocalStorage();
  
  alert(`🎉 회원가입 및 매칭이 완료되었습니다!\n기업명: ${matchedCompany.name}\n이제 [대표자명: ${representativeName}]으로 로그인 하실 수 있습니다.`);
  
  signupForm.reset();
  cardSignup.style.display = "none";
  cardLogin.style.display = "block";
  enterPlatform();
});

// ENTER PLATFORM LOGIC
function enterPlatform() {
  loginOverlayScreen.style.display = "none";
  mainSidebar.style.display = "flex";
  mainContent.style.display = "flex";
  
  userNameDisplay.innerText = currentUser.name;
  
  // Display controls base on Role
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

// LOGOUT LOGIC
btnLogout.addEventListener("click", () => {
  currentUser = null;
  loginOverlayScreen.style.display = "flex";
  mainSidebar.style.display = "none";
  mainContent.style.display = "none";
  loginForm.reset();
});

// --- VIEW NAVIGATION ---
function switchSection(targetSection, activeMenu) {
  [sectionDash, sectionChat, sectionEdu].forEach(sec => sec.classList.remove("active"));
  [menuDash, menuChat, menuEdu].forEach(menu => menu.classList.remove("active"));
  
  targetSection.classList.add("active");
  activeMenu.classList.add("active");

  if (targetSection === sectionDash) mainHeaderTitle.innerText = "종합 대시보드";
  else if (targetSection === sectionChat) mainHeaderTitle.innerText = "상시 소통 채널";
  else if (targetSection === sectionEdu) mainHeaderTitle.innerText = "필수 교육 현황";
}

menuDash.addEventListener("click", () => switchSection(sectionDash, menuDash));
menuChat.addEventListener("click", () => {
  switchSection(sectionChat, menuChat);
  renderChatSection();
});
menuEdu.addEventListener("click", () => {
  switchSection(sectionEdu, menuEdu);
  renderDashboard();
});

// --- MILESTONE RENDERING ---
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

// --- GET DATA FILTERED BY USER ROLE ---
function getFilteredCompanies() {
  if (currentUser.role === "coach") {
    return companies;
  } else {
    return companies.filter(c => c.id === currentUser.companyId);
  }
}

// --- RENDER FUNCTIONS ---
function renderDashboard() {
  const filtered = getFilteredCompanies();

  // Update Stats
  const total = filtered.length;
  document.getElementById("stat-total-companies").innerText = `${total}개사`;
  
  const totalCoaching = filtered.reduce((acc, c) => acc + c.coachingCount, 0);
  const targetCoaching = total * 3;
  const rate = targetCoaching > 0 ? Math.round((totalCoaching / targetCoaching) * 100) : 0;
  document.getElementById("stat-coaching-rate").innerText = `${rate}%`;
  
  const docs = filtered.filter(c => c.monitoringDoc === "제출완료").length;
  document.getElementById("stat-doc-count").innerText = `${docs} / ${total}건`;

  // Update training stats on Education sub-panel
  const totalEducationRecords = companies.length;
  if (totalEducationRecords > 0) {
    const hrCount = companies.filter(c => c.education.hr === "이수").length;
    const accCount = companies.filter(c => c.education.accounting === "이수").length;
    const lawCount = companies.filter(c => c.education.law === "이수").length;
    document.getElementById("edu-stat-hr").innerText = `${Math.round(hrCount / totalEducationRecords * 100)}%`;
    document.getElementById("edu-stat-hr").nextElementSibling.innerText = `${totalEducationRecords}개사 중 ${hrCount}개사 이수`;
    document.getElementById("edu-stat-acc").innerText = `${Math.round(accCount / totalEducationRecords * 100)}%`;
    document.getElementById("edu-stat-acc").nextElementSibling.innerText = `${totalEducationRecords}개사 중 ${accCount}개사 이수`;
    document.getElementById("edu-stat-law").innerText = `${Math.round(lawCount / totalEducationRecords * 100)}%`;
    document.getElementById("edu-stat-law").nextElementSibling.innerText = `${totalEducationRecords}개사 중 ${lawCount}개사 이수`;
  }

  // Render Table
  companyTableBody.innerHTML = "";
  filtered.forEach(company => {
    const isPre = company.type.includes("예비");
    const tr = document.createElement("tr");

    const hrDot = getDotClass(company.education.hr);
    const accDot = getDotClass(company.education.accounting);
    const lawDot = getDotClass(company.education.law);

    let budgetDot = "dot-done";
    let budgetText = "정상 집행";
    if (company.budget.status === "warn") {
      budgetDot = "dot-wait";
      budgetText = "집행 지연";
    } else if (company.budget.status === "danger") {
      budgetDot = "dot-none";
      budgetText = "미집행 경고";
    }

    const totalBudgetVal = parseFloat((company.budget.total || "0").replace(/,/g, ''));
    const execBudgetVal = parseFloat((company.budget.execution || "0").replace(/,/g, ''));
    const budgetRate = totalBudgetVal > 0 ? Math.round((execBudgetVal / totalBudgetVal) * 100) + "%" : "0%";

    tr.innerHTML = `
      <td><span class="company-name">${company.name}</span></td>
      <td><span class="tag ${isPre ? 'tag-pre' : 'tag-early'}">${company.type}</span></td>
      <td style="font-size: 0.85rem; color: var(--text-secondary);">${company.repDesc}</td>
      <td style="font-size: 0.82rem;">매출: ${company.metrics.sales}<br>고용: ${company.metrics.employees}</td>
      <td>
        <div style="font-size: 0.82rem;">
          집행률: <strong>${budgetRate}</strong> (${company.budget.execution}천원/${company.budget.total}천원)
          <div class="status-badge" style="display:flex; margin-top:2px;">
            <i class="status-dot ${budgetDot}"></i>${budgetText}
          </div>
        </div>
      </td>
      <td>
        <div style="display: flex; gap: 8px;">
          <span class="status-badge" title="노무"><i class="status-dot ${hrDot}"></i>노무</span>
          <span class="status-badge" title="회계"><i class="status-dot ${accDot}"></i>회계</span>
          <span class="status-badge" title="법률"><i class="status-dot ${lawDot}"></i>법률</span>
        </div>
      </td>
      <td>
        <span class="status-badge">
          <i class="status-dot ${company.monitoringDoc === '제출완료' ? 'dot-done' : (company.monitoringDoc === '작성중' ? 'dot-wait' : 'dot-none')}"></i>
          ${company.monitoringDoc}
        </span>
      </td>
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

function getDotClass(status) {
  if (status === "이수") return "dot-done";
  if (status === "대기") return "dot-wait";
  return "dot-none";
}

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
      
      // Render standard chat or attached document link
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

// --- FILE ATTACHMENT MOCK HANDLING ---
btnTriggerFile.addEventListener("click", () => chatFileInput.click());
chatFileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    currentAttachedFile = {
      name: file.name,
      type: file.type,
      data: evt.target.result // Base64 encoding DataURL
    };
    
    // Show Preview Pill
    attachmentPreviewArea.innerHTML = `
      <span class="attachment-pill">
        📎 ${file.name}
        <button type="button" class="attachment-remove" onclick="clearAttachment()">&times;</button>
      </span>
    `;
  };
  reader.readAsDataURL(file);
});

window.clearAttachment = function() {
  currentAttachedFile = null;
  attachmentPreviewArea.innerHTML = "";
  chatFileInput.value = "";
};

// --- SEND CHAT ---
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

// --- ARCHIVE CHAT TO COACHING LOG ---
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

// --- DETAIL MODAL ACTION ---
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
  dKey.innerText = activeCompany.invitationKey;

  dBudgetTotal.innerText = activeCompany.budget.total + "천원";
  dBudgetExecution.innerText = activeCompany.budget.execution + "천원";
  
  const totalBudgetVal = parseFloat((activeCompany.budget.total || "0").replace(/,/g, ''));
  const execBudgetVal = parseFloat((activeCompany.budget.execution || "0").replace(/,/g, ''));
  const budgetRate = totalBudgetVal > 0 ? Math.round((execBudgetVal / totalBudgetVal) * 100) + "%" : "0%";
  dBudgetRate.innerText = budgetRate;
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

// --- COACHING MODAL ACTIONS ---
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
    
    if (targetCompany.coachingCount >= 3 && targetCompany.monitoringDoc !== "제출완료") {
      targetCompany.monitoringDoc = "제출완료";
    }

    saveToLocalStorage();
    closeModal();
    renderDashboard();
  }
});

// --- EDIT MILESTONE ACTION ---
btnEditMilestone.addEventListener("click", () => {
  // Strip tags from current milestones values to prefill inputs
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

// --- COMPANY REGISTRATION & EDIT MODAL ---
btnAddCompany.addEventListener("click", () => {
  companyForm.reset();
  companyEditId.value = "";
  companyModalTitle.innerText = "🏫 신규 창업기업 등록";
  
  // Prefill dynamic key
  const randNum = Math.floor(1000 + Math.random() * 9000);
  document.getElementById("c-key").value = `HN-NEW-${randNum}`;
  document.getElementById("c-password").value = "1234"; // default temp pass

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
  
  // Find linked login pass
  const matchedAccount = Object.keys(USERS).find(key => USERS[key].companyId === target.id);
  document.getElementById("c-password").value = matchedAccount ? USERS[matchedAccount].password : "1234";

  document.getElementById("c-key").value = target.invitationKey;
  document.getElementById("c-sales").value = target.metrics.sales;
  document.getElementById("c-emp").value = target.metrics.employees;
  document.getElementById("c-restartup").value = target.metrics.reStartup;
  document.getElementById("c-doc").value = target.monitoringDoc;

  document.getElementById("c-budget-total").value = target.budget.total;
  document.getElementById("c-budget-exec").value = target.budget.execution;
  document.getElementById("c-budget-status").value = target.budget.status;

  companyModal.style.display = "flex";
};

const closeCompanyModal = () => companyModal.style.display = "none";
btnCloseCompany.addEventListener("click", closeCompanyModal);
btnCancelCompany.addEventListener("click", closeCompanyModal);

// Auto-key generator in modal
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
  const restartup = document.getElementById("c-restartup").value;
  const docVal = document.getElementById("c-doc").value;

  const bTotal = document.getElementById("c-budget-total").value;
  const bExec = document.getElementById("c-budget-exec").value;
  const bStatus = document.getElementById("c-budget-status").value;

  if (idVal) {
    // 1. UPDATE MODE
    const target = companies.find(c => c.id === parseInt(idVal));
    if (target) {
      target.name = name;
      target.type = type;
      target.representative = representative;
      target.repDesc = repDesc;
      target.invitationKey = keyVal;
      target.metrics = { sales: sales, employees: emp, reStartup: restartup };
      target.budget = { total: bTotal, execution: bExec, status: bStatus };
      target.monitoringDoc = docVal;

      // Update password logic
      const matchedAccountKey = Object.keys(USERS).find(k => USERS[k].companyId === target.id);
      if (matchedAccountKey) {
        USERS[matchedAccountKey].name = `${representative} 대표`;
        USERS[matchedAccountKey].password = password;
      }
    }
  } else {
    // 2. CREATE MODE
    const newId = companies.length > 0 ? Math.max(...companies.map(c => c.id)) + 1 : 1;
    
    companies.push({
      id: newId,
      name: name,
      type: type,
      representative: representative,
      repDesc: repDesc,
      invitationKey: keyVal,
      metrics: { sales: sales, employees: emp, reStartup: restartup },
      budget: { total: bTotal, execution: bExec, status: bStatus },
      education: { hr: "대기", accounting: "대기", law: "대기", content: "노무, 세무 기본 과정 교육 대기 상태" },
      monitoringDoc: docVal,
      coachingCount: 0,
      coachingLogs: [],
      chatMessages: [
        { sender: "coach", text: "신규 매칭을 환영합니다. 초기 사업화 온보딩에 대한 문의를 남겨주세요.", time: "방금 전" }
      ]
    });

    // Create startup user link
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

// --- EDUCATION MANAGEMENT MODAL (COACH EXCLUSIVE) ---
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

// Initial Render on startup
renderMilestones();
