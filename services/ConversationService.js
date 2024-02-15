import LocalStorageService from "./LocalStorageService.js";

export default class ConversationService extends LocalStorageService {
  constructor(initialDataKey, initialData = {}) {
    super(initialData, initialDataKey);
  }

  addData(message) {
    const newDataKey = `message_${Date.now()}`;

    // newDataKey를 id로 사용하여 새로운 메시지 추가
    message.id = newDataKey;
    this.data.push(message);

    console.log("Added data:", this.data);

    // this.data를 문자열로 변환하여 localStorage에 저장
    localStorage.setItem("conversationData", JSON.stringify(this.data));
  }
}
