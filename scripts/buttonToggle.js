function toggleMoveElement(toggleButtonSelector, targetSelector, direction) {
  let isVisible = true; // 초기 상태는 보이는 상태로 설정

  $(toggleButtonSelector).click(function () {
    if (isVisible) {
      if (direction === -100) {
        $(targetSelector).css({
          transform: "translateX(-100%)",
          transition: "transform 0.5s ease-in-out",
        });
      } else if (direction === 100) {
        $(targetSelector).css({
          transform: "translateX(100%)",
          transition: "transform 0.5s ease-in-out",
        });
      }
    } else {
      // 원래 위치로 돌아오게 설정

      $(targetSelector).css("transform", "translateX(0)");
    }
    isVisible = !isVisible; // 토글 상태 업데이트
  });
}

$(document).ready(function () {
  // 채팅 섹션을 왼쪽으로 이동
  let isMobile = window.matchMedia("screen and (max-width: 767px)").matches;
  if (!isMobile) {
    toggleMoveElement("#toggle-chat", "#chat-section", 100);
  }

  toggleMoveElement("#toggle-chat", "#editor-section", -100);
  toggleMoveElement("#toggle-preview", "#preview", 100);

  // 다른 섹션을 오른쪽으로 이동하는 데 사용할 수도 있습니다.
  // 예: toggleMoveElement('#another-toggle-btn', '#another-section', 100);
});
