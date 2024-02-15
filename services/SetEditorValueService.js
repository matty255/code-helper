import EditorService from "./EditorService.js";

export default class SetEditorValueService extends EditorService {
  constructor(updatePreviewCallback, conversationService) {
    super(updatePreviewCallback);
    this.conversationService = conversationService;
  }

  // 데이터 구조에 맞게 에디터 값을 설정하는 메소드
  setEditorValues(assistantData) {
    Object.keys(this.editors).forEach((lang) => {
      let content = assistantData[lang] || "";
      this.setEditorValue(lang, content);
    });
  }

  // 로컬 스토리지에서 에디터 초기 데이터를 로딩하는 메소드
  loadEditorData() {
    const assistantData = this.getAssistantData();
    // assistantData를 바탕으로 에디터 값을 설정
    if (assistantData.html) {
      this.extractAndSetCode(assistantData);
    } else {
      // Fallback: assistantData가 HTML, CSS, JS 구조를 따르지 않을 경우
      this.setEditorValues(assistantData);
    }
  }

  // ConversationService에서 assistant 역할의 데이터를 추출하는 메소드
  getAssistantData() {
    return this.conversationService.data
      .filter((item) => item.role === "assistant")
      .reduce((acc, item) => {
        try {
          // // console.log("Parsing content:", item.content);
          const content = JSON.parse(item.content);
          return { ...acc, ...content };
        } catch (e) {
          console.error(
            "Error parsing assistant data:",
            e,
            "in content:",
            item.content
          );
          return acc;
        }
      }, {});
  }

  // HTML 내의 CSS와 JS 추출 및 해당 에디터에 설정
  extractAndSetCode(content) {
    const htmlContent = content.html || "";
    // // console.log("Extracted HTML Content:", htmlContent);

    // CSS와 JS 추출
    const cssContent = this.extractContent(htmlContent, "<style>", "</style>");
    const jsContent = this.extractContent(htmlContent, "<script>", "</script>");

    // 추출된 CSS와 JS를 제외한 HTML 내용 업데이트
    const cleanedHtmlContent = htmlContent
      .replace(/<style>[\s\S]*?<\/style>/, "")
      .replace(/<script>[\s\S]*?<\/script>/, "");
    // // console.log("Cleaned HTML Content:", cleanedHtmlContent);

    // 각각의 내용을 해당하는 에디터에 설정
    this.setEditorValue("html", cleanedHtmlContent);
    this.setEditorValue("css", cssContent);
    this.setEditorValue("js", jsContent);
  }

  // 내용 추출 함수
  extractContent(source, startTag, endTag) {
    const regex = new RegExp(`${startTag}([\\s\\S]*?)${endTag}`, "i");
    const match = source.match(regex);
    return match ? match[1].trim() : "";
  }
}
