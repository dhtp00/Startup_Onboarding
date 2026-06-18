// --- DEMO USER ACCOUNT DATA (Simulation of Supabase Auth) ---
const USERS = {
  "osy0922@hnu.kr": { role: "coach", name: "정세정 주임연구원", companyId: null, password: "osy0922" },
  "ceo1@ailink.com": { role: "startup", name: "이영희 대표", companyId: 1, password: "demo1234" },
  "ceo2@green.com": { role: "startup", name: "김철수 대표", companyId: 2, password: "demo1234" }
};

let currentUser = null; // Session storage simulation

// --- MOCK DATA FOR ENTERPRISES ---
let companies = [
  {
    id: 1,
    name: "(주)에이아이링크",
    type: "초기(1년 미만)",
    representative: "이영희 (32세, 여성)",
    invitationKey: "HN-LINK-2026",
    metrics: { sales: "12,000천원", employees: "3명", reStartup: "아니오" },
    budget: { total: "50,000천원", execution: "32,500천원", rate: "65%", status: "safe" },
    education: { hr: "이수", accounting: "이수", law: "대기" },
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
    representative: "김철수 (41세, 남성)",
    invitationKey: "HN-GREEN-2026",
    metrics: { sales: "0원 (예비)", employees: "1명 (대표자)", reStartup: "예" },
    budget: { total: "45,000천원", execution: "12,000천원", rate: "26%", status: "warn" },
    education: { hr: "이수", accounting: "대기", law: "미이수" },
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
    representative: "박민지 (28세, 여성)",
    invitationKey: "HN-DREAM-2026",
    metrics: { sales: "45,000천원", employees: "5명", reStartup: "아니오" },
    budget: { total: "60,000천원", execution: "48,000천원", rate: "80%", status: "safe" },
    education: { hr: "이수", accounting: "이수", law: "이수" },
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
    representative: "최재성 (35세, 남성)",
    invitationKey: "HN-SIZ-2026",
    metrics: { sales: "8,500천원", employees: "2명", reStartup: "아니오" },
    budget: { total: "40,000천원", execution: "31,000천원", rate: "77%", status: "safe" },
    education: { hr: "미이수", accounting: "대기", law: "미이수" },
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
    representative: "황동욱 (31세, 남성)",
    invitationKey: "HN-KAIVIC-2026",
    metrics: { sales: "0원 (예비)", employees: "1명 (대표자)", reStartup: "예" },
    budget: { total: "45,000천원", execution: "5,000천원", rate: "11%", status: "danger" },
    education: { hr: "대기", accounting: "미이수", law: "미이수" },
    monitoringDoc: "미작성",
    coachingCount: 0,
    coachingLogs: [],
    chatMessages: [
      { sender: "startup", text: "안녕하세요 코치님, 이번주 첫 코칭 미팅 일정 확정 가능한가요?", time: "3일 전" }
    ]
  }
];

let selectedCompanyId = 1;

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
  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();
  
  if (USERS[email] && USERS[email].password === password) {
    currentUser = USERS[email];
    enterPlatform();
  } else {
    alert("❌ 이메일 또는 비밀번호가 올바르지 않습니다.");
  }
});

