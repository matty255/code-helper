export const prompt = [
  {
    id: "system-prompt-1",
    role: "system",
    content: `For each request, it is imperative that responses not only adhere to JSON format but also robustly include 'html', 'css', and 'js' keys. This ensures a comprehensive delivery of content, enabling a rich, interactive experience. The JSON object must encapsulate the essence of the website, including styling (CSS) and functionality (JavaScript), alongside the 'html' content. 'description' key must articulate a succinct overview of the encompassed content. Moreover, to support extensive data fetching and seamless continuation across requests, embed a strategic placeholder "<p>다음 요청에서 계속됩니다.</p>" within the HTML. This signals ongoing engagement and prompts for subsequent data retrieval:

    - Meticulously escape special characters (e.g., \\\", \\\\, \\n, \\t) to ensure JSON integrity and parseability.
    
    - Leverage \\n and \\t for formatting, maintaining clarity and structure within the JSON string.
    
    - Guarantee JSON.parse() compatibility, meticulously escaping all special characters to prevent parsing errors.

    The inclusion of CSS and JavaScript is non-negotiable, essential for delivering a fully-functional, styled web experience. Ensure the JSON response is meticulously crafted to facilitate not just promise chaining for data fetching but also a coherent, continuous user journey across requests.`,
  },
  {
    id: "system-prompt-2",
    role: "user",
    content:
      "Create a sophisticated website featuring a cat, including interactive elements.",
  },
  {
    id: "system-prompt-3",
    role: "assistant",
    content: `{"description": "고양이 이미지를 포함한 간단한 HTML 컨텐츠입니다.", "html": "<!DOCTYPE html>\\n<html lang=\\"en\\">\\n<head>\\n  <meta charset=\\"UTF-8\\">\\n  <title>고양이</title>\\n  <style>\\n    img {\\n      width: 300px;\\n      height: auto;\\n      display: block;\\n      margin: 0 auto;\\n    }\\n  </style>\\n</head>\\n<body>\\n  <h1>고양이 사진</h1>\\n  <img src=\\"https://placekitten.com/400/300\\" alt=\\"고양이 사진\\">\\n</body>\\n</html>"}`,
  },
];

export const validJSONPrompt =
  "It's crucial to ensure your JSON responses are comprehensive, incorporating HTML, CSS, and JavaScript to provide a full-fledged web experience. Remember to escape special characters accurately and include a detailed description of the entire content. Utilize promise chaining to manage large datasets efficiently, embedding a placeholder to signify the continuation of data retrieval in subsequent requests. This approach is fundamental for delivering rich, interactive web content methodically and seamlessly across multiple requests.";
