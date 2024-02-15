import { isJSON, parseQuestionContent } from "../utils/utils.js";

export default class UiGenerator {
  constructor() {
    this.form = document.querySelector(".chat-form");
    this.input = document.querySelector(".chat-input");
    this.chatList = document.querySelector(".chat-list");
    this.loadingOverlay = document.querySelector(".loading-overlay");
    this.editorService = null; // EditorService 인스턴스를 저장할 필드 추가
    this.chatContainer = document.querySelector(".chat-container");
  }

  scrollChatToBottom() {
    this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
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

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "삭제";
    deleteButton.style.fontSize = "12px";
    deleteButton.style.float = "right"; // Add this line
    deleteButton.style.backgroundColor = "#333"; // Add this line
    deleteButton.style.padding = "2px"; // Add this line

    deleteButton.addEventListener("click", () => {
      removeCallback(question.id);
    });
    li.appendChild(deleteButton);

    const questionTextSpan = document.createElement("span");
    questionTextSpan.innerText = parseQuestionContent(question.content);
    li.appendChild(questionTextSpan);

    this.chatList.appendChild(li);
    this.scrollChatToBottom();
  }

  // answer: { id, content }
  addAnswerToList(answer, removeCallback) {
    const li = document.createElement("li");
    li.classList.add("chat-item", "chat-answer");
    li.dataset.id = answer.id;

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "삭제";
    deleteButton.style.fontSize = "12px";
    deleteButton.style.float = "left"; // Add this line
    deleteButton.style.backgroundColor = "#333"; // Add this line
    deleteButton.style.padding = "2px"; // Add this line

    deleteButton.addEventListener("click", () => {
      removeCallback(answer.id);
    });
    li.appendChild(deleteButton);

    if (isJSON(answer.content)) {
      const answerText = document.createElement("span");
      answerText.innerText = JSON.parse(answer.content).description;
      li.appendChild(answerText);

      // Add click event to show modal
      li.addEventListener("click", () => {
        const modalContent = JSON.parse(answer.content).html;
        this.showModal(modalContent);
      });
    }

    this.chatList.appendChild(li);
    this.scrollChatToBottom();
  }

  showModal(content) {
    const modal = document.querySelector(".modal");

    // Set the modal content
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close">&times;</span>
        <div class="rendered-content" id="rendered-content">${content}</div>
        <div id="code-block"></div>
      </div>
    `;

    modal.style.display = "block";

    // Create a CodeMirror instance for the code block
    const codeBlock = CodeMirror(document.getElementById("code-block"), {
      value: content,
      mode: "htmlmixed",
      theme: "darcula",
      readOnly: true,
    });

    // Refresh the editor and set the cursor to the start
    setTimeout(() => {
      codeBlock.refresh();
      codeBlock.setCursor({ line: 0, ch: 0 });
    }, 1);

    // Then find the .close element
    const span = document.querySelector(".close");

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
      modal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
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
