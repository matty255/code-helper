// utils.js
export function removeIdFromData(data) {
  const { id, ...dataWithoutId } = data;
  return dataWithoutId;
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
