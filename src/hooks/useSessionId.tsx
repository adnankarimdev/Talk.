import { useState, useEffect } from "react";

const SESSION_STORAGE_KEY = "authToken";

const useSessionId = () => {
  const [sessionId, setSessionIdState] = useState<string | null>(null);

  // Load session ID from sessionStorage on mount
  useEffect(() => {
    const storedSessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
    setSessionIdState(storedSessionId);
  }, []);

  // Update sessionStorage and state when setting the session ID
  const setSessionId = (id: string) => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, id);
    setSessionIdState(id);
  };

  // Clear session ID from both sessionStorage and state
  const clearSessionId = () => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    setSessionIdState(null);
  };

  return {
    sessionId,
    setSessionId,
    clearSessionId,
  };
};

export default useSessionId;