import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Shortcut({ children }) {
  const navigate = useNavigate();

  const handleKey = useCallback((event) => {
    console.log(event.altKey);
    if (event.altKey === true) {
      if (event.key === "h") {
        navigate("/home");
      }
      if (event.key === "o") {
        navigate("/");
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [handleKey]);

  return (
    <React.Fragment>{children}
    </React.Fragment>
  );
}