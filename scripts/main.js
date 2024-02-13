import { prompt } from "../constants/prompt.js";
import { postToApi } from "./apiService.js";
import { hideLoadingOverlay, showLoadingOverlay } from "./uiService.js";

let conversationData =
  JSON.parse(localStorage.getItem("conversationData")) || prompt;

// 코드 데이터를 JSON 문자열로 변환하고 conversationData에 추가하는 함수
function addCodeDataToConversation(codeData) {
  // 코드 데이터를 문자열로 변환
  const codeDataString = JSON.stringify(codeData);

  // conversationData에 추가
  conversationData.push({
    role: "user",
    content: codeDataString,
  });

  // conversationData를 localStorage에 저장
  localStorage.setItem("conversationData", JSON.stringify(conversationData));
}

document.addEventListener("DOMContentLoaded", function () {
  // 에디터 인스턴스 초기화
  const editors = {
    html: CodeMirror.fromTextArea(document.getElementById("html-editor"), {
      lineNumbers: true,
      mode: "text/html",
      theme: "darcula",
    }),
    css: CodeMirror.fromTextArea(document.getElementById("css-editor"), {
      lineNumbers: true,
      mode: "css",
      theme: "darcula",
    }),
    js: CodeMirror.fromTextArea(document.getElementById("js-editor"), {
      lineNumbers: true,
      mode: "javascript",
      theme: "darcula",
    }),
  };

  let conversationData =
    JSON.parse(localStorage.getItem("conversationData")) || [];

  const assistantData = conversationData
    .filter((item) => item.role === "assistant")
    .reduce((acc, item) => {
      try {
        const content = JSON.parse(item.content);
        return {
          ...acc,
          ...content,
        };
      } catch (e) {
        return acc;
      }
    }, {});

  console.log(assistantData, "s");

  Object.keys(editors).forEach((lang) => {
    let content = assistantData[lang] || "";
    editors[lang].setValue(content);
  });

  // 에디터 내용 변경 시 로컬 스토리지에 저장
  Object.entries(editors).forEach(([lang, editor]) => {
    editor.on("change", () => {
      const content = editor.getValue();
      if (content.trim() === "" && ["html", "css", "js"].includes(lang)) {
        alert(`${lang.toUpperCase()} 에디터가 비어 있습니다.`);
        return;
      }
      localStorage.setItem(lang, content);
    });
  });

  // 탭 버튼에 대한 클릭 이벤트 리스너를 추가합니다.
  document.querySelectorAll("#editor-tabs button").forEach((button) => {
    button.addEventListener("click", function () {
      const lang = this.getAttribute("data-lang"); // HTML에서 data-lang 속성을 사용
      selectTab(lang, editors);
    });
  });

  // selectTab 함수 정의
  function selectTab(lang, editors) {
    Object.keys(editors).forEach((key) => {
      const editorElement = editors[key].getWrapperElement();
      editorElement.style.display = key === lang ? "block" : "none";
    });

    // 선택된 에디터 새로고침
    editors[lang].refresh();
  }

  // 모든 에디터의 내용을 수집하고 API 요청을 보내는 함수
  const collectAndSendCode = async () => {
    showLoadingOverlay(); // 로딩 오버레이 표시
    let codeData = {
      html: editors.html.getValue(),
      css: editors.css.getValue(),
      js: editors.js.getValue(),
    };

    console.log("Sending code data to API:", codeData);

    try {
      const apiResponse = await postToApi(addCodeDataToConversation(codeData)); // API 요청 보내기
      console.log("API response:", apiResponse);
      // API 응답 처리 (예시)
      // API 응답에 따라 필요한 UI 업데이트나 알림을 여기에 구현합니다.
    } catch (error) {
      console.error("Error sending code data to API:", error);
    } finally {
      hideLoadingOverlay(); // 로딩 오버레이 숨기기
    }
  };

  // 각 에디터에 컨트롤 + 엔터 단축키 이벤트 리스너 추가
  Object.values(editors).forEach((editor) => {
    editor.setOption("extraKeys", {
      "Ctrl-Enter": function () {
        collectAndSendCode(); // 컨트롤 + 엔터를 누르면 실행
      },
    });
  });

  // 초기 에디터 설정: HTML 에디터만 보이게 하기
  selectTab("html", editors);
});
