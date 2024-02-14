export default class LocalStorageService {
  // 로컬 스토리지에서 데이터를 가져오는 메서드
  static getData(key, defaultValue = []) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  }

  // 로컬 스토리지에 데이터를 저장하는 메서드
  static setData(key, newData) {
    const existingData = this.getData(key);
    const mergedData = [
      ...existingData,
      ...newData.filter((item) => !existingData.includes(item)),
    ];
    localStorage.setItem(key, JSON.stringify(mergedData));
  }

  // 로컬 스토리지에서 데이터를 삭제하는 메서드
  static removeData(key) {
    localStorage.removeItem(key);
  }
}
