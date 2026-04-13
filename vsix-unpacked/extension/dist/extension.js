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
const child_process_1 = require("child_process");
let currentUrl = "https://www.instagram.com/reels/";
function activate(context) {
    const openLogin = vscode.commands.registerCommand("instagramSidecar.openLogin", async () => {
        currentUrl = "https://www.instagram.com/accounts/login/";
        await openInExternalSidecar(currentUrl);
    });
    const openReels = vscode.commands.registerCommand("instagramSidecar.openReels", async () => {
        currentUrl = "https://www.instagram.com/reels/";
        await openInExternalSidecar(currentUrl);
    });
    const scrollNext = vscode.commands.registerCommand("instagramSidecar.scrollNext", async () => {
        await sendSidecarInstruction("next");
    });
    const scrollPrevious = vscode.commands.registerCommand("instagramSidecar.scrollPrevious", async () => {
        await sendSidecarInstruction("previous");
    });
    const refresh = vscode.commands.registerCommand("instagramSidecar.refresh", async () => {
        await openInExternalSidecar(currentUrl);
    });
    context.subscriptions.push(openLogin, openReels, scrollNext, scrollPrevious, refresh);
}
function deactivate() { }
async function openInExternalSidecar(url) {
    const config = vscode.workspace.getConfiguration("instagramSidecar");
    const width = config.get("sidecarWidth", 430);
    const height = config.get("sidecarHeight", 900);
    const platform = process.platform;
    let command = "";
    if (platform === "win32") {
        command = `powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process msedge --new-window --app='${url}' -ArgumentList '--window-size=${width},${height}'"`;
    }
    else if (platform === "darwin") {
        command = `open -na "Microsoft Edge" --args --new-window --app=${url} --window-size=${width},${height}`;
    }
    else {
        command = `microsoft-edge --new-window --app='${url}' --window-size=${width},${height}`;
    }
    await execCommand(command);
    vscode.window.showInformationMessage("Instagram sidecar opened in an external browser window.");
}
async function sendSidecarInstruction(direction) {
    const message = direction === "next"
        ? "Use the browser window and press Page Down / Arrow Down for the next reel."
        : "Use the browser window and press Page Up / Arrow Up for the previous reel.";
    vscode.window.showInformationMessage(message);
}
function execCommand(command) {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(command, (error) => {
            if (error) {
                reject(new Error("Could not launch the sidecar browser. Install Microsoft Edge or update the launch command in src/extension.ts."));
                return;
            }
            resolve();
        });
    });
}
//# sourceMappingURL=extension.js.map