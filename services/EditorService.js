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
          theme: "darcula",
          viewportMargin: Infinity,
          lineWrapping: true,
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
