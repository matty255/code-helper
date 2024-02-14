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
    // id에 "system-prompt"가 포함되어 있다면, 경고 메시지를 표시하고 함수를 종료
    if (id.includes("system-prompt")) {
      console.warn("시스템 프롬프트는 삭제할 수 없습니다.");
      return;
    }

    // 특별한 id에 대한 삭제 시도 확인
    if (this.specialIds.has(id)) {
      console.warn(`Cannot remove special data with id: ${id}`);
      // 삭제할 수 없음을 알리는 메시지나, 예외 처리 등을 이곳에 추가
      return;
    }

    if (this.data[id]) {
      delete this.data[id];
      try {
        localStorage.setItem(this.dataKey, JSON.stringify(this.data));
      } catch (error) {
        console.error("Error removing data:", error);
      }
    }
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
