export default class LocalStorageService {
  // 특별한 id들을 저장할 속성 추가

  constructor(initialData = {}, key, specialIds) {
    this.dataKey = key;
    // specialIds를 Set으로 변환하여 저장, 삭제 불가능한 id 관리
    this.specialIds = new Set(specialIds);
    this.loadDataFromLocalStorage(this.dataKey, initialData);
  }

  loadDataFromLocalStorage(key, defaultValue = {}) {
    try {
      const storedData = localStorage.getItem(key);
      this.data = storedData ? JSON.parse(storedData) : defaultValue;
    } catch (error) {
      console.error("Error parsing stored data:", error);
      this.data = defaultValue;
    }
    localStorage.setItem(key, JSON.stringify(this.data));
  }

  getData(key, defaultValue = {}) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error("Error retrieving data:", error);
      return defaultValue;
    }
  }

  setData(key, newData) {
    try {
      this.data = { ...this.data, ...newData };
      localStorage.setItem(key, JSON.stringify(this.data));
    } catch (error) {
      console.error("Error saving data:", error);
    }
  }

  removeData(id) {
    // 삭제 확인 메시지를 제거하고 바로 삭제를 진행합니다.
    this.data = this.data.filter((message) => message.id !== id); // UI에서 메시지 제거
    localStorage.setItem(this.dataKey, JSON.stringify(this.data));
  }

  updateData(id, newData) {
    if (this.data[id]) {
      this.data[id] = newData;
      try {
        localStorage.setItem(this.dataKey, JSON.stringify(this.data));
      } catch (error) {
        console.error("Error updating data:", error);
      }
    }
  }
}
