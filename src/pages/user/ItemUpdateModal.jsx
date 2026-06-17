import { useEffect, useRef, useState } from "react";

export default function ItemUpdateModal({ data, setShowItemUpdateModal }) {
  const [currentTab, setCurrentTab] = useState(1);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowItemUpdateModal(false);
      }
    };
    document.documentElement.addEventListener("keydown", handleKeyDown);
    return () => document.documentElement.removeEventListener("keydown", handleKeyDown);
  }, []);
  return (
    <div className="z-50 fixed top-0 left-[-2.5vw] w-[102.5vw] h-screen backdrop-blur-lg">
      <div ref={modalRef} className="fixed top-1/2 left-1/2 -translate-1/2 h-fit w-fit overflow-y-auto rounded-md py-6 px-8 box-colors">
          <button onClick={() => setShowItemUpdateModal(false)} className="btn btn-ghost btn-sm btn-circle bg-transparent absolute top-1 right-1" aria-label="Close authentication modal">
            ✕
          </button>
        <div className="flex flex-row justifyu-between items-center px-1">
          <div role="tablist" class="tabs tabs-border w-full justify-start">
            <a
              onClick={() => {
                setCurrentTab(1);
              }}
              role="tab"
              className={`tab ${currentTab === 1 && "tab-active"}`}
            >
              Tab 1
            </a>
            <a
              onClick={() => {
                setCurrentTab(2);
              }}
              role="tab"
              className={`tab ${currentTab === 2 && "tab-active"}`}
            >
              Tab 2
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
