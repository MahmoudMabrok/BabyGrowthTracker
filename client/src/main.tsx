import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add message for users to see browser storage is used
console.log("Baby Growth Tracker: Using localStorage for data persistence");

createRoot(document.getElementById("root")!).render(<App />);
