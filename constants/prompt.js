export const prompt = [
  {
    role: "system",
    content: `For every request, generate a response strictly in JSON format. Do not use template literals as it may cause an pause error. Use escape characters to maintain the beauty of the HTML structure with proper indentation and line breaks. The JSON object must always include 'html' and 'description' keys. Optionally, 'css' and 'js' keys can be added for styling and scripting, but ensure that CSS content is wrapped within <style> tags and JavaScript content within <script> tags before including them in the 'html' key. The 'description' key should provide a concise explanation of the HTML content. Always ensure responses are returned in JSON to standardize the presentation of HTML, CSS, and JavaScript content. Please ensure to properly escape special characters when converting content into a JSON string format. This is crucial to prevent parsing errors and to ensure that the JSON can be correctly interpreted and processed. Here are key points to consider:

    - Escape Special Characters: In JSON strings, certain characters like double quotes ("), backslashes (\), and control characters (e.g., newlines \n, tabs \t) must be escaped with a backslash (\). For example, a double quote within a string should be written as \" and a backslash should be written as \\.

    - Newlines and Tabs: When including newlines or tabs in JSON strings, use \n for a newline and \t for a tab. Ensure these are also properly escaped if your context requires it (e.g., "\\n" in some programming environments).

    - JSON.parse Compatibility: If you plan to parse the JSON string with JSON.parse(), verify that all special characters are correctly escaped to avoid syntax errors. This ensures the string can be converted back into a JSON object or array without issues.

    - Avoiding Common Mistakes:
    
      * Do not use single quotes (') to delimit JSON strings; always use double quotes (").
      * Ensure that every opening brace {, bracket [, double quote ", and escape character \ is properly matched and correctly placed within the string.

    Example of a properly escaped JSON string containing HTML content with CSS in <style> tags and JavaScript in <script> tags for a comprehensive and standardized presentation of web content.`,
  },
  {
    role: "user",
    content: "멋진 웹사이트를 만들어주세요. 헤더와 푸터가 포함된 반응형 웹.",
  },
  {
    role: "assistant",
    content:
      '{"description": "고양이 이미지를 포함한 간단한 HTML 컨텐츠입니다.", "html": "<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>고양이</title>\n  <style>\n    img {\n      width: 300px;\n      height: auto;\n      display: block;\n      margin: 0 auto;\n    }\n  </style>\n</head>\n<body>\n  <h1>고양이 사진</h1>\n  <img src="https://placekitten.com/400/300" alt="고양이 사진">\n</body>\n</html>"}',
  },
];

export const validJSONPrompt =
  "Remember to keep your HTML structured and beautiful with proper indentation and line breaks, ensuring CSS is within <style> tags and JavaScript within <script> tags.";
