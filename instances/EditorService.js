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
        }
      );

      // 에디터 내용이 변경될 때마다 프리뷰 업데이트
      this.editors[lang].on("change", () => {
        if (this.updatePreviewCallback) {
          this.updatePreviewCallback();
        }
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

  // 모든 에디터의 내용을 객체로 반환
  collectCodeData() {
    return Object.keys(this.editors).reduce((acc, lang) => {
      acc[lang] = this.getEditorValue(lang);
      return acc;
    }, {});
  }
}
