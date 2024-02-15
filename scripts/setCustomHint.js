import { setCustomHint } from "./setCustomHint.js"; // 커스텀 힌트 함수 가져오기

export default class EditorService {
  constructor(updatePreviewCallback) {
    this.editors = {};
    this.updatePreviewCallback = updatePreviewCallback;
    this.initEditors();
  }

  initEditors() {
    const editorConfigs = {
      html: { id: "html-editor", mode: "text/html" },
      css: { id: "css-editor", mode: "css" },
      js: { id: "js-editor", mode: "javascript" },
    };

    Object.entries(editorConfigs).forEach(([lang, config]) => {
      this.editors[lang] = CodeMirror.fromTextArea(
        document.getElementById(config.id),
        {
          lineNumbers: true,
          mode: config.mode,
          theme:
            localStorage.getItem("data-theme") === "light"
              ? "default"
              : "darcula", // Check data-theme and set theme accordingly
          viewportMargin: Infinity,
          lineWrapping: true,
          hintOptions: { completeSingle: false, customHint: setCustomHint }, // Enable code autocompletion with custom hint function
          matchTags: { bothTags: true }, // Enable auto-closing tags
          extraKeys: { "Ctrl-Space": "autocomplete" }, // Trigger autocomplete on Ctrl + Space
        }
      );

      this.editors[lang].on("change", () => {
        if (this.updatePreviewCallback) {
          this.updatePreviewCallback();
        }
      });

      this.editors[lang].getWrapperElement().style.height = "100vh";
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
