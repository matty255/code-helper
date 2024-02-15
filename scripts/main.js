// main.js

import { prompt } from "../constants/prompt.js";
import UiGenerator from "../services/ChatUIService.js";
import ConversationService from "../services/ConversationService.js";
import SetEditorValueService from "../services/SetEditorValueService.js";
import {
  createUserData,
  ensureProperEncodingAndEscaping,
  removeIdFromData,
  removeIdFromDataArray,
} from "../utils/utils.js";
import { postToApi } from "./apiService.js";

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
      // console.log("Question:", data.content);
      ChatUI.addQuestionToList(data, () => removeMessage(data));
    } else if (data.role === "assistant") {
      // console.log("Answer:", data.content);
      ChatUI.addAnswerToList(data, () => removeMessage(data));
    }
  });
}

function removeMessage(data) {
  conversationService.removeData(data.id);
  ChatUI.removeMessageFromList(data.id);
}

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

  // console.log(apiResponse.choices[0].message);

  conversationService.addData(apiResponse.choices[0].message);
  displayApiResponse(data, apiResponse.choices[0].message);
}

function displayApiResponse(data, message) {
  ChatUI.addQuestionToList(data, () => removeMessage(message));
  ChatUI.addAnswerToList(message, () => removeMessage(message));
  editorService.extractAndSetCode(data); // Use the class method for processing and displaying API response
}

// Event listeners
window.addEventListener("load", handleWindowLoad);
document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);
