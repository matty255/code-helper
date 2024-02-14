import LocalStorageService from "./LocalStorageService.js";

export default class ConversationService extends LocalStorageService {
  constructor(initialDataKey, initialData = {}) {
    super(initialData, initialDataKey);
  }

  addData(message) {
    const newDataKey = `message_${Date.now()}`;
    this.data[newDataKey] = message;
    localStorage.setItem(this.dataKey, JSON.stringify(this.data));
  }
}
