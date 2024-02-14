// utils.js
export function removeIdFromData(data) {
  const { id, ...dataWithoutId } = data;
  return dataWithoutId;
}

export function removeIdFromDataArray(dataArray) {
  return dataArray.map((data) => {
    const { id, ...dataWithoutId } = data;
    return dataWithoutId;
  });
}

export function createUserData(obj) {
  const jsonString = JSON.stringify(obj);
  return { role: "user", content: jsonString };
}

export function ensureProperEncodingAndEscaping(content) {
  try {
    JSON.parse(content);
    return content;
  } catch (e) {
    alert("The content is not a valid JSON string.");
    return content;
  }
}

export function parseQuestionContent(content) {
  try {
    // content가 JSON 형식인지 확인
    const parsedContent = JSON.parse(content);

    // content가 JSON 형식이면, html 또는 description을 반환
    if (parsedContent.html) {
      return parsedContent.html;
    } else if (parsedContent.description) {
      return parsedContent.description;
    }
  } catch (error) {
    // content가 JSON 형식이 아니면, content를 그대로 반환
    return content;
  }
}
