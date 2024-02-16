// 스플릿터와 아이프레임 요소
const splitter = document.querySelector(".splitter");
const iframeContainer = document.getElementById("iframe-container");

// 이전 마우스 위치 저장 변수
let prevMouseX = 0;

// 스플리터 드래그 시작 시 선택 방지를 위한 스타일 적용 함수
function disableTextSelection() {
  document.body.style.userSelect = "none";
  document.body.style.webkitUserSelect = "none"; // Chrome, Safari용
  document.body.style.mozUserSelect = "none"; // Firefox용
  document.body.style.msUserSelect = "none"; // IE, Edge용
}

// 스플리터 드래그 종료 시 선택 가능한 스타일 복원 함수
function enableTextSelection() {
  document.body.style.removeProperty("user-select");
  document.body.style.removeProperty("-webkit-user-select");
  document.body.style.removeProperty("-moz-user-select");
  document.body.style.removeProperty("-ms-user-select");
}

// 스플리터를 드래그하는 이벤트 핸들러
function handleDrag(e) {
  e.preventDefault(); // 기본 드래그 동작 방지

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
  disableTextSelection(); // 드래그 시작 시 텍스트 선택 방지
  document.addEventListener("mousemove", handleDrag);
});

// 마우스 이벤트 리스너 제거 및 텍스트 선택 복원
document.addEventListener("mouseup", () => {
  document.removeEventListener("mousemove", handleDrag);
  enableTextSelection(); // 드래그 종료 시 텍스트 선택 가능
});
