import { useState } from "react";

export default function TextAreaToolBox({ metaData, textAreaData, setTextAreaData, insertTextStyle }) {
  return (
    <>
      <div className="form-control w-full flex flex-col gap-y-1">
        <label className="font-semibold text-sm capitalize" htmlFor="bodyInput">
          {metaData?.title||"bio"}
        </label>
        <div className="flex gap-1 mb-1">
          <button type="button" className="btn btn-xs btn-outline" onClick={() => insertTextStyle("**", "**")} title="Bold">
            <strong>B</strong>
          </button>
          <button type="button" className="btn btn-xs btn-outline" onClick={() => insertTextStyle("*", "*")} title="Italic">
            <em>I</em>
          </button>
          <button type="button" className="btn btn-xs btn-outline" onClick={() => insertTextStyle("__", "__")} title="Underline">
            <u>U</u>
          </button>
          <button type="button" className="btn btn-xs btn-outline" onClick={() => insertTextStyle("~~", "~~")} title="Strikethrough">
            <s>S</s>
          </button>
          <button type="button" className="btn btn-xs btn-outline" onClick={() => insertTextStyle("`", "`")} title="Code">
            &lt;/&gt;
          </button>
        </div>
        <textarea
          name="bodyInput"
          id="bodyInput"
          placeholder={metaData?.placeholder||"Tell us about yourself..."}
          className="textarea textarea-primary bg-transparent select-xs outline-0"
          rows="4"
          value={textAreaData}
          onChange={(e) => {
            setTextAreaData(e.target.value);
          }}
        />
      </div>
    </>
  );
}
