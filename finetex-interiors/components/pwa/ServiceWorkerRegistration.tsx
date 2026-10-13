"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log(
              "FINETEX PWA: Service worker registered",
              registration.scope
            );
          })
          .catch((error) => {
            console.error(
              "FINETEX PWA: Service worker registration failed",
              error
            );
          });
      });
    }
  }, []);

  return null;
}
