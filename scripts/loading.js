// 모든 요소가 로드된 후 로딩 창을 숨김
window.onload = function () {
  var loadingElement = document.getElementById("global-loading");
  if (loadingElement) {
    loadingElement.classList.add("a11y");
  }
};
