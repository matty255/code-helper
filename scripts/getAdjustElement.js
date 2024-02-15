$(function () {
  var containerWidth = $("#main-container").width();
  var minSectionWidth = 100; // 최소 섹션 너비 설정

  $("#splitter1").draggable({
    axis: "x",
    containment: [minSectionWidth, 0, containerWidth - minSectionWidth * 2, 0], // 드래그 가능 범위 제한
    drag: function (event, ui) {
      var splitterPosition = ui.position.left;
      var nextSplitterPosition = $("#splitter2").offset().left;
      var maxWidth = nextSplitterPosition - minSectionWidth;

      if (splitterPosition > minSectionWidth && splitterPosition < maxWidth) {
        $("#chat-section").width(splitterPosition);
        $("#editor-section")
          .css("left", splitterPosition)
          .width(nextSplitterPosition - splitterPosition);
      }
    },
  });

  $("#splitter2").draggable({
    axis: "x",
    containment: [minSectionWidth * 2, 0, containerWidth - minSectionWidth, 0], // 드래그 가능 범위 제한
    drag: function (event, ui) {
      var splitterPosition = ui.position.left;
      var prevSplitterPosition = $("#splitter1").offset().left;
      var maxWidth = containerWidth - minSectionWidth;

      if (
        splitterPosition > prevSplitterPosition + minSectionWidth &&
        splitterPosition < maxWidth
      ) {
        $("#editor-section").width(splitterPosition - prevSplitterPosition);
        $("#iframe-section")
          .css("left", splitterPosition)
          .width(maxWidth - splitterPosition);
      }
    },
  });
});
