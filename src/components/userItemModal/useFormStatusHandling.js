import { useState } from "react";

export default function useFormStatusHandling() {
  // form status
  const [status, setStatus] = useState("idle"); // idle, modified, loading, success, error
  const [error, setError] = useState(null); // error state
  return { status, setStatus, error, setError };
}
