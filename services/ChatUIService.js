import { parseQuestionContent } from "../utils/utils.js";

export default class UiGenerator {
  constructor() {
    this.form = document.querySelector(".chat-form");
    this.input = document.querySelector(".chat-input");
    this.chatList = document.querySelector(".chat-list");
    this.loadingOverlay = document.querySelector(".loading-overlay");
    this.editorService = null; // EditorService 인스턴스를 저장할 필드 추가
  }

  // EditorService 인스턴스를 설정하는 메서드
  setEditorService(editorService) {
    this.editorService = editorService;
  }

  showLoadingOverlay() {
    this.loadingOverlay.style.display = "block";
  }

  hideLoadingOverlay() {
    this.loadingOverlay.style.display = "none";
  }

  addQuestionToList(question, removeCallback) {
    const li = document.createElement("li");
    li.classList.add("chat-item", "chat-question");
    li.dataset.id = question.id;
    console.log(question.content);

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.style.width = "100px"; // 스타일 추가
    deleteButton.addEventListener("click", () => {
      removeCallback(question.id);
    });
    li.appendChild(deleteButton);

    const questionTextSpan = document.createElement("span");
    (questionTextSpan.innerText = parseQuestionContent(question.content)),
      li.appendChild(questionTextSpan);

    this.chatList.appendChild(li);
  }

  // answer: { id, content }
  addAnswerToList(answer, removeCallback) {
    const li = document.createElement("li");
    li.classList.add("chat-item", "chat-answer");
    li.dataset.id = answer.id;

    console.log(answer);

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.style.width = "100px"; // 스타일 추가
    deleteButton.addEventListener("click", () => {
      removeCallback(answer.id);
    });
    li.appendChild(deleteButton);

    const answerText = document.createElement("span");
    answerText.innerText = answer.content;
    li.appendChild(answerText);

    this.chatList.appendChild(li);
  }

  removeMessageFromList(id) {
    // id에 "system-prompt"가 포함되어 있다면, 경고 메시지를 표시하고 함수를 종료
    if (id.includes("system-prompt")) {
      alert("시스템 프롬프트는 삭제할 수 없습니다.");
      return;
    }

    const messageElement = this.chatList.querySelector(`[data-id="${id}"]`);
    if (messageElement) {
      this.chatList.removeChild(messageElement);
    }
  }

  clearInput() {
    this.input.value = "";
  }

  setupTabSwitching() {
    document.querySelectorAll("#editor-tabs button").forEach((button) => {
      button.addEventListener("click", () => {
        if (this.editorService) {
          this.selectTab(button.getAttribute("data-lang"));
        }
      });
    });
    // 페이지 로딩 시 기본 탭을 HTML로 설정
    this.selectTab("html"); // 이 부분이 기본 탭을 설정하는 로직입니다.
  }

  selectTab(lang) {
    if (this.editorService && this.editorService.editors) {
      const editors = this.editorService.editors; // 이제 여기서 에러가 나지 않아야 합니다.
      Object.keys(editors).forEach((key) => {
        const editorElement = editors[key].getWrapperElement();
        editorElement.style.display = key === lang ? "block" : "none";
      });

      editors[lang].refresh();
    }
  }
}
