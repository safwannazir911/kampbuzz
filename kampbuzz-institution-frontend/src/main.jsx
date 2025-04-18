import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "sonner";
import AppRoutes  from "./AppRoutes.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Toaster richColors={true} position={"top-right"} closeButton={true} />
    <Router>
      <AppRoutes />
    </Router>
  </React.StrictMode>
);
