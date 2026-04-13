"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
let panel;
let isLoggedIn = false;
// Popular/trending Instagram reel shortcodes — users can also add their own
const DEFAULT_REELS = [];
function activate(context) {
    // Restore login state from global state
    isLoggedIn = context.globalState.get("instagramLoggedIn", false);
    // Restore saved reels list
    const savedReels = context.globalState.get("instagramReels", []);
    const openLogin = vscode.commands.registerCommand("instagramSidecar.openLogin", async () => {
        // Open Instagram login in the user's default browser (Chrome)
        const loginUrl = vscode.Uri.parse("https://www.instagram.com/accounts/login/");
        await vscode.env.openExternal(loginUrl);
        // Show a message asking the user to confirm once logged in
        const result = await vscode.window.showInformationMessage("Instagram login page opened in your browser. After logging in, click 'I'm Logged In' to continue.", "I'm Logged In", "Cancel");
        if (result === "I'm Logged In") {
            isLoggedIn = true;
            await context.globalState.update("instagramLoggedIn", true);
            vscode.window.showInformationMessage("Login confirmed! Use 'Instagram Sidecar: Open Reels' to start browsing reels.");
            // Auto-open the reels panel
            openReelsPanel(context, savedReels);
        }
    });
    const openReels = vscode.commands.registerCommand("instagramSidecar.openReels", async () => {
        if (!isLoggedIn) {
            const result = await vscode.window.showWarningMessage("You need to log in to Instagram first to view reels.", "Open Login", "Continue Anyway");
            if (result === "Open Login") {
                await vscode.commands.executeCommand("instagramSidecar.openLogin");
                return;
            }
            else if (result !== "Continue Anyway") {
                return;
            }
        }
        openReelsPanel(context, savedReels);
    });
    const addReel = vscode.commands.registerCommand("instagramSidecar.addReel", async () => {
        const input = await vscode.window.showInputBox({
            prompt: "Enter an Instagram Reel URL or shortcode",
            placeHolder: "https://www.instagram.com/reel/ABC123/ or just ABC123",
            validateInput: (value) => {
                if (!value.trim()) {
                    return "Please enter a reel URL or shortcode";
                }
                return null;
            },
        });
        if (!input) {
            return;
        }
        const shortcode = extractShortcode(input.trim());
        if (!shortcode) {
            vscode.window.showErrorMessage("Invalid reel URL or shortcode. Please enter a valid Instagram reel URL.");
            return;
        }
        savedReels.push(shortcode);
        await context.globalState.update("instagramReels", savedReels);
        if (panel) {
            panel.webview.postMessage({
                type: "addReel",
                shortcode,
            });
        }
        vscode.window.showInformationMessage(`Reel added! (${shortcode})`);
    });
    const scrollNext = vscode.commands.registerCommand("instagramSidecar.scrollNext", async () => {
        panel?.webview.postMessage({ type: "scroll", direction: "next" });
    });
    const scrollPrevious = vscode.commands.registerCommand("instagramSidecar.scrollPrevious", async () => {
        panel?.webview.postMessage({ type: "scroll", direction: "previous" });
    });
    const refresh = vscode.commands.registerCommand("instagramSidecar.refresh", async () => {
        if (panel) {
            panel.webview.html = getReelsWebviewHtml(savedReels);
            return;
        }
        openReelsPanel(context, savedReels);
    });
    const logout = vscode.commands.registerCommand("instagramSidecar.logout", async () => {
        isLoggedIn = false;
        await context.globalState.update("instagramLoggedIn", false);
        if (panel) {
            panel.dispose();
        }
        vscode.window.showInformationMessage("Logged out of Instagram Sidecar.");
    });
    context.subscriptions.push(openLogin, openReels, addReel, scrollNext, scrollPrevious, refresh, logout);
}
function deactivate() { }
function extractShortcode(input) {
    // If it's already a shortcode (alphanumeric + _ and -)
    if (/^[A-Za-z0-9_-]{6,}$/.test(input)) {
        return input;
    }
    // Try to extract from URL patterns:
    // https://www.instagram.com/reel/ABC123/
    // https://www.instagram.com/reels/ABC123/
    // https://www.instagram.com/p/ABC123/
    const patterns = [
        /instagram\.com\/reel\/([A-Za-z0-9_-]+)/,
        /instagram\.com\/reels\/([A-Za-z0-9_-]+)/,
        /instagram\.com\/p\/([A-Za-z0-9_-]+)/,
    ];
    for (const pattern of patterns) {
        const match = input.match(pattern);
        if (match?.[1]) {
            return match[1];
        }
    }
    return null;
}
function openReelsPanel(context, reels) {
    if (!panel) {
        panel = vscode.window.createWebviewPanel("instagramSidecar", "Instagram Reels", vscode.ViewColumn.Beside, {
            enableScripts: true,
            retainContextWhenHidden: true,
        });
        panel.onDidDispose(() => {
            panel = undefined;
        }, null, context.subscriptions);
        panel.webview.onDidReceiveMessage(async (message) => {
            if (message.type === "openInBrowser") {
                const url = vscode.Uri.parse(message.url);
                await vscode.env.openExternal(url);
            }
            else if (message.type === "addReelRequest") {
                await vscode.commands.executeCommand("instagramSidecar.addReel");
            }
            else if (message.type === "login") {
                await vscode.commands.executeCommand("instagramSidecar.openLogin");
            }
        }, undefined, context.subscriptions);
    }
    panel.webview.html = getReelsWebviewHtml(reels);
    panel.reveal(vscode.ViewColumn.Beside);
}
function getReelsWebviewHtml(reels) {
    const reelsJson = JSON.stringify(reels);
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta
    http-equiv="Content-Security-Policy"
    content="default-src 'none'; frame-src https://www.instagram.com https://*.instagram.com; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src https://www.instagram.com https://*.instagram.com;"
  />
  <title>Instagram Reels</title>
  <style>
    :root {
      color-scheme: dark;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      height: 100%;
      background: #0a0a0a;
      color: #e2e8f0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      overflow: hidden;
    }

    .app {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    /* Toolbar */
    .toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      background: #111;
      border-bottom: 1px solid #222;
      flex-shrink: 0;
      gap: 8px;
    }

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .toolbar-title {
      font-size: 13px;
      font-weight: 600;
      color: #e2e8f0;
    }

    .btn {
      background: #1f1f1f;
      border: 1px solid #333;
      color: #cbd5e1;
      border-radius: 6px;
      padding: 4px 10px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
    }

    .btn:hover {
      background: #2a2a2a;
      border-color: #444;
      color: #fff;
    }

    .btn-primary {
      background: #e1306c;
      border-color: #e1306c;
      color: #fff;
    }

    .btn-primary:hover {
      background: #c13584;
      border-color: #c13584;
    }

    /* Reel counter */
    .counter {
      font-size: 11px;
      color: #888;
      min-width: 60px;
      text-align: center;
    }

    /* Reels container */
    .reels-container {
      flex: 1;
      overflow: hidden;
      position: relative;
    }

    .reel-viewport {
      width: 100%;
      height: 100%;
      position: relative;
    }

    .reel-slide {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .reel-slide iframe {
      width: 100%;
      height: 100%;
      border: none;
      background: #000;
    }

    /* Empty state */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 32px;
      text-align: center;
      gap: 16px;
    }

    .empty-state-icon {
      font-size: 48px;
      opacity: 0.5;
    }

    .empty-state h2 {
      font-size: 18px;
      font-weight: 600;
      color: #e2e8f0;
    }

    .empty-state p {
      font-size: 13px;
      color: #888;
      max-width: 300px;
      line-height: 1.5;
    }

    .empty-state .btn {
      margin-top: 8px;
      padding: 8px 20px;
      font-size: 13px;
    }

    /* Navigation arrows */
    .nav-arrow {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      transition: all 0.2s;
    }

    .nav-arrow:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .nav-arrow.up {
      top: 8px;
    }

    .nav-arrow.down {
      bottom: 8px;
    }

    .nav-arrow:disabled {
      opacity: 0.3;
      cursor: default;
    }

    /* Hint overlay */
    .hint {
      position: absolute;
      bottom: 52px;
      right: 12px;
      background: rgba(0, 0, 0, 0.8);
      border: 1px solid #333;
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 11px;
      color: #aaa;
      pointer-events: none;
      z-index: 10;
      max-width: 200px;
    }

    /* Input area styling */
    .input-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;
      max-width: 340px;
    }

    .input-section .url-input {
      width: 100%;
      padding: 10px 14px;
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 8px;
      color: #e2e8f0;
      font-size: 13px;
      outline: none;
      transition: border-color 0.2s;
    }

    .input-section .url-input:focus {
      border-color: #e1306c;
    }

    .input-section .url-input::placeholder {
      color: #555;
    }

    .button-row {
      display: flex;
      gap: 8px;
      justify-content: center;
    }
  </style>
