import { htmlTags } from "../constants/htmlTags.js"; // 태그 목록 가져오기
// 커스텀 힌트 함수
export function setCustomHint(editor) {
  const cursor = editor.getCursor(); // 현재 커서 위치 가져오기
  const token = editor.getTokenAt(cursor);
  // 사용자가 입력한 현재 단어를 기준으로 필터링
  const currentWord = token.string;
  const start = token.start;
  const end = cursor.ch;
  // 힌트 리스트를 생성, 여기서는 `<tag>` 형식으로 힌트를 제공
  const list = htmlTags
    .filter((tag) => tag.startsWith(currentWord))
    .map((tag) => {
      return { text: `<${tag}>`, displayText: tag }; // 힌트 삽입 시 `<tag>` 형태로 삽입
    });

  return {
    list: list,
    from: CodeMirror.Pos(cursor.line, start),
    to: CodeMirror.Pos(cursor.line, end),
  };
}
