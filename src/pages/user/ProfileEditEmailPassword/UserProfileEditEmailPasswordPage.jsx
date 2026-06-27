import { useState } from "react";
import EmailEditForm from "./EmailEditForm";
import PasswordEditForm from "./PasswordEditForm";

export default function UserProfileEditEmailPasswordPage() {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
      <EmailEditForm />
      <PasswordEditForm />
    </div>
  );
}
