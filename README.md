# Instagram Reels Sidecar for VS Code

Browse Instagram Reels right inside VS Code while you code. Login through Chrome, add reels by URL, and navigate them with arrow keys or mouse wheel -- all without leaving your editor.

![VS Code](https://img.shields.io/badge/VS%20Code-1.85+-blue) ![License](https://img.shields.io/badge/license-MIT-green) ![Publisher](https://img.shields.io/badge/publisher-bhabinexpert-orange)

---

## Features

- **Login via Chrome** -- Opens Instagram login in your default browser. No embedded login hassles.
- **Reels in a Sidebar Panel** -- View Instagram Reels in a dedicated VS Code panel alongside your code.
- **Add Reels by URL** -- Paste any Instagram Reel URL or shortcode to add it to your queue.
- **Browse Instagram** -- One-click button opens Instagram Reels in Chrome so you can find new content.
- **Keyboard Navigation** -- Use `Arrow Up` / `Arrow Down` to move between reels.
- **Mouse Wheel Navigation** -- Scroll through reels with your mouse wheel.
- **On-Screen Controls** -- Click the up/down arrow buttons to navigate.
- **Persistent State** -- Your login status and saved reels persist across VS Code sessions.
- **Logout Support** -- Clean logout to reset your session.

---

## Getting Started

### 1. Login to Instagram

Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and run:

```
Instagram Sidecar: Login
```

This opens Instagram's login page in Chrome (your default browser). Log in there, then click **"I'm Logged In"** in the VS Code dialog.

### 2. Open the Reels Panel

Run from the Command Palette:

```
Instagram Sidecar: Open Reels
```

A panel opens beside your editor showing your saved reels.

### 3. Add Reels

Click the **"+ Add"** button in the toolbar, or run:

```
Instagram Sidecar: Add Reel
```

Paste a full URL like `https://www.instagram.com/reel/ABC123/` or just the shortcode `ABC123`.

### 4. Browse for New Reels

Click **"Browse"** in the toolbar to open `instagram.com/reels/` in Chrome. Find reels you like, copy their URLs, and add them to your queue.

---

## Navigation Controls

| Action | Control |
|---|---|
| Next Reel | `Arrow Down`, `j`, Mouse Wheel Down, `Ctrl+Alt+Down` |
| Previous Reel | `Arrow Up`, `k`, Mouse Wheel Up, `Ctrl+Alt+Up` |
| Next Reel (command) | Command Palette: `Instagram Sidecar: Next Reel` |
| Previous Reel (command) | Command Palette: `Instagram Sidecar: Previous Reel` |
| On-screen buttons | Click the arrow buttons in the panel |

---

## Commands

| Command | Description |
|---|---|
| `Instagram Sidecar: Login` | Open Instagram login in Chrome |
| `Instagram Sidecar: Open Reels` | Open the reels sidebar panel |
| `Instagram Sidecar: Add Reel` | Add a reel by URL or shortcode |
| `Instagram Sidecar: Next Reel` | Navigate to the next reel |
| `Instagram Sidecar: Previous Reel` | Navigate to the previous reel |
| `Instagram Sidecar: Refresh` | Refresh the current panel |
| `Instagram Sidecar: Logout` | Log out and close the panel |

---

## Keyboard Shortcuts

| Shortcut | Action | When |
|---|---|---|
| `Ctrl+Alt+Down` (`Cmd+Alt+Down` on Mac) | Next Reel | Reels panel is focused |
| `Ctrl+Alt+Up` (`Cmd+Alt+Up` on Mac) | Previous Reel | Reels panel is focused |

---

## Settings

| Setting | Default | Description |
|---|---|---|
| `instagramSidecar.sidecarWidth` | `430` | Preferred panel width in pixels |
| `instagramSidecar.sidecarHeight` | `900` | Preferred panel height in pixels |

---

## How It Works

1. **Authentication**: The extension opens Instagram's login page in your system browser using VS Code's `openExternal` API. You authenticate normally in Chrome. The extension remembers your login confirmation.

2. **Reel Display**: Individual reels are displayed using Instagram's official embed endpoint (`/reel/{shortcode}/embed/`), which is specifically designed to be embedded in iframes. This avoids the `X-Frame-Options` restrictions that block the main Instagram site.

3. **Navigation**: Instead of trying to scroll within a single page (which cross-origin restrictions prevent), the extension loads one reel at a time and swaps between them. Arrow keys, mouse wheel, on-screen buttons, and VS Code commands all trigger reel switching.

---

## Development

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes
npm run watch

# Package as VSIX
npm run package
```

### Running in Development

1. Open this folder in VS Code
2. Press `F5` to launch the Extension Development Host
3. Open the Command Palette and run `Instagram Sidecar: Login`

## Publishing

This repository is set up to publish to the Visual Studio Marketplace through GitHub Actions.

1. Create or verify the `bhabinexpert` Marketplace publisher account.
2. Add a GitHub repository secret named `VSCE_PAT` with a valid VS Code Marketplace personal access token.
3. Push a tag like `v0.0.4` or run the `Publish VS Code Extension` workflow manually from GitHub Actions.
4. The workflow runs `npm ci`, compiles the extension, and publishes with `vsce`.

---

## Requirements

- VS Code 1.85 or later
- A web browser (Chrome, Edge, etc.) for Instagram login
- An Instagram account

---

## Release Notes

### 0.0.4

- Added Marketplace publish workflow and release documentation.
- Cleaned generated artifacts from the code base and tightened ignore rules.

### 0.0.3

- Prepared the extension for public Marketplace publishing with cleaned packaging and installable VSIX output.

### 0.0.2

- Login now opens in Chrome/default browser instead of broken iframe embedding
- Reels displayed using Instagram's official embed endpoint
- Added mouse wheel and arrow key navigation between reels
- Added ability to add reels by URL or shortcode
- Added Browse button to find reels in Chrome
- Added persistent login state and saved reels
- Added keyboard shortcuts (`Ctrl+Alt+Up/Down`)
- Added logout command

### 0.0.1

- Initial prototype release

---

## License

MIT -- [bhabinexpert](https://github.com/bhabinexpert)
