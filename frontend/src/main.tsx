import React from "react";
import ReactDOM from "react-dom/client";
import { AppWithAuthProvider } from "./GoogleAuthProvider";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppWithAuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppWithAuthProvider>
  </React.StrictMode>
);
