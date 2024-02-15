document.querySelector(".theme-toggle").addEventListener("click", () => {
  const body = document.body;
  const toggleButton = document.getElementById("toggleButton"); // 토글 버튼 참조

  // 테마 변경
  const isDark = body.getAttribute("data-theme") === "dark";
  body.setAttribute("data-theme", isDark ? "light" : "dark");

  // 토글 버튼 위치 변경
  toggleButton.classList.toggle("translate-x-8");
});
