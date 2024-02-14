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
      if (lang === "html") {
        this.editors[lang] = CodeMirror.fromTextArea(
          document.getElementById(config.id),
          {
            lineNumbers: true,
            mode: "text/html", // 멀티플렉스 모드 대신 기본 HTML 모드 사용
            theme: "darcula",
            viewportMargin: Infinity,
            lineWrapping: true,
          }
        );
      } else {
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
      }

      // 에디터 내용 변경 시 로직
      this.editors[lang].on("change", (editor) => {
        if (this.updatePreviewCallback) {
          this.updatePreviewCallback();
        }
        if (lang === "html") {
          this.extractAndSetCode();
        }
      });

      this.editors[lang].getWrapperElement().style.height = "100vh";
    });
  }

  // HTML 내의 CSS와 JS 추출 및 해당 에디터에 설정
  extractAndSetCode() {
    const htmlContent = this.editors.html.getValue();
    const cssContent = this.extractContent(htmlContent, "<style>", "</style>");
    const jsContent = this.extractContent(htmlContent, "<script>", "</script>");

    if (cssContent && this.editors.css) {
      this.editors.css.setValue(cssContent);
    }
    if (jsContent && this.editors.js) {
      this.editors.js.setValue(jsContent);
    }
  }

  // 내용 추출 함수
  extractContent(source, startTag, endTag) {
    const regex = new RegExp(`${startTag}([\\s\\S]*?)${endTag}`, "i");
    const match = source.match(regex);
    return match ? match[1].trim() : "";
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
