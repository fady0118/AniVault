import { useState } from "react";
import EmailEditForm from "./EmailEditForm";
import PasswordEditForm from "./PasswordEditForm";

export default function UserProfileEditEmailPasswordPage() {
  const [currentTab, setCurrentTab] = useState(1);
  return (
    <>
      <div class="tabs tabs-border">
        <input
          type="radio"
          name="editTabs"
          class={`tab font-semibold text-text-light dark:text-text-dark not-checked:text-dark-amethyst-smoke-700/80 dark:not-checked:text-amethyst-smoke-500/80`}
          aria-label="Change Email"
          checked={currentTab === 1}
          onChange={() => {
            setCurrentTab(1);
          }}
        />
        <div class="tab-content border-base-300/15 dark:border-white/15 bg-dark-amethyst-smoke-700/20 dark:bg-dark-amethyst-smoke-400/25 p-7">
           <EmailEditForm />
        </div>

        <input
          type="radio"
          name="editTabs"
          class={`tab font-semibold text-text-light dark:text-text-dark not-checked:text-dark-amethyst-smoke-700/80 dark:not-checked:text-amethyst-smoke-500/80`}
          aria-label="Change Password"
          checked={currentTab === 2}
          onChange={() => {
            setCurrentTab(2);
          }}
        />
        <div class="tab-content border-base-300/15 dark:border-white/15 bg-dark-amethyst-smoke-700/20 dark:bg-dark-amethyst-smoke-400/25 p-7">
          <PasswordEditForm />
        </div>
      </div>
    </>
  );
}
