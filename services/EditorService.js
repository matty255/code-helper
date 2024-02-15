export default class EditorService {
  constructor(updatePreviewCallback) {
    this.editors = {};
    this.updatePreviewCallback = updatePreviewCallback;
    this.initEditors();
    this.initThemeToggle();
  }

  initEditors() {
    const editorConfigs = {
      html: {
        id: "html-editor",
        mode: "text/html",
        extraKeys: { "Ctrl-Space": "autocomplete" },
      },
      css: {
        id: "css-editor",
        mode: "css",
        extraKeys: { "Ctrl-Space": "autocomplete" },
      },
      js: {
        id: "js-editor",
        mode: "javascript",
        extraKeys: { "Ctrl-Space": "autocomplete" },
      },
    };

    Object.entries(editorConfigs).forEach(([lang, config]) => {
      this.editors[lang] = CodeMirror.fromTextArea(
        document.getElementById(config.id),
        {
          lineNumbers: true,
          mode: config.mode,
          theme: "darcula",
          viewportMargin: Infinity,
          lineWrapping: true,
          autoCloseTags: true,
          autoCloseBrackets: true,
          extraKeys: { "Ctrl-Space": "autocomplete" },
        }
      );

      this.editors[lang].on("change", () => {
        if (this.updatePreviewCallback) {
          this.updatePreviewCallback();
        }
      });

      this.editors[lang].getWrapperElement().style.fontSize = "16px";
      this.editors[lang].getWrapperElement().style.height = "100vh";
      this.editors[lang].getWrapperElement().style.fontFamily = "HappinessSans";
    });
  }

  initThemeToggle() {
    document.querySelector(".theme-toggle").addEventListener("click", () => {
      const body = document.body;
      const isDark = body.getAttribute("data-theme") === "dark";
      body.setAttribute("data-theme", isDark ? "light" : "dark");

      // 배경색 변경
      body.style.backgroundColor = isDark ? "#ffffff" : "#121212";

      // CodeMirror 테마 변경
      Object.values(this.editors).forEach((editor) => {
        editor.setOption("theme", isDark ? "juejin" : "material-darker");
      });
    });
  }

  getEditorValue(lang) {
    return this.editors[lang]?.getValue() || "";
  }

  setEditorValue(lang, value) {
    if (this.editors[lang]) {
      this.editors[lang].setValue(value);
    }
  }

  collectCodeData() {
    return Object.keys(this.editors).reduce((acc, lang) => {
      acc[lang] = this.getEditorValue(lang);
      return acc;
    }, {});
  }
}