// --- SIGNUP (WITH INVITATION KEY) ACTION ---
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = signupEmail.value.trim();
  const password = signupPassword.value.trim();
  const keyInput = signupKey.value.trim().toUpperCase();

  // Find matching company by validation key
  const matchedCompany = companies.find(c => c.invitationKey === keyInput);

  if (!matchedCompany) {
    alert("❌ 유효하지 않은 가입 키입니다. 한남대 창업지원단에서 발급한 올바른 키를 입력해 주세요.");
    return;
  }

  // Check if this company already has an owner account linked
  const isKeyAlreadyUsed = Object.values(USERS).some(u => u.companyId === matchedCompany.id);
  if (isKeyAlreadyUsed) {
    alert("❌ 해당 가입 키는 이미 다른 계정에 연동되어 회원가입이 완료되었습니다.");
    return;
  }

  // 1. Register Account
  USERS[email] = {
    role: "startup",
    name: `${matchedCompany.representative.split(" ")[0]} 대표 (연동)`,
    companyId: matchedCompany.id,
    password: password
  };

  // 2. Set Current User Session
  currentUser = USERS[email];
  
  alert(`🎉 회원가입 및 기업 매칭 연동이 완료되었습니다!\n연동 기업: ${matchedCompany.name}`);
  
  // 3. Clean and Enter
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
  
  if (currentUser.role === "coach") {
    userRoleBadge.innerText = "전담코치";
    userRoleBadge.className = "tag tag-early";
    document.getElementById("btn-add-company").style.display = "inline-block";
    selectedCompanyId = 1;
  } else {
    userRoleBadge.innerText = "스타트업";
    userRoleBadge.className = "tag tag-pre";
    document.getElementById("btn-add-company").style.display = "none";
    selectedCompanyId = currentUser.companyId;
  }
  
  switchSection(sectionDash, menuDash);
  renderDashboard();
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
menuEdu.addEventListener("click", () => switchSection(sectionEdu, menuEdu));


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
  const pre = filtered.filter(c => c.type.includes("예비")).length;
  document.getElementById("stat-total-companies").innerText = `${total}개사`;
  
  const totalCoaching = filtered.reduce((acc, c) => acc + c.coachingCount, 0);
  const targetCoaching = total * 3;
  const rate = targetCoaching > 0 ? Math.round((totalCoaching / targetCoaching) * 100) : 0;
  document.getElementById("stat-coaching-rate").innerText = `${rate}%`;
  
  const docs = filtered.filter(c => c.monitoringDoc === "제출완료").length;
  document.getElementById("stat-doc-count").innerText = `${docs} / ${total}건`;

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

    tr.innerHTML = `
      <td><span class="company-name">${company.name}</span></td>
      <td><span class="tag ${isPre ? 'tag-pre' : 'tag-early'}">${company.type}</span></td>
      <td style="font-size: 0.85rem; color: var(--text-secondary);">${company.representative}</td>
      <td style="font-size: 0.82rem;">매출: ${company.metrics.sales}<br>고용: ${company.metrics.employees}</td>
      <td>
        <div style="font-size: 0.82rem;">
          집행률: <strong>${company.budget.rate}</strong> (${company.budget.execution}/${company.budget.total})
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
      <td style="font-size: 0.85rem; color: var(--text-secondary);">
        창업에듀: <strong>노무기초 및 정부지원금 집행기준</strong> 강좌 연계 수강중 (드림비즈 추천)
      </td>
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
    document.querySelector("#current-chat-title span").innerText = `💬 ${activeCompany.name} 소통 및 멘토링 채널 (한남대학교 창업지원단 전담코치: 정세정 주임연구원)`;
    
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
      
      msgDiv.innerHTML = `
        <span class="message-sender">${isSentByCoach ? '한남대 창업지원단 정세정 주임연구원' : '창업 대표자'}</span>
        <div class="message-bubble">${msg.text}</div>
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

// --- SEND CHAT ---
btnSendMessage.addEventListener("click", () => {
  const text = chatTextInput.value.trim();
  if (!text) return;

  const filtered = getFilteredCompanies();
  const activeCompany = filtered.find(c => c.id === selectedCompanyId);
  
  if (activeCompany) {
    activeCompany.chatMessages.push({
      sender: currentUser.role,
      text: text,
      time: new Date().toLocaleTimeString("ko-KR", { hour: '2-digit', minute: '2-digit' })
    });
    chatTextInput.value = "";
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

  dBudgetTotal.innerText = activeCompany.budget.total;
  dBudgetExecution.innerText = activeCompany.budget.execution;
  dBudgetRate.innerText = activeCompany.budget.rate;
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

    closeModal();
    renderDashboard();
  }
});

// --- ADD NEW COMPANY SIMULATOR (WITH DYNAMIC KEY CREATION) ---
document.getElementById("btn-add-company").addEventListener("click", () => {
  if (currentUser.role !== "coach") return;

  const newId = companies.length + 1;
  const name = `시뮬레이션 기업 ${newId} (업력 1년 미만)`;
  
  // Random dynamic key generation for demo
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const newKey = `HN-NEW-${randNum}`;

  companies.push({
    id: newId,
    name: name,
    type: "초기(1년 미만)",
    representative: "이민우 (34세, 남성)",
    invitationKey: newKey,
    metrics: { sales: "4,200천원", employees: "2명", reStartup: "아니오" },
    budget: { total: "40,000천원", execution: "1,500천원", rate: "3.7%", status: "danger" },
    education: { hr: "대기", accounting: "미이수", law: "미이수" },
    monitoringDoc: "미작성",
    coachingCount: 0,
    coachingLogs: [],
    chatMessages: [
      { sender: "coach", text: "신규 매칭을 환영합니다. 초기 사업 온보딩 상담을 준비해주세요.", time: "방금 전" }
    ]
  });

  alert(`🏢 ${name}가 새로 등록되었습니다.\n🔑 신규 가입 키: ${newKey}`);
  renderDashboard();
});
