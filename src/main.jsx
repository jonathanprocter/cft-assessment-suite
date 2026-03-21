import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CFTAssessmentSuite from "./CFTAssessmentSuite";

// Polyfill window.storage if not provided by the host platform.
// Falls back to localStorage with a compatible get/set interface.
if (!window.storage) {
  window.storage = {
    async get(key) {
      const value = localStorage.getItem(key);
      return value != null ? { value } : null;
    },
    async set(key, value) {
      localStorage.setItem(key, value);
    },
  };
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CFTAssessmentSuite />
  </StrictMode>
);
