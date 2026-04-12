import * as vscode from "vscode";
import { exec } from "child_process";
import type { ExecException } from "child_process";

type Direction = "next" | "previous";

let currentUrl = "https://www.instagram.com/reels/";

export function activate(context: vscode.ExtensionContext) {
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

export function deactivate() {}

async function openInExternalSidecar(url: string): Promise<void> {
  const config = vscode.workspace.getConfiguration("instagramSidecar");
  const width = config.get<number>("sidecarWidth", 430);
  const height = config.get<number>("sidecarHeight", 900);

  const platform = process.platform;
  let command = "";

  if (platform === "win32") {
    command = `powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process msedge --new-window --app='${url}' -ArgumentList '--window-size=${width},${height}'"`;
  } else if (platform === "darwin") {
    command = `open -na "Microsoft Edge" --args --new-window --app=${url} --window-size=${width},${height}`;
  } else {
    command = `microsoft-edge --new-window --app='${url}' --window-size=${width},${height}`;
  }

  await execCommand(command);

  vscode.window.showInformationMessage("Instagram sidecar opened in an external browser window.");
}

async function sendSidecarInstruction(direction: Direction): Promise<void> {
  const message =
    direction === "next"
      ? "Use the browser window and press Page Down / Arrow Down for the next reel."
      : "Use the browser window and press Page Up / Arrow Up for the previous reel.";

  vscode.window.showInformationMessage(message);
}

function execCommand(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(command, (error: ExecException | null) => {
      if (error) {
        reject(
          new Error(
            "Could not launch the sidecar browser. Install Microsoft Edge or update the launch command in src/extension.ts."
          )
        );
        return;
      }

      resolve();
    });
  });
}
