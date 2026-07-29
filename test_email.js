const url = "https://script.google.com/macros/s/AKfycbwMO0h5m247mBUwTkt_yDWqxOKajOV7xMO5_lCiGUGZ-L1ivQFFxkwuMgqjLKEl_SBD/exec";

console.log("구글 서버로 테스트 메일 신호를 발송합니다...");

fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    action: "sendChatMessageAlert",
    companyName: "로컬 노드 테스트 기업",
    representative: "노드 개발자",
    text: "이것은 노드 스크립트에서 직접 발송한 연동 테스트 메일입니다! 작동 여부를 확인해 주세요.",
    time: new Date().toLocaleTimeString(),
    hasFile: false,
    senderRole: "coach"
  })
})
.then(r => r.text())
.then(t => {
  console.log("구글 서버 응답 결과:", t);
  console.log("완료! 메일함(osy0922@hnu.kr) 또는 스팸메일함을 확인해 주세요.");
})
.catch(err => {
  console.error("오류 발생:", err);
});