</head>
<body>
  <div class="app">
    <div class="toolbar">
      <div class="toolbar-left">
        <span class="toolbar-title">Instagram Reels</span>
        <span class="counter" id="counter"></span>
      </div>
      <div class="toolbar-right">
        <button class="btn" id="btnAdd" title="Add a reel URL">+ Add</button>
        <button class="btn" id="btnRefresh" title="Refresh current reel">Refresh</button>
      </div>
    </div>

    <div class="reels-container" id="reelsContainer">
      <!-- Populated by JS -->
    </div>
  </div>

  <script>
    const vscodeApi = acquireVsCodeApi();

    let reels = ${reelsJson};
    let currentIndex = 0;

    const reelsContainer = document.getElementById("reelsContainer");
    const counter = document.getElementById("counter");

    // --- Buttons ---
    document.getElementById("btnAdd").addEventListener("click", () => {
      vscodeApi.postMessage({ type: "addReelRequest" });
    });

    document.getElementById("btnRefresh").addEventListener("click", () => {
      renderCurrentReel();
    });

    // --- Render ---
    function renderCurrentReel() {
      if (reels.length === 0) {
        renderEmptyState();
        return;
      }

      // Clamp index
      if (currentIndex < 0) currentIndex = 0;
      if (currentIndex >= reels.length) currentIndex = reels.length - 1;

      const shortcode = reels[currentIndex];
      const embedUrl = "https://www.instagram.com/reel/" + shortcode + "/embed/";

      reelsContainer.innerHTML = \`
        <div class="reel-viewport">
          <button class="nav-arrow up" id="navUp" \${currentIndex === 0 ? "disabled" : ""}>&#9650;</button>
          <div class="reel-slide">
            <iframe
              src="\${embedUrl}"
              allowfullscreen
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
              loading="lazy"
            ></iframe>
          </div>
          <button class="nav-arrow down" id="navDown" \${currentIndex === reels.length - 1 ? "disabled" : ""}>&#9660;</button>
          <div class="hint">Arrow keys or mouse wheel to navigate reels</div>
        </div>
      \`;

      // Counter
      counter.textContent = (currentIndex + 1) + " / " + reels.length;

      // Nav button listeners
      const navUp = document.getElementById("navUp");
      const navDown = document.getElementById("navDown");

      if (navUp) {
        navUp.addEventListener("click", () => navigatePrevious());
      }
      if (navDown) {
        navDown.addEventListener("click", () => navigateNext());
      }
    }

    function renderEmptyState() {
      counter.textContent = "";
      reelsContainer.innerHTML = \`
        <div class="empty-state">
          <div class="empty-state-icon">&#127910;</div>
          <h2>No Reels Added Yet</h2>
          <p>Login opens Instagram in your browser for authentication, but reel playback stays inside this VS Code tab.</p>
          <div class="input-section">
            <input
              type="text"
              class="url-input"
              id="reelInput"
              placeholder="Paste reel URL or shortcode..."
            />
            <div class="button-row">
              <button class="btn btn-primary" id="emptyAddBtn">Add Reel</button>
              <button class="btn" id="emptyLoginBtn">Login</button>
            </div>
          </div>
        </div>
      \`;

      document.getElementById("emptyAddBtn").addEventListener("click", () => {
        const input = document.getElementById("reelInput");
        const value = input.value.trim();
        if (value) {
          // Try to extract shortcode client-side
          const shortcode = extractShortcodeClient(value);
          if (shortcode) {
            reels.push(shortcode);
            currentIndex = reels.length - 1;
            renderCurrentReel();
            // Also persist on extension side
            vscodeApi.postMessage({ type: "addReelRequest" });
          }
        } else {
          vscodeApi.postMessage({ type: "addReelRequest" });
        }
      });

      document.getElementById("emptyLoginBtn").addEventListener("click", () => {
        vscodeApi.postMessage({ type: "login" });
      });

      // Allow pressing Enter in the input
      document.getElementById("reelInput").addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          document.getElementById("emptyAddBtn").click();
        }
      });
    }

    function extractShortcodeClient(input) {
      if (/^[A-Za-z0-9_-]{6,}$/.test(input)) {
        return input;
      }

      const patterns = [
        /instagram\\.com\\/reel\\/([A-Za-z0-9_-]+)/,
        /instagram\\.com\\/reels\\/([A-Za-z0-9_-]+)/,
        /instagram\\.com\\/p\\/([A-Za-z0-9_-]+)/
      ];

      for (const pattern of patterns) {
        const match = input.match(pattern);
        if (match && match[1]) {
          return match[1];
        }
      }

      return null;
    }

    // --- Navigation ---
    function navigateNext() {
      if (currentIndex < reels.length - 1) {
        currentIndex++;
        renderCurrentReel();
      }
    }

    function navigatePrevious() {
      if (currentIndex > 0) {
        currentIndex--;
        renderCurrentReel();
      }
    }

    // --- Keyboard navigation ---
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "j") {
        event.preventDefault();
        navigateNext();
      } else if (event.key === "ArrowUp" || event.key === "k") {
        event.preventDefault();
        navigatePrevious();
      }
    });

    // --- Mouse wheel navigation ---
    let wheelCooldown = false;
    document.addEventListener("wheel", (event) => {
      if (wheelCooldown) return;

      if (event.deltaY > 30) {
        navigateNext();
        wheelCooldown = true;
        setTimeout(() => { wheelCooldown = false; }, 600);
      } else if (event.deltaY < -30) {
        navigatePrevious();
        wheelCooldown = true;
        setTimeout(() => { wheelCooldown = false; }, 600);
      }
    }, { passive: true });

    // --- Messages from extension ---
    window.addEventListener("message", (event) => {
      const message = event.data;

      if (message.type === "scroll") {
        if (message.direction === "next") {
          navigateNext();
        } else if (message.direction === "previous") {
          navigatePrevious();
        }
      } else if (message.type === "addReel") {
        if (message.shortcode && !reels.includes(message.shortcode)) {
          reels.push(message.shortcode);
          currentIndex = reels.length - 1;
          renderCurrentReel();
        }
      }
    });

    // --- Initial render ---
    renderCurrentReel();
  </script>
</body>
</html>`;
}
//# sourceMappingURL=extension.js.map