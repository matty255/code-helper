export default class UiGenerator {
  constructor() {
    this.form = document.querySelector(".chat-form");
    this.input = document.querySelector(".chat-input");
    this.chatList = document.querySelector(".chat-list");
    this.loadingOverlay = document.querySelector(".loading-overlay");
  }

  showLoadingOverlay() {
    this.loadingOverlay.style.display = "block";
  }

  hideLoadingOverlay() {
    this.loadingOverlay.style.display = "none";
  }

  addQuestionToList(question) {
    console.log("Adding question to list:", question.content);
    const li = document.createElement("li");
    li.classList.add("chat-item", "chat-question");

    try {
      let questionContent;
      if (this.isJsonString(question.content)) {
        questionContent = JSON.parse(question.content);
      } else {
        questionContent = { description: question.content };
      }
      li.innerText =
        questionContent.description ||
        questionContent.html ||
        "No valid question content found.";
    } catch (error) {
      console.error("Error parsing question content:", error);
      li.innerText = "Error processing question.";
    }

    this.chatList.appendChild(li);
  }

  isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  addAnswerToList(answer) {
    if (!answer || !answer.content) {
      console.error("Invalid or undefined answer content.");
      return;
    }

    const li = document.createElement("li");
    li.classList.add("chat-item", "chat-answer");

    try {
      let answerContent;
      if (this.isJsonString(answer.content)) {
        answerContent = JSON.parse(answer.content);
      } else {
        answerContent = { description: answer.content };
      }
      li.innerText =
        answerContent.description ||
        answerContent.html ||
        "No valid content found.";
    } catch (error) {
      console.error("Error parsing answer content:", error);
      li.innerText = "Error processing answer.";
    }

    this.chatList.appendChild(li);
    this.chatList.scrollTop = this.chatList.scrollHeight;
  }

  clearInput() {
    this.input.value = "";
  }
}

// 사용 예시
const ui = new UiGenerator();
ui.showLoadingOverlay();
// 필요한 동작 수행
ui.hideLoadingOverlay();
