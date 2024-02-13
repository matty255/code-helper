// Import necessary functions and data from other modules
import { prompt, validJSONPrompt } from "../constants/prompt.js";
import { postToApi } from "./apiService.js";
import { setCustomHint } from "./customHint.js";
import {
  addAnswerToList,
  addQuestionToList,
  hideLoadingOverlay,
  showLoadingOverlay,
  uiElements,
} from "./uiService.js";

let conversationData =
  JSON.parse(localStorage.getItem("conversationData")) || prompt;
let codeEditor = null; // 전역 스코프에 codeEditor 변수를 정의
let lastUserInput = "";

document.addEventListener("DOMContentLoaded", function () {
  const codeEditorElement = document.getElementById("code-editor");

  codeEditor = CodeMirror.fromTextArea(codeEditorElement, {
    lineNumbers: true,
    mode: "text/html",
    theme:
      document.body.getAttribute("data-theme") === "dark"
        ? "darcula"
        : "default",
    extraKeys: {
      "Shift-Enter": function (cm) {
        handleSubmit(); // Shift+Enter 눌렀을 때 handleSubmit 실행
      },
    },
    tabSize: 2,
    autoCloseTags: true,
    foldGutter: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
  });

  // 자동완성 기능을 사용자 입력에 반응하여 활성화
  codeEditor.on("inputRead", function (cm, event) {
    // 특정 조건(예: 공백이 아닐 때)에서만 자동완성 활성화
    if (event.text[0] && event.text[0].trim() !== "") {
      CodeMirror.commands.autocomplete(cm, null, {
        completeSingle: false,
        hint: setCustomHint,
      });
    }
  });

  codeEditor.on("change", function () {
    updatePreview(); // 사용자가 입력할 때마다 미리보기를 업데이트
  });
  // 로컬 스토리지에서 'assistant' 역할의 마지막 HTML 내용을 불러와서 코드 에디터에 설정
  if (localStorage.getItem("conversationData")) {
    const storedConversationData = JSON.parse(
      localStorage.getItem("conversationData")
    );
    const latestAssistantEntry = storedConversationData
      .reverse()
      .find(
        (item) =>
          item.role === "assistant" &&
          item.content &&
          JSON.parse(item.content).html
      );
    console.log(storedConversationData);

    const latestAssistantData = JSON.parse(latestAssistantEntry.content);
    if (latestAssistantEntry) {
      console.log(latestAssistantData, "html");
      console.log(
        "코드 에디터에 설정할 Assistant HTML 내용:",
        latestAssistantData.html
      );
      codeEditor.setValue(latestAssistantData.html);
      console.log("setValue 호출 후 코드 에디터 값:", codeEditor.getValue());
    } else {
      console.log("Assistant 역할을 가진 HTML 내용이 없습니다.");
    }
  } else {
    console.log("로컬 스토리지에 대화 데이터가 없습니다.");
  }

  function updatePreview() {
    const previewFrame = document.getElementById("preview");
    const preview =
      previewFrame.contentDocument || previewFrame.contentWindow.document;
    preview.open();
    preview.write(codeEditor.getValue());
    preview.close();
  }
  // 페이지 로드 시 미리보기를 초기화합니다.
  updatePreview();

  function updatePreview() {
    const previewFrame = document.getElementById("preview"); // 미리보기 iframe의 ID
    const preview =
      previewFrame.contentDocument || previewFrame.contentWindow.document;
    preview.open();
    preview.write(codeEditor.getValue());
    preview.close();
  }
  // 페이지 로드 시 로컬 스토리지에 저장된 데이터 확인 및 대화 목록에 추가
  if (localStorage.getItem("conversationData")) {
    const storedConversationData = JSON.parse(
      localStorage.getItem("conversationData")
    );
    storedConversationData.forEach((item) => {
      if (item.role === "user") {
        addQuestionToList(item.content);
      } else if (item.role === "assistant") {
        // role을 'assistant'로 변경
        addAnswerToList(item); // 수정된 코드
      }
    });
  }
});

// Form submission and API interaction logic
const handleSubmit = async () => {
  console.log("handleSubmit 함수가 호출되었습니다."); // 함수 호출 로그
  showLoadingOverlay();
  lastUserInput = codeEditor.getValue();

  // 사용자 입력 검증 로그
  if (!lastUserInput.trim()) {
    console.error("No user input to submit.");
    hideLoadingOverlay();
    return;
  }

  // 사용자 입력 로그
  console.log("사용자 입력:", lastUserInput);

  conversationData.push({ role: "user", content: lastUserInput });
  addQuestionToList(lastUserInput.concat(validJSONPrompt));

  try {
    const apiResponse = await postToApi(conversationData);
    console.log("API 응답 성공:", apiResponse);

    // content 필드에서 문자열을 JSON으로 파싱
    const contentString = apiResponse.choices[0].message.content;
    const contentObject = JSON.parse(contentString); // 여기에서 예외 발생 가능성 있음
    console.log("파싱된 content 객체:", contentObject);

    // 파싱된 객체에서 HTML 컨텐츠 접근
    if (contentObject && contentObject.html) {
      codeEditor.setValue(contentObject.html);
      console.log(
        "응답 내용을 코드 에디터에 설정했습니다.",
        contentObject.html
      );
    } else {
      console.error("HTML content is undefined");
    }
  } catch (error) {
    // JSON.parse 실패 또는 다른 오류 처리
    console.error("응답 파싱 실패 또는 처리 중 오류 발생:", error);
  } finally {
    hideLoadingOverlay();
    // UI 상태 업데이트 또는 정리 작업
  }

  localStorage.setItem("conversationData", JSON.stringify(conversationData));
};

// Assuming uiElements is an object with your UI element references
uiElements.form.addEventListener("submit", (event) => {
  event.preventDefault(); // 기본 폼 제출 방지
});
