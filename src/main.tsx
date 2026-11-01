import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@fontsource/oswald/vietnamese-400.css";
import "@fontsource/oswald/vietnamese-600.css";
import "@fontsource/oswald/latin-400.css";
import "@fontsource/oswald/latin-600.css";
import "@fontsource/public-sans/vietnamese-400.css";
import "@fontsource/public-sans/vietnamese-600.css";
import "@fontsource/public-sans/latin-400.css";
import "@fontsource/public-sans/latin-600.css";
import App from "./App";
import "./styles.css";
const app = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
const root = document.getElementById('root')!;
if (root.hasChildNodes()) ReactDOM.hydrateRoot(root, app);
else ReactDOM.createRoot(root).render(app);
