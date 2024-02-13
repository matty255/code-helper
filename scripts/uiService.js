export const uiElements = {
  form: document.querySelector(".chat-form"),
  input: document.querySelector(".chat-input"),
  chatList: document.querySelector(".chat-list"),
  loadingOverlay: document.querySelector(".loading-overlay"), // 로딩 오버레이 참조 추가
};

export const showLoadingOverlay = () => {
  uiElements.loadingOverlay.style.display = "block"; // 로딩 오버레이 표시
};

export const hideLoadingOverlay = () => {
  uiElements.loadingOverlay.style.display = "none"; // 로딩 오버레이 숨김
};

export const addQuestionToList = (question) => {
  const li = document.createElement("li");
  li.classList.add("chat-item", "chat-question");
  li.innerText = question; // 질문 텍스트를 직접 li 요소에 추가

  uiElements.chatList.appendChild(li);
};

export const addAnswerToList = (answer) => {
  if (!answer || !answer.content) {
    console.error("Invalid or undefined answer content.");
    return; // answer 또는 answer.content가 유효하지 않으면 함수를 종료
  }

  // 인자로 받은 답변을 목록에 추가
  const li = document.createElement("li");
  try {
    const answerContent = JSON.parse(answer.content);
    li.classList.add("chat-item", "chat-answer");
    li.innerText =
      answerContent.description ||
      answerContent.html ||
      "No valid content found."; // 답변 텍스트를 직접 li 요소에 추가
  } catch (error) {
    console.error("Error parsing answer content:", error);
    li.innerText = "Error processing answer."; // 파싱 오류가 발생한 경우, 오류 메시지를 표시
  }
  uiElements.chatList.appendChild(li);

  // 항상 채팅 목록을 최신 상태로 스크롤
  uiElements.chatList.scrollTop = uiElements.chatList.scrollHeight;
};

export const clearInput = () => {
  uiElements.input.value = "";
};
