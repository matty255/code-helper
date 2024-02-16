export const prompt = [
  {
    id: "system-prompt-1",
    role: "system",
    content: `For each request, it is imperative that responses not only adhere to JSON format but also robustly include 'html', 'css', and 'js' keys. This ensures a comprehensive delivery of content, enabling a rich, interactive experience. The JSON object must encapsulate the essence of the website, including styling (CSS) and functionality (JavaScript), alongside the 'html' content. 'description' key must articulate a succinct overview of the encompassed content. This signals ongoing engagement and prompts for subsequent data retrieval:

    - Meticulously escape special characters (e.g., \\\", \\\\, \\n, \\t) to ensure JSON integrity and parseability.
    
    - Leverage \\n and \\t for formatting, maintaining clarity and structure within the JSON string.
    
    - Guarantee JSON.parse() compatibility, meticulously escaping all special characters to prevent parsing errors.

    The inclusion of CSS and JavaScript is non-negotiable, essential for delivering a fully-functional, styled web experience. Ensure the JSON response is meticulously crafted to facilitate not just promise chaining for data fetching but also a coherent, continuous user journey across requests.`,
  },
  {
    id: "system-prompt-2",
    role: "user",
    content: "고양이 사진이 있는 간단한 웹사이트를 만들어주세요.",
  },
  {
    id: "system-prompt-3",
    role: "assistant",
    content:
      '{"description": "사용 방법 설명서.", "html": "\\n<!DOCTYPE html>\\n<html lang=\\"ko\\">\\n<head>\\n  <meta charset=\\"UTF-8\\">\\n  <title>고양이</title>\\n  <style>\\n    img {\\n      width: 300px;\\n      height: auto;\\n      display: block;\\n      margin: 0 auto;\\n    }\\n  </style>\\n</head>\\n<body>\\n  <h1>사용 방법</h1>\\n  <!-- 왼쪽의 채팅창에서는 \'전송\' 버튼 onClick과 submit: enter를 지원합니다. -->\\n  <!-- 여기 에디터에서는 ctrl + enter로 즉시 전송 기능을 제공합니다. -->\\n  <!-- 오른쪽의 미리보기에서는 실시간으로 html의 현재 구현을 볼 수 있습니다. -->\\n <!-- 출력 관련 에러가 발생한다면 개발자도구를 열고 애플리케이션에서 저장되어 있는 로컬 스토리지 값 : conversationData를 삭세하고 다시 시도해보세요. -->\\n  <img src=\\"https://placekitten.com/400/300\\" alt=\\"고양이 사진\\">\\n</body>\\n</html>\\n"}',
  },
];

export const validJSONPrompt =
  "It's crucial to ensure your JSON responses are comprehensive, incorporating HTML, CSS, and JavaScript to provide a full-fledged web experience. Remember to escape special characters accurately and include a detailed description of the entire content. Utilize promise chaining to manage large datasets efficiently, embedding a placeholder to signify the continuation of data retrieval in subsequent requests. This approach is fundamental for delivering rich, interactive web content methodically and seamlessly across multiple requests.";
