import { useState } from "react";

export default function useTextAreaToolBox(initialText = null) {
  const [textAreaData, setTextAreaData] = useState(initialText || "");

  const insertTextStyle = (before, after = "") => {
    const textarea = document.getElementById("bodyInput");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textAreaData.substring(start, end);
    const newText = textAreaData.substring(0, start) + before + selectedText + after + textAreaData.substring(end);
    setTextAreaData(newText);
  };

  return { textAreaData, setTextAreaData, insertTextStyle };
}
