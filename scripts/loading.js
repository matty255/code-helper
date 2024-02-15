// 로딩중 텍스트 애니메이션 함수 정의
function animateLoadingText() {
  const loadingElement = document.querySelector(".loading-overlay");
  let loadingText = "로딩중입니다";
  let dots = "";
  loadingElement.textContent = loadingText;

  setInterval(() => {
    if (dots.length < 3) {
      dots += ".";
    } else {
      dots = "";
    }
    loadingElement.textContent = `${loadingText}${dots}`;
  }, 500); // 500ms 간격으로 반복
}

// 페이지 로드 완료 시 실행될 함수
window.onload = function () {
  // 로딩중 텍스트 애니메이션 시작
  animateLoadingText();

  // 로딩 요소 숨김 처리
  var loadingElement = document.getElementById("global-loading");
  if (loadingElement) {
    loadingElement.classList.add("a11y"); // 'a11y' 클래스를 추가하여 접근성을 고려한 숨김 처리를 함
  }
};
