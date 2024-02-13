document.querySelector(".theme-toggle").addEventListener("click", () => {
  const body = document.body;
  const isDark = body.getAttribute("data-theme") === "dark";
  body.setAttribute("data-theme", isDark ? "light" : "dark");

  // CodeMirror 테마 변경
  if (codeEditor) {
    codeEditor.setOption("theme", isDark ? "default" : "darcula");
  }
});
