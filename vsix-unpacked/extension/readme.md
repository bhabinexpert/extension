# Instagram Reels Sidecar for VS Code

A VS Code extension prototype that helps you keep Instagram Reels in a separate external browser window while you continue coding inside VS Code.

## What this extension does

This extension uses VS Code commands to:

- Open Instagram login in an external browser sidecar window
- Open Instagram Reels in an external browser sidecar window
- Refresh the current sidecar page
- Show quick guidance for moving to the next or previous reel

## Why this uses an external browser

Instagram is not reliably embeddable inside a VS Code webview, and login/session handling is more stable in a normal browser. This extension therefore uses a safer sidecar approach.

## Commands

Open the Command Palette and run:

- `Instagram Sidecar: Open Login`
- `Instagram Sidecar: Open Reels`
- `Instagram Sidecar: Next Reel`
- `Instagram Sidecar: Previous Reel`
- `Instagram Sidecar: Refresh Sidecar`

## Settings

This extension contributes the following settings:

- `instagramSidecar.sidecarWidth`
- `instagramSidecar.sidecarHeight`

## Development

Install dependencies:

```bash
npm install
```

Compile:

```bash
npm run compile
```

Run the extension in VS Code:

1. Open this folder in VS Code
2. Press `F5`
3. In the Extension Development Host, open the Command Palette
4. Run one of the `Instagram Sidecar` commands

## Notes

- The extension opens Instagram in your default browser via VS Code's external browser API.
- If your system has no browser association configured, update your OS default browser settings.
- `Next Reel` and `Previous Reel` currently provide user guidance instead of direct browser automation.
