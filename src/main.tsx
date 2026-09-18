import { registerSW } from "virtual:pwa-register";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import "./styles/global.css";

const rootElement = document.getElementById("root");

if (!(rootElement instanceof HTMLElement)) {
  throw new Error("Elemento raiz da aplicação não encontrado.");
}

registerSW({
  immediate: false,
  onNeedRefresh() {
    window.dispatchEvent(new CustomEvent("recap:update-available"));
  },
  onOfflineReady() {
    window.dispatchEvent(new CustomEvent("recap:offline-ready"));
  },
});

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
