// 스플릿터와 아이프레임 요소
const splitter = document.querySelector(".splitter");
const iframeContainer = document.getElementById("iframe-container");

// 이전 마우스 위치 저장 변수
let prevMouseX = 0;

// 스플릿터를 드래그하는 이벤트 핸들러
function handleDrag(e) {
  // 마우스 이동량 계산
  const deltaX = e.clientX - prevMouseX;

  // 이동량에 따라 섹션의 너비를 조정
  const chatSection = document.getElementById("chat-section");
  const editorSection = document.getElementById("editor-section");
  chatSection.style.width = `${chatSection.offsetWidth + deltaX}px`;
  editorSection.style.width = `${editorSection.offsetWidth - deltaX}px`;

  // 아이프레임의 너비를 조정
  iframeContainer.style.width = `${iframeContainer.offsetWidth - deltaX}px`;

  // 마우스 위치 업데이트
  prevMouseX = e.clientX;
}

// 마우스 이벤트 리스너 추가
splitter.addEventListener("mousedown", (e) => {
  prevMouseX = e.clientX;
  document.addEventListener("mousemove", handleDrag);
});

// 마우스 이벤트 리스너 제거
document.addEventListener("mouseup", () => {
  document.removeEventListener("mousemove", handleDrag);
});
