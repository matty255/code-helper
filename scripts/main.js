// utils.js에서 필요한 함수들을 불러옵니다.
import { prompt } from "../constants/prompt.js";
import UiGenerator from "../services/ChatUIService.js";
import ConversationService from "../services/ConversationServices.js";
import SetEditorValueService from "../services/SetEditorValueService.js";
import {
  createUserData,
  ensureProperEncodingAndEscaping,
  removeIdFromData,
  removeIdFromDataArray,
} from "../utils/utils.js";
import { submitDataToApi } from "./apiRequests.js";

const ChatUI = new UiGenerator();

const storedData = localStorage.getItem("conversationData")
  ? JSON.parse(localStorage.getItem("conversationData"))
  : [];

const conversationService = new ConversationService("conversationData", [
  ...prompt,
  ...storedData,
]);

const editorService = new SetEditorValueService(
  updatePreview,
  conversationService
);
ChatUI.setEditorService(editorService);

function updatePreview() {
  const htmlContent = editorService.getEditorValue("html");
  const cssContent = `<style>${editorService.getEditorValue("css")}</style>`;
  const jsContent = `<script>${editorService.getEditorValue("js")}</script>`;

  const previewFrame = document.getElementById("preview");
  const preview =
    previewFrame.contentDocument || previewFrame.contentWindow.document;
  preview.open();
  preview.write(htmlContent + cssContent + jsContent);
  preview.close();
}

function handleWindowLoad() {
  editorService.loadEditorData();
  loadStoredData();
  editorService.initThemeToggle();
  setTimeout(() => ChatUI.hideLoadingOverlay(), 2000);
}

function handleDOMContentLoaded() {
  ChatUI.setupTabSwitching();
  setupCodeSubmission();
}

function loadStoredData() {
  const storedData = conversationService.getData(conversationService.dataKey);

  storedData.forEach((data) => {
    if (data.role === "user") {
      ChatUI.addQuestionToList(data, () => removeMessage(data));
    } else if (data.role === "assistant") {
      ChatUI.addAnswerToList(data, () => removeMessage(data));
    }
  });
}

function removeMessage(data) {
  conversationService.removeData(data.id);
  ChatUI.removeMessageFromList(data.id);
}

let isSubmitting = false; // 중복 요청 방지를 위한 플래그

async function collectAndSendCode() {
  if (isSubmitting) {
    console.log("이미 코드 제출이 진행 중입니다. 중복 요청을 방지합니다.");
    return;
  }

  isSubmitting = true;
  ChatUI.showLoadingOverlay();
  let codeData = editorService.collectCodeData();
  codeData = removeIdFromData(codeData);

  console.log("Sending code data to API:", codeData);

  try {
    const apiResponse = await submitDataToApi([
      ...removeIdFromDataArray(conversationService.data),
      createUserData(codeData),
    ]);
    conversationService.addData(createUserData(codeData));
    processApiResponse(apiResponse);
  } catch (error) {
    console.error("Error to API:", error);
  } finally {
    ChatUI.hideLoadingOverlay();
    isSubmitting = false;
  }
}

function processApiResponse(apiResponse) {
  console.log("API 응답:", apiResponse);
  try {
    const resultContent = ensureProperEncodingAndEscaping(
      apiResponse.choices[0].message.content
    );
    const data = JSON.parse(resultContent);

    conversationService.addData(apiResponse.choices[0].message);
    displayApiResponse(data, apiResponse.choices[0].message);
  } catch (error) {
    console.error("API 응답 처리 중 에러 발생:", error);
    // 필요한 경우 여기서 에러 핸들링 로직을 추가할 수 있습니다.
  }
}

function displayApiResponse(data, message) {
  ChatUI.addQuestionToList(
    {
      id: message.id,
      content: data.html, // 질문 내용으로 description 사용
    },
    () => ChatUI.removeMessageFromList(message.id)
  );

  // 답변 추가 (여기서는 답변 내용을 직접 만들지 않고 클릭 이벤트를 통해 모달을 보여주는 방식을 예시로 들었습니다.)
  ChatUI.addAnswerToList(
    {
      id: message.id,
      content: JSON.stringify({ description: "자세히 보기" }), // 사용자 정의 내용
    },
    () => ChatUI.removeMessageFromList(message.id)
  );
  editorService.extractAndSetCode(data);
}

function setupCodeSubmission() {
  Object.values(editorService.editors).forEach((editor) => {
    editor.setOption("extraKeys", {
      "Ctrl-Enter": collectAndSendCode,
    });
  });
}

// 이벤트 리스너
window.addEventListener("load", handleWindowLoad);
document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);
