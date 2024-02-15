document.addEventListener("DOMContentLoaded", function () {
  var lottieAnimation = lottie.loadAnimation({
    container: document.getElementById("lottie"), // 애니메이션을 로드할 컨테이너 지정
    renderer: "svg", // 'svg', 'canvas', 'html' 중 하나를 사용하여 렌더링 방식 지정
    loop: true, // 애니메이션 반복 여부
    autoplay: true, // 자동 재생 여부
    path: "../assets/images/lotties/loading-animation-robot.json", // 애니메이션 데이터의 경로
  });
  // 모든 요소가 로드된 후 로딩 창을 숨김
  window.onload = function () {
    var loadingElement = document.getElementById("global-loading");
    if (loadingElement) {
      loadingElement.classList.add("a11y");
      lottieAnimation.destroy(); // 로딩 완료 후 애니메이션 제거
    }
  };
});
