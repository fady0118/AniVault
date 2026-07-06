import { CornerDownLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";

export default function ErrorComponent({ error }) {
  const navigate = useNavigate();
  function handleReturn() {
    if (window.history.length > 1 && document.referrer !== "") {
      history.back();
    } else {
      navigate("/");
    }
  }
  return (
    <div className="fixed top-1/2 left-1/2 -translate-1/2 flex flex-col items-center gap-4">
      <p className="alert alert-error alert-outline">Error! {error}</p>
      <div
        onClick={handleReturn}
        className="flex flex-row gap-4 items-center py-2 px-4 rounded-md border magazine-border-colors hover:cursor-pointer hover:bg-amethyst-smoke-400/75 dark:hover:bg-dark-amethyst-smoke-300/75 duration-200"
      >
        <p>Return</p> <CornerDownLeft size={15} />
      </div>
    </div>
  );
}
