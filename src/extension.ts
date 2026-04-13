import * as vscode from "vscode";

let panel: vscode.WebviewPanel | undefined;
let currentUrl = "https://www.instagram.com/reels/";

export function activate(context: vscode.ExtensionContext) {
  const openLogin = vscode.commands.registerCommand("instagramSidecar.openLogin", async () => {
    currentUrl = "https://www.instagram.com/accounts/login/";
    openInstagramPanel(context, currentUrl);
  });

  const openReels = vscode.commands.registerCommand("instagramSidecar.openReels", async () => {
    currentUrl = "https://www.instagram.com/reels/";
    openInstagramPanel(context, currentUrl);
  });

  const scrollNext = vscode.commands.registerCommand("instagramSidecar.scrollNext", async () => {
    panel?.webview.postMessage({ type: "scroll", direction: "next" });
  });

  const scrollPrevious = vscode.commands.registerCommand("instagramSidecar.scrollPrevious", async () => {
    panel?.webview.postMessage({ type: "scroll", direction: "previous" });
  });

  const refresh = vscode.commands.registerCommand("instagramSidecar.refresh", async () => {
    if (panel) {
      panel.webview.html = getWebviewHtml(currentUrl);
      return;
    }

    openInstagramPanel(context, currentUrl);
  });

  context.subscriptions.push(openLogin, openReels, scrollNext, scrollPrevious, refresh);
}

export function deactivate() {}

function openInstagramPanel(context: vscode.ExtensionContext, url: string) {
  if (!panel) {
    panel = vscode.window.createWebviewPanel(
      "instagramSidecar",
      "Instagram Reels Sidecar",
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );

    panel.onDidDispose(
      () => {
        panel = undefined;
      },
      null,
      context.subscriptions
    );

    panel.webview.onDidReceiveMessage(
      (message) => {
        if (message.type === "loginBlocked") {
          vscode.window.showWarningMessage(
            "Instagram may block login inside embedded views. If that happens, use the external browser fallback."
          );
        }
      },
      undefined,
      context.subscriptions
    );
  }

  panel.title = url.includes("/accounts/login") ? "Instagram Login" : "Instagram Reels";
  panel.webview.html = getWebviewHtml(url);
  panel.reveal(vscode.ViewColumn.Beside);
}

function getWebviewHtml(url: string): string {
  const safeUrl = escapeHtml(url);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta
    http-equiv="Content-Security-Policy"
    content="default-src 'none'; frame-src https://www.instagram.com https://*.instagram.com; style-src 'unsafe-inline'; script-src 'unsafe-inline';"
  />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Instagram Reels Sidecar</title>
  <style>
    :root {
      color-scheme: dark;
    }

    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
      background: #0f172a;
      color: #e2e8f0;
      font-family: Arial, sans-serif;
    }

    .app {
      display: grid;
      grid-template-rows: auto 1fr;
      height: 100%;
    }

    .toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 12px;
      border-bottom: 1px solid rgba(148, 163, 184, 0.2);
      background: #111827;
      font-size: 12px;
    }

    .toolbarGroup {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
    }

    .pill {
      background: #1f2937;
      border: 1px solid rgba(148, 163, 184, 0.2);
      color: #cbd5e1;
      border-radius: 999px;
      padding: 6px 10px;
    }

    .frameWrap {
      position: relative;
      height: 100%;
    }

    iframe {
      width: 100%;
      height: 100%;
      border: 0;
      background: #000;
    }

    .overlay {
      position: absolute;
      right: 12px;
      bottom: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      pointer-events: none;
    }

    .hint {
      background: rgba(15, 23, 42, 0.88);
      border: 1px solid rgba(148, 163, 184, 0.25);
      border-radius: 10px;
      padding: 8px 10px;
      font-size: 12px;
      color: #e2e8f0;
      max-width: 260px;
    }
  </style>
</head>
<body>
  <div class="app">
    <div class="toolbar">
      <div class="toolbarGroup">
        <span class="pill">Instagram in VS Code</span>
        <span class="pill">↑ previous reel</span>
        <span class="pill">↓ next reel</span>
      </div>
      <div class="toolbarGroup">
        <span class="pill">Embedded login may be restricted by Instagram</span>
      </div>
    </div>

    <div class="frameWrap">
      <iframe
        id="instagramFrame"
        src="${safeUrl}"
        allow="clipboard-read; clipboard-write"
        referrerpolicy="no-referrer"
      ></iframe>

      <div class="overlay">
        <div class="hint">Use the Up and Down arrow keys while this panel is focused to move between reels.</div>
      </div>
    </div>
  </div>

  <script>
    const vscodeApi = acquireVsCodeApi();
    const frame = document.getElementById("instagramFrame");

    window.addEventListener("message", (event) => {
      const message = event.data;

      if (!frame) {
        return;
      }

      if (message.type === "scroll") {
        const delta = message.direction === "next" ? 700 : -700;
        try {
          if (frame.contentWindow) {
            frame.contentWindow.scrollBy({ top: delta, behavior: "smooth" });
          }
        } catch (error) {
          console.warn("Unable to control iframe scrolling directly.", error);
        }
      }
    });

    window.addEventListener("keydown", (event) => {
      if (!frame) {
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        try {
          if (frame.contentWindow) {
            frame.contentWindow.scrollBy({ top: 700, behavior: "smooth" });
          }
        } catch (error) {
          console.warn("ArrowDown scroll failed.", error);
        }
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        try {
          if (frame.contentWindow) {
            frame.contentWindow.scrollBy({ top: -700, behavior: "smooth" });
          }
        } catch (error) {
          console.warn("ArrowUp scroll failed.", error);
        }
      }
    });

    if (frame) {
      frame.addEventListener("load", () => {
        if (frame.src.includes("/accounts/login")) {
          vscodeApi.postMessage({ type: "loginBlocked" });
        }
      });
    }
  </script>
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&")
    .replaceAll("<", "<")
    .replaceAll(">", ">")
    .replaceAll('"', """);
}
