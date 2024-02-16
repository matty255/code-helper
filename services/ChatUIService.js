import { isJSON, parseQuestionContent } from "../utils/utils.js";

export default class UiGenerator {
  constructor() {
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
    li.classList.add("chat-item", "chat-question"); // 기존 클래스 유지
    li.dataset.id = question.id;

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "삭제";
    // Tailwind CSS 클래스 추가
    deleteButton.className =
      "text-xs float-right bg-gray-800 text-white py-1 px-2";

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

  addAnswerToList(answer, removeCallback) {
    const li = document.createElement("li");
    li.classList.add("chat-item", "chat-answer"); // 기존 클래스 유지
    li.dataset.id = answer.id;

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "삭제";
    // Tailwind CSS 클래스 추가
    deleteButton.className =
      "text-xs float-left bg-gray-800 text-white py-1 px-2 mx-2";

    deleteButton.addEventListener("click", () => {
      removeCallback(answer.id);
    });
    li.appendChild(deleteButton);

    if (isJSON(answer.content)) {
      const answerText = document.createElement("span");
      answerText.innerText = JSON.parse(answer.content).description;
      li.appendChild(answerText);

      // 클릭 이벤트 추가
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
      <section class="modal-content">
        <span class="close cursor-pointer">&times;</span>
        <article class="rendered-content" id="rendered-content">
        <h3 class="a11y">미리보기</h3>
        ${content}</article>
        <article id="code-block">
        <h3 class="a11y">코드블록</h3>
        </article>
      </section>
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

    const closeButton = document.querySelector(".close"); // 여기를 수정했습니다.

    // When the user clicks on <span> (x), close the modal
    closeButton.onclick = function () {
      // 여기도 수정했습니다.
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
      const htmlButton = document.querySelector(
        "#editor-tabs button[data-lang='html']"
      );
      if (htmlButton) {
        htmlButton.classList.add("active");
      }
      button.addEventListener("click", () => {
        if (this.editorService) {
          // Remove 'bg-gray-400' class from all buttons
          document.querySelectorAll("#editor-tabs button").forEach((btn) => {
            btn.classList.remove("active");
          });

          // Add 'bg-gray-400' class to the clicked button
          button.classList.add("active");

          this.selectTab(button.getAttribute("data-lang"));
        }
      });
    });
    // 페이지 로딩 시 기본 탭을 HTML로 설정
    this.selectTab("html"); // 이 부분이 기본 탭을 설정하는 로직입니다.

    // Add 'bg-gray-400' class to the button with 'data-lang' attribute equal to 'html'
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
