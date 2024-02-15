import LocalStorageService from "./LocalStorageService.js";

export default class ConversationService extends LocalStorageService {
  constructor(initialDataKey, initialData = {}) {
    super(initialData, initialDataKey);
  }

  addData(message) {
    const newDataKey = `message_${Date.now()}`;

    message.id = newDataKey;
    this.data.push(message);

    localStorage.setItem("conversationData", JSON.stringify(this.data));
  }
}
