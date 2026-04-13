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
    await vscode.env.openExternal(vscode.Uri.parse(url));
    vscode.window.showInformationMessage("Instagram sidecar opened in your default browser.");
}
async function sendSidecarInstruction(direction) {
    const message = direction === "next"
        ? "Use the browser window and press Page Down / Arrow Down for the next reel."
        : "Use the browser window and press Page Up / Arrow Up for the previous reel.";
    vscode.window.showInformationMessage(message);
}
//# sourceMappingURL=extension.js.map