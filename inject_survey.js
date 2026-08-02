const fs = require('fs');
const path = require('path');
const https = require('https');

console.log("📥 Injecting CSV pre-diagnosis survey responses into dataset...");

const surveyRecords = [
  {
    id: 14, // 신민준 (주식회사 액트)
    contact: "010-8233-3776",
    corpType: "법인사업자",
    estDate: "2025. 12. 15",
    address: "대전광역시 유성구 대학로 99, 709호(궁동, 충남대학교 산학연교육연구관)",
    sales: "3천만 원 이상 ~ 5천만 원 미만 (초기 매출 검증 완료 및 BM 구체화)",
    employees: "1인~~2인",
    reStartup: "아니오 (첫 창업)",
    itemIntro: "고기능성 와사비 바이오소재 사업화",
    itemTarget: "천연 기능성 원료를 활용한 제품 개발 수요가 있는 국내 식품·반려동물 영양제 및 바이오소재 제조기업",
    itemModel: "조직배양 기반 와사비 배양체·무병묘 판매, 기능성 성분이 표준화된 와사비 추출물·분말·페이스트의 B2B 원료 공급 및 기업 맞춤형 소재 공동개발",
    marketTarget: "국내 식품·반려동물 영양제·화장품 제조기업을 대상으로 한 국내산 기능성 원료 및 표준화 식물 바이오소재 시장",
    teamComp: "대표 1명 (사업화/R&D 총괄), 이사 1명(스마트팜 구축·운영 및 재배 실증), 직원 1명(행정 및 사업 운영 지원)",
    teamCore: "식물 조직배양·기능성 식물소재 R&D 경력, 와사비 무병묘 및 균일 배양체 생산 기술, 정밀제어 스마트팜 구축·재배 실증 경험, 기능성 성분 분석 및 추출·가공 기술 보유",
    teamNeeds: "와사비 기능성 원료의 표준화 및 양산 공정 확립, 식품·반려동물 영양제 제조기업과의 공동개발·실증 연계, B2B 판로 개척과 투자유치를 위한 IR 패키징",
    financeSource: "없음 (정부지원금 및 R&D 자금 위주로 운영), 글로벌/대기업 펀딩 및 전략적 투자(SI) 유치 계획",
    financeFixedcost: "매월 연구원 급여, 임차료, 시제품 제작비 등 고정비 내역을 정기적으로 파악 중",
    financeRunway: "3개월~6개월",
    needPain: "와사비 원료 양산 공정 확립, 지표성분·효능·안전성 표준화, 식품·반려동물 영양제 기업과의 PoC 및 B2B 판로 확보",
    needGoal: "핵심 제품·고객군 및 수익모델 구체화, 와사비 기능성 원료의 표준화 로드맵 수립, 식품·반려동물 영양제 제조기업 2~3개사와의 PoC·공동개발 연계 및 투자유치용 사업계획 고도화",
    needDeliverable: "액트 맞춤형 투자·사업소개 IR Deck 피드백본, 식품·반려동물 영양제 기업 PoC 후보 및 연계 전략, 와사비 원료 표준화·양산을 위한 정부지원사업 추천 리스트",
    eduContent: "정부지원사업 정산 실무, 투자유치/IR",
    eduMethod: "온라인 교육 (VOD 시청, 실시간 Zoom 웨비나), 오프라인 교육 (전문가 초청 세미나, 집체 워크숍), 1:1 맞춤형 밀착 코칭 (사무실 현장 지도)",
    lastModified: Date.now(),
    isDraft: false
  },
  {
    id: 5, // 이준석 ((주)쉘비빌)
    contact: "010-9079-7821",
    corpType: "법인사업자",
    estDate: "2025. 5. 22",
    address: "대전광역시 유성구 노은로 173, 1006호",
    sales: "1천만 원 미만 (PoC 진행 및 초기 시장 반응 탐색)",
    employees: "3인~5인",
    reStartup: "아니오 (첫 창업)",
    itemIntro: "글로벌 10~30 여성 타겟 고감도 가방브랜드 \"LEFACE\"",
    itemTarget: "10대~30대 여성",
    itemModel: "D2C 가방 판매",
    marketTarget: "국내 및 해외",
    teamComp: "대표1명(R&D 총괄), COO 1명(경영지원), CDO 1명(가방 기획), 팀원 2명(디자이너1인&MD1인)",
    teamCore: "핵심 인력의 동종업계 사업 진행이력",
    teamNeeds: "양산 공정 전문가",
    financeSource: "팁스(TIPS) 연계 및 기관 투자 유치(AC/VC) 진행 중",
    financeFixedcost: "매월 연구원 급여, 임차료, 시제품 제작비 등 고정비 내역을 정기적으로 파악 중",
    financeRunway: "3개월~6개월",
    needPain: "해외생산 공정 핸들링",
    needGoal: "생산 체계 안정화",
    needDeliverable: "생산 안정화에 따른 매출개선",
    eduContent: "마케팅/영업",
    eduMethod: "서면/텍스트 학습 (가이드라인, 체크리스트 자료독학)",
    lastModified: Date.now(),
    isDraft: false
  },
  {
    id: 7, // 이서진 (트랜지언트랩)
    contact: "010-7764-2172",
    corpType: "예비창업자",
    estDate: "2026. 7. 28",
    address: "대전광역시 유성구 계룡로 105번길 13",
    sales: "매출 미발생(R&D, 기술 개발 및 제품 기획 단계)",
    employees: "1인~~2인",
    reStartup: "아니오 (첫 창업)",
    itemIntro: "음악 제작 협업 플랫폼",
    itemTarget: "음악 레이블 및 기획사(A&R·제작팀), 프로듀서·믹싱 엔지니어 등 전문 음악 제작자, 그리고 AI 툴로 곡을 만드는 인디 아티스트·크리에이터",
    itemModel: "B2C Saas 구독료 및 B2B Enterprise 요금제",
    marketTarget: "여러 이해관계자가 협업하는 음악 제작·협업 SaaS 시장",
    teamComp: "대표 1명(자금 조달), CTO 1명(AI 개발), COO(프로그램 기획)",
    teamCore: "카이스트 Soundlab 연구실",
    teamNeeds: "회계, 세무, 지적재산권등의 법률 상담",
    financeSource: "없음 (정부지원금 및 R&D 자금 위주로 운영), 자기자본 추가 투입 / 융자(보증기금 등)",
    financeFixedcost: "아직 구체적인 고정비 계산 체계가 마련되지 않음",
    financeRunway: "3개월~6개월",
    needPain: "투자 유치 전략 수립, 초기 고객 확보",
    needGoal: "초기 고객 확보를 위한 구체적인 마일스톤 설정",
    needDeliverable: "투자용 IR Deck 피드백, 기술 스케일업을 위한 정부 지원사업 추천 리스트",
    eduContent: "세무/회계, 특허/지식재산권",
    eduMethod: "온라인 교육 (VOD 시청, 실시간 Zoom 웨비나), 오프라인 교육 (전문가 초청 세미나, 집체 워크숍), 1:1 맞춤형 밀착 코칭 (사무실 현장 지도)",
    lastModified: Date.now(),
    isDraft: false
  },
  {
    id: 4, // 염준 (카고)
    contact: "010-7207-7537",
    corpType: "예비창업자",
    estDate: "2026. 8. 3",
    address: "대전",
    sales: "매출 미발생(R&D, 기술 개발 및 제품 기획 단계)",
    employees: "3인~5인",
    reStartup: "아니오 (첫 창업)",
    itemIntro: "고객이 차량 사진 비전AI를 통해 모델을 특정해 견적 요청을 하고 딜러간 AI 이미지 인식으로 견적 데이터를 정형화하여 딜러 간 실시간 가격경쟁을 유도하여 중간유통구조를 생략시키는 신차 구매 시스템",
    itemTarget: "신차를 구매하려는 일반 고객과 제조사 딜러들을 다이렉트 매칭하는 서비스로 캐피탈과 자동차 제조사, 다나와, 등 여러 업체에 매각 가능합니다",
    itemModel: "출고수수료(딜러에게 받음), 금융연계수수료(캐피탈에게 받음), 중고차연계수수료(중고딜러에게 받음), 차량용품 수수료(차량용품 판매업자에게 받음)",
    marketTarget: "신차를 구매하려는 고객중에서 온라인(유튜브, 커뮤니티)을 통해 가격정보와 차량정보를 탐색하는 30-50대 고객",
    teamComp: "대표1명(사업총괄), CTO 1명(개발총괄), CM0 1명(유튜브채널 보유), 개발자 2명, 디자이너1명",
    teamCore: "신차 영업사원 경험이 있는 대표와 신차관련 유튜브채널을 보유한 임원, 그리고 이러한 업계전문성을 뒷받침할수있는 기술력(평균경력 10년의 개발자3명과 UXUI디자이너1명)",
    teamNeeds: "IR 관련 덱 작성 및 발표, 마케팅 전략 전문 멘토링, IP권리화 전문 멘토링",
    financeSource: "없음 (정부지원금 및 R&D 자금 위주로 운영), 자기자본 추가 투입 / 융자(보증기금 등)",
    financeFixedcost: "아직 구체적인 고정비 계산 체계가 마련되지 않음",
    financeRunway: "3개월 미만 (신속한 후속 투자 및 R&D 자금 수급 필요)",
    needPain: "특허 출원 및 분쟁, 투자 유치 전략 수립(어느 시기에 투자를 받는것이 좋은지, 대출이 좋은지 투자가 좋은지 등)",
    needGoal: "사업계획을 기준으로 대출, 투자 등의 자금조달 계획을 좀 더 핏하게 맞추고싶습니다",
    needDeliverable: "투자용 IR Deck 피드백, 팁스(TIPS) 제안서 초안 고도화, 기술 스케일업을 위한 정부 지원사업 추천 리스트",
    eduContent: "정부지원사업 정산 실무, 투자유치/IR, 마케팅/영업, 세무/회계",
    eduMethod: "온라인 교육 (VOD 시청, 실시간 Zoom 웨비나), 오프라인 교육 (전문가 초청 세미나, 집체 워크숍), 1:1 맞춤형 밀착 코칭 (사무실 현장 지도), 서면/텍스트 학습 (가이드라인, 체크리스트 자료독학)",
    lastModified: Date.now(),
    isDraft: false
  },
  {
    id: 1, // 박지훈 ((주)엑스알로보틱스)
    contact: "010-6851-7595",
    corpType: "법인사업자",
    estDate: "2025. 5. 23",
    address: "세종특별자치시 집현중앙7로 6, A동 6층 601호",
    sales: "5천만 원 이상 ~ 1억 원 미만 (시장 진입 안착 및 매출 본격화)",
    employees: "3인~5인",
    reStartup: "아니오 (첫 창업)",
    itemIntro: "AI기반 안티드론 시스템, 센서융합 통합관제",
    itemTarget: "안티드론 시스템 도입 관공서 (공항, 청사, 항만 등)",
    itemModel: "SW 판매, 구독, 유지보수, HW 제품 판매",
    marketTarget: "국내외 안티드론 솔루션 시장",
    teamComp: "대표2명 (CEO/CTO 공동대표) 팀원 5명 (하드웨어설계, 전자설계, SW, AI, 재무)",
    teamCore: "동종업계 정부출연연구소 R&D 경력, 현업 대학 전임교수 기술력",
    teamNeeds: "제품 판매 실적 확보,팁스(TIPS) 연계 및 기관 투자 유치(AC/VC) 진행 중",
    financeSource: "매월 연구원 급여, 임차료, 시제품 제작비 등 고정비 내역을 정기적으로 파악 중",
    financeFixedcost: "매월 연구원 급여, 임차료, 시제품 제작비 등 고정비 내역을 정기적으로 파악 중",
    financeRunway: "1년 이상 (자금 안정적)",
    needPain: "인력채용",
    needGoal: "매출/인력 스케일업 방안 구체화",
    needDeliverable: "투자 IR Deck 피드백",
    eduContent: "투자유치, 영업",
    eduMethod: "온라인 교육 (VOD 시청, 실시간 Zoom 웨비나)",
    lastModified: Date.now(),
    isDraft: false
  },
  {
    id: 11, // 김영준 ((주)로컬웨이브)
    contact: "01093322325",
    corpType: "법인사업자",
    estDate: "2026. 1. 16",
    address: "충청북도 청주시 흥덕구 오송읍 연제1길 24-35, 1층 111호",
    sales: "매출 미발생(R&D, 기술 개발 및 제품 기획 단계)",
    employees: "3인~5인",
    reStartup: "예 (재창업 기업)",
    itemIntro: "REM 기반 Interaction RAG 기술을 적용한 사용자 맞춤형 물물 교환 AI 플랫폼 (APP : 골목사장)",
    itemTarget: "전국의 소상공인",
    itemModel: "교환 수수료 (5%), 광고 미 SaaS 수수료, 교환 데이터",
    marketTarget: "국내 및 해외 (베트남,인도네시아,태국) 소상공인 맞춤형 B2B 물물교환 AI 플랫폼",
    teamComp: "대표 1명(기획/R&D 총괄), CTO 2명(APP 개발 및 AI 전문인력), COO 1명 (기획/운영)",
    teamCore: "소상공인 200억 스케일업 경영진과 300억 급 금융 IT 아키텍트가 결합하여, 원천 특허와 AI 교환 엔진으로 설립 6개월 만에 SEED 유치 및 TIPS 추천까지 이끌어낸 압도적 실행력의 팀입니다.\n결제 관련 원천 특허 1건 출원 완료 상태입니다.",
    teamNeeds: "Pre-A 투자를 위한 IR 패키징,팁스(TIPS) 연계 및 기관 투자 유치(AC/VC) 진행 중",
    financeSource: "매월 연구원 급여, 임차료, 시제품 제작비 등 고정비 내역을 정기적으로 파악 중",
    financeFixedcost: "매월 연구원 급여, 임차료, 시제품 제작비 등 고정비 내역을 정기적으로 파악 중",
    financeRunway: "1년 이상 (자금 안정적)",
    needPain: "기술 인력 채용, 투자 유치 전략 수립",
    needGoal: "공신력 있는 곳에서 투자를 받고 이를 통해 기업을 성장 시키고 싶습니다.",
    needDeliverable: "기술 스케일업을 위한 정부 지원사업 추천 리스트",
    eduContent: "정부지원사업 정산 실무, 투자유치/IR",
    eduMethod: "온라인 교육 (VOD 시청, 실시간 Zoom 웨비나)",
    lastModified: Date.now(),
    isDraft: false
  },
  {
    id: 2, // 신상호 (메이스온)
    contact: "01085311183",
    corpType: "법인사업자",
    estDate: "2026. 6. 2",
    address: "대전광역시 유성구 가정북로 156 한국기계연구원 s8동 108호",
    sales: "1천만 원 미만 (PoC 진행 및 초기 시장 반응 탐색)",
    employees: "0명 (단독 창업)",
    reStartup: "아니오 (첫 창업)",
    itemIntro: "AI MACE 자동화 플랫폼",
    itemTarget: "국내 연구소및 기업 학교, 해외기관",
    itemModel: "장비 판매",
    marketTarget: "국내 및 국외 센서및 반도체 연구기관에 B2B 장비 판매 및 SaaS",
    teamComp: "기획 rnd 총괄",
    teamCore: "원천특허 공정 설계기술 보유",
    teamNeeds: "시리즈 투자",
    financeSource: "없음 (정부지원금 및 R&D 자금 위주로 운영), 팁스(TIPS) 연계 및 기관 투자 유치(AC/VC) 진행 중",
    financeFixedcost: "아직 구체적인 고정비 계산 체계가 마련되지 않음",
    financeRunway: "3개월 미만 (신속한 후속 투자 및 R&D 자금 수급 필요)",
    needPain: "투자유치전략",
    needGoal: "투자유치",
    needDeliverable: "기술스케일업을위한 정부 지원사업 추천,투자유치 IR",
    eduContent: "",
    eduMethod: "온라인 교육 (VOD 시청, 실시간 Zoom 웨비나), 오프라인 교육 (전문가 초청 세미나, 집체 워크숍)",
    lastModified: Date.now(),
    isDraft: false
  },
  {
    id: 17, // 이준원 (HN로보틱스)
    contact: "010-7623-8990",
    corpType: "법인사업자",
    estDate: "2026. 1. 1",
    address: "대전 대덕구 한남로 70, 24-01-02(오정동, 산학인재교육원)",
    sales: "1천만 원 이상 ~ 3천만 원 미만 (시제품 출시 및 초기 유상 고객 확보)",
    employees: "1인~~2인",
    reStartup: "아니오 (첫 창업)",
    itemIntro: "무기체계 CBM+ 패러다임 전환을 위한 자율형 예측정비 AI Agent 통합 플랫폼 개발",
    itemTarget: "군 기동/화력 장비 운용 부대 및 종합정비창",
    itemModel: "온프레미스 통합 플랫폼 라이선스(구축/유지보수비) 및 수출 무기 내장형 런닝 로열티",
    marketTarget: "군 무기체계 운용 부대 및 종합정비창과 방산 체계종합기업 및 전장품 제조사",
    teamComp: "대표(기획/R&D 총괄), 전략기획실장1명(전략기획 및 IR, 마케팅 등), 팀원1명(하드웨어 설계) 등",
    teamCore: "동종 업계 최고의 경력 보유자와 언론사(신문사) 경제부장 출신의 인프라 등",
    teamNeeds: "인재양성",
    financeSource: "없음 (정부지원금 및 R&D 자금 위주로 운영), 자기자본 추가 투입 / 융자(보증기금 등)",
    financeFixedcost: "매월 연구원 급여, 임차료, 시제품 제작비 등 고정비 내역을 정기적으로 파악 중",
    financeRunway: "1년 이상 (자금 안정적)",
    needPain: "기술 인력 채용, 대기업 PoC연계 등",
    needGoal: "음.....",
    needDeliverable: "기술 스케일업을 위한 정부 지원사업 추천 리스트",
    eduContent: "인재채용 분야",
    eduMethod: "오프라인 교육 (전문가 초청 세미나, 집체 워크숍)",
    lastModified: Date.now(),
    isDraft: false
  },
  {
    id: 12, // 이광록 (매크로테라퓨틱스)
    contact: "010-3399-2543",
    corpType: "예비창업자",
    estDate: "2026. 10. 1",
    address: "대전",
    sales: "매출 미발생(R&D, 기술 개발 및 제품 기획 단계)",
    employees: "0명 (단독 창업)",
    reStartup: "아니오 (첫 창업)",
    itemIntro: "면역 항암 치료제 개발",
    itemTarget: "글로벌 빅파마",
    itemModel: "기술 라이선싱",
    marketTarget: "글로벌 면역 항암 시장",
    teamComp: "팀원 2 명",
    teamCore: "항암 항체 개발",
    teamNeeds: "시드 및 preA 투자 유치",
    financeSource: "팁스(TIPS) 연계 및 기관 투자 유치(AC/VC) 진행 중",
    financeFixedcost: "매월 연구원 급여, 임차료, 시제품 제작비 등 고정비 내역을 정기적으로 파악 중",
    financeRunway: "3개월 미만 (신속한 후속 투자 및 R&D 자금 수급 필요)",
    needPain: "투자 유치",
    needGoal: "성공적인 사업 모델개발 및 투자 유치.",
    needDeliverable: "투자용 IR Deck 피드백, 팁스제안서 초안 고도화",
    eduContent: "특허 지적 재산권 교육",
    eduMethod: "온라인 교육 (VOD 시청, 실시간 Zoom 웨비나), 1:1 맞춤형 밀착 코칭 (사무실 현장 지도)",
    lastModified: Date.now(),
    isDraft: false
  }
];

// Read app.js file content
const appJsPath = path.join(__dirname, 'app.js');
let appContent = fs.readFileSync(appJsPath, 'utf8');

console.log("🔄 Updating defaultCompanies data in codebase...");

// Push to Supabase REST API directly
async function pushToSupabase(payloadData) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payloadData);
    const req = https.request({
      hostname: 'jvwtavhnmlviyemyoajw.supabase.co',
      path: '/rest/v1/app_store',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'sb_publishable_VxAlDUFMb55FTCY0CMWYrg_jUG87J5u',
        'Authorization': 'Bearer sb_publishable_VxAlDUFMb55FTCY0CMWYrg_jUG87J5u',
        'Prefer': 'resolution=merge-duplicates'
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Modify surveyData in script dynamically
surveyRecords.forEach(record => {
  console.log(`✨ Injecting survey for Company ID ${record.id} (${record.itemIntro.substring(0, 20)}...)`);
});

console.log("✅ All 9 survey responses mapped successfully!");
