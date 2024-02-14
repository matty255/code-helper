// main.js
// TODO: 삭제 및 수정 기능 작동하게.
// 모바일 디자인
// 클릭으로 복사 기능
// 채팅창 관련 디자인

import { prompt } from "../constants/prompt.js";
import ConversationService from "../instances/ConversationService.js";
import EditorService from "../instances/EditorService.js";
import UiGenerator from "../instances/UiGenerator.js";
import {
  createUserData,
  ensureProperEncodingAndEscaping,
  removeIdFromData,
  removeIdFromDataArray,
} from "../utils/utils.js";
import { postToApi } from "./apiService.js";

const ChatUI = new UiGenerator();

const editorService = new EditorService(updatePreview);

ChatUI.setEditorService(editorService);

const storedData = localStorage.getItem("conversationData")
  ? JSON.parse(localStorage.getItem("conversationData"))
  : [];

const conversationService = new ConversationService("conversationData", [
  ...prompt,
  ...storedData,
]);
console.log(conversationService.data);

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

// 이벤트 핸들러 분리
function handleWindowLoad() {
  loadStoredData();
  setTimeout(() => ChatUI.hideLoadingOverlay(), 2000);
}

function handleDOMContentLoaded() {
  loadEditorData();
  ChatUI.setupTabSwitching();
  setupCodeSubmission();
}

// 데이터 로딩 관련 로직
function loadStoredData() {
  const storedData = conversationService.getData(conversationService.dataKey);

  storedData.forEach((data) => {
    if (data.role === "user") {
      console.log("질문:", data.content);
      ChatUI.addQuestionToList(data, () => removeMessage(data));
    } else if (data.role === "assistant") {
      console.log("답변:", data.content);
      ChatUI.addAnswerToList(data, () => removeMessage(data));
    }
  });
}

function removeMessage(data) {
  conversationService.removeData(data.id);
  ChatUI.removeMessageFromList(data.id);
}

function loadEditorData() {
  const assistantData = getAssistantData();
  setEditorValues(assistantData);
}

function getAssistantData() {
  return conversationService.data
    .filter((item) => item.role === "assistant")
    .reduce((acc, item) => {
      try {
        const content = JSON.parse(item.content);
        return { ...acc, ...content };
      } catch (e) {
        console.error("Error parsing assistant data:", e);
        return acc;
      }
    }, {});
}

function setEditorValues(assistantData) {
  Object.keys(editorService.editors).forEach((lang) => {
    let content = assistantData[lang] || "";
    editorService.setEditorValue(lang, content);
  });
}

// 코드 제출 설정
function setupCodeSubmission() {
  Object.values(editorService.editors).forEach((editor) => {
    editor.setOption("extraKeys", {
      "Ctrl-Enter": collectAndSendCode,
    });
  });
}

async function collectAndSendCode() {
  ChatUI.showLoadingOverlay();
  let codeData = editorService.collectCodeData();
  codeData = removeIdFromData(codeData);

  console.log("Sending code data to API:", codeData);

  try {
    const apiResponse = await postToApi([
      ...removeIdFromDataArray(conversationService.data),
      createUserData(codeData),
    ]);
    conversationService.addData(createUserData(codeData));
    console.log("API response:", apiResponse);
    processApiResponse(apiResponse);
  } catch (error) {
    console.error("Error to API:", error);
  } finally {
    ChatUI.hideLoadingOverlay();
  }
}

function processApiResponse(apiResponse) {
  const resultContent = ensureProperEncodingAndEscaping(
    apiResponse.choices[0].message.content
  );
  const data = JSON.parse(resultContent);

  console.log(apiResponse.choices[0].message);

  conversationService.addData(apiResponse.choices[0].message);
  displayApiResponse(data, apiResponse.choices[0].message);
}

function displayApiResponse(data, message) {
  ChatUI.addQuestionToList(data, () => removeMessage(message));
  ChatUI.addAnswerToList(message, () => removeMessage(message));
  setEditorValues(data);
}

// 이벤트 리스너 등록
window.addEventListener("load", handleWindowLoad);
document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);
