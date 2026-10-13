"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

export default function InstallPWA() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [isInstalled, setIsInstalled] = useState(false);

  const [isIOS, setIsIOS] = useState(false);

  const [showIOSInstructions, setShowIOSInstructions] =
    useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & {
        standalone?: boolean;
      }).standalone === true;

    if (standalone) {
      setIsInstalled(true);
    }

    const userAgent = window.navigator.userAgent;

    const ios =
      /iPad|iPhone|iPod/.test(userAgent) ||
      (userAgent.includes("Macintosh") &&
        "ontouchend" in document);

    setIsIOS(ios);

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();

      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      setShowIOSInstructions(false);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    window.addEventListener(
      "appinstalled",
      handleAppInstalled
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );

      window.removeEventListener(
        "appinstalled",
        handleAppInstalled
      );
    };
  }, []);

  if (isInstalled) {
    return null;
  }

  /*
   * iPhone / iPad
   *
   * Safari does not provide the same automatic
   * beforeinstallprompt flow used by Chrome/Edge.
   */
  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSInstructions(true)}
          className="rounded-md bg-[#b18a5a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          Install FINETEX App
        </button>

        {showIOSInstructions && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-5"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-title"
          >
            <div className="w-full max-w-md rounded-2xl bg-white p-6 text-[#171717] shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="ios-install-title"
                    className="text-xl font-semibold"
                  >
                    Install FINETEX App
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#6b6b6b]">
                    On your iPhone or iPad, follow these steps:
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowIOSInstructions(false)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f7f5f0] text-lg"
                  aria-label="Close installation instructions"
                >
                  ×
                </button>
              </div>

              <ol className="mt-5 space-y-4 text-sm leading-6 text-[#333333]">
                <li>
                  <strong>1.</strong> Tap the{" "}
                  <strong>Share</strong> button in Safari.
                </li>

                <li>
                  <strong>2.</strong> Scroll down and select{" "}
                  <strong>Add to Home Screen</strong>.
                </li>

                <li>
                  <strong>3.</strong> Tap <strong>Add</strong> to
                  install FINETEX INTERIORS.
                </li>
              </ol>

              <button
                type="button"
                onClick={() => setShowIOSInstructions(false)}
                className="mt-6 w-full rounded-full bg-[#171717] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b18a5a]"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  /*
   * Chrome / Edge / other browsers that support
   * beforeinstallprompt.
   */
  if (!installPrompt) {
    return null;
  }

  const handleInstall = async () => {
    await installPrompt.prompt();

    const { outcome } = await installPrompt.userChoice;

    if (outcome === "accepted") {
      setInstallPrompt(null);
    }
  };

  return (
    <button
      type="button"
      onClick={handleInstall}
      className="rounded-md bg-[#b18a5a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
    >
      Install FINETEX App
    </button>
  );
}