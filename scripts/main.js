import { prompt } from "../constants/prompt.js";
import UiGenerator from "../services/ChatUIService.js";
import ConversationService from "../services/ConversationServices.js";
import SetEditorValueService from "../services/SetEditorValueService.js";
import {
  ensureProperEncodingAndEscaping,
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

let isSubmitting = false; // 중복 요청 방지를 위한 플래그

async function sendRequestToApi(data, isEditorRequest = false) {
  if (isSubmitting) {
    console.log("이미 요청이 진행 중입니다. 중복 요청을 방지합니다.");
    return;
  }

  isSubmitting = true;
  ChatUI.showLoadingOverlay();

  const messageContent = isEditorRequest
    ? JSON.stringify({ html: data.html, css: data.css, js: data.js })
    : JSON.stringify({ description: data.description });
  const message = { role: "user", content: messageContent };

  // 메시지 로컬 스토리지에 추가하고 id를 유지
  conversationService.addData(message);

  // 대화 데이터 가져오기 및 id 제거
  let conversationData = conversationService.getData(
    conversationService.dataKey
  );
  // API 요청 시 'id' 필드 제거
  const requestData = removeIdFromDataArray([...conversationData]);

  try {
    const apiResponse = await submitDataToApi(requestData);
    console.log("API Response:", apiResponse);
    processApiResponse(apiResponse, isEditorRequest, message.id);
  } catch (error) {
    console.error("Error sending request to API:", error);
  } finally {
    ChatUI.hideLoadingOverlay();
    isSubmitting = false;
  }
}

function processApiResponse(apiResponse, isEditorRequest, messageId) {
  console.log("API 응답:", apiResponse);
  try {
    const resultContent = ensureProperEncodingAndEscaping(
      apiResponse.choices[0].message.content
    );
    const data = JSON.parse(resultContent);

    if (!isEditorRequest) {
      conversationService.addData(apiResponse.choices[0].message);
    }

    displayApiResponse(data, messageId);
  } catch (error) {
    console.error("API 응답 처리 중 에러 발생:", error);
  }
}

function displayApiResponse(data, messageId) {
  ChatUI.addAnswerToList(
    { id: messageId, content: data.html || data.description },
    () => removeMessage(messageId)
  );
  if (data.code) {
    editorService.extractAndSetCode(data);
  }
}

function setupFormSubmission() {
  document
    .getElementById("codeSubmissionForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const description = document.getElementById("description").value;
      sendRequestToApi({ description: description });
    });
}

function setupEditorSubmission() {
  Object.values(editorService.editors).forEach((editor) => {
    editor.setOption("extraKeys", {
      "Ctrl-Enter": () => {
        const codeData = editorService.collectCodeData();
        sendRequestToApi(codeData, true);
      },
    });
  });
}

function handleWindowLoad() {
  editorService.loadEditorData();
  loadStoredData();
  editorService.initThemeToggle();
  setTimeout(() => ChatUI.hideLoadingOverlay(), 2000);
}

function handleDOMContentLoaded() {
  ChatUI.setupTabSwitching();
  setupFormSubmission();
  setupEditorSubmission();
}

function loadStoredData() {
  const storedData = conversationService.getData(conversationService.dataKey);
  storedData.forEach((data) => {
    if (data.role === "user") {
      // 사용자가 질문을 삭제할 수 있도록 removeMessage 함수를 콜백으로 전달합니다.
      ChatUI.addQuestionToList(data, () => removeMessage(data.id));
    } else if (data.role === "assistant") {
      // 사용자가 답변을 삭제할 수 있도록 removeMessage 함수를 콜백으로 전달합니다.
      ChatUI.addAnswerToList(data, () => removeMessage(data.id));
    }
  });
}

function removeMessage(id) {
  // confirm 대화 상자에서 '확인'을 선택한 경우에만 삭제를 진행합니다.
  const isConfirmed = confirm(
    "삭제된 컨텐츠는 복구할 수 없습니다. 계속하시겠습니까?"
  );

  if (isConfirmed) {
    // '확인'을 선택한 경우, 메시지를 UI 목록과 로컬 스토리지에서 삭제합니다.
    ChatUI.removeMessageFromList(id);
    conversationService.removeData(id);
  }
}

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

// 이벤트 리스너
window.addEventListener("load", handleWindowLoad);
document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);
