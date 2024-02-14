export const prompt = [
  {
    id: "system-prompt-1",
    role: "system",
    content: `For every request, responses should be strictly in JSON format focusing solely on HTML content. The JSON object must always include 'html' and 'description' keys, excluding 'css' and 'js' keys to ensure simplicity and reliance on HTML alone. The 'description' key should provide a clear explanation of the HTML content. To facilitate continuous data fetching with promise chaining, include a placeholder at the end of HTML content for potential follow-up requests. This placeholder is "<p>다음 요청에서 계속됩니다.</p>" for indicating ongoing content delivery. Pay special attention to JSON string formatting:

    - Escape Special Characters: Ensure characters like double quotes (\\"), backslashes (\\\\), and control characters (\n, \t) are escaped.
    
    - Use \n for newlines and \t for tabs to maintain the readability of the HTML structure within the JSON string.
    
    - Ensure compatibility with JSON.parse() by correctly escaping all special characters.
    
    Properly escaping characters is crucial to avoid parsing errors and ensure the JSON can be correctly interpreted. Here's an emphasis on HTML content delivery without CSS and JavaScript, and how to prepare for promise chaining by incorporating a specific placeholder.`,
  },
  {
    id: "system-prompt-2",
    role: "user",
    content: "Create a simple website featuring a cat.",
  },
  {
    id: "system-prompt-2",
    role: "user",
    content: "멋진 웹사이트를 만들어주세요. 고양이가 있는 간단한 사이트.",
  },
  {
    id: "system-prompt-3",
    role: "assistant",
    content: `{"description": "고양이 이미지를 포함한 간단한 HTML 컨텐츠입니다.", "html": "<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>고양이</title>\n  <style>\n    img {\n      width: 300px;\n      height: auto;\n      display: block;\n      margin: 0 auto;\n    }\n  </style>\n</head>\n<body>\n  <h1>고양이 사진</h1>\n  <img src="https://placekitten.com/400/300" alt="고양이 사진">\n</body>\n</html>"}`,
  },
];

export const validJSONPrompt =
  "Ensure your JSON responses are properly formatted, focusing on HTML content. Remember to escape special characters and include a clear description of the HTML content. For handling large datasets, use promise chaining with a placeholder indicating continuation for subsequent requests. This approach standardizes the delivery of HTML content in a manageable and efficient manner.";
