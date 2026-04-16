# Changelog

All notable changes to the **Instagram Reels Sidecar** extension will be documented in this file.

## [0.0.6] - 2026-04-16

### Changed
- Prepared the release metadata for the next Marketplace update.

## [0.0.5] - 2026-04-13

### Changed
- Removed browser-based reel browsing from the webview so reel playback stays inside VS Code after login.

## [0.0.4] - 2026-04-13

### Added
- GitHub Actions publish workflow for Visual Studio Marketplace releases.
- Repo-level ignore rules for generated package artifacts and TypeScript build cache.

### Changed
- Public release metadata updated for the latest Marketplace-ready build.

## [0.0.3] - 2026-04-13

### Changed
- Prepared the extension for public Marketplace publishing with cleaned packaging and installable VSIX output.

## [0.0.2] - 2026-04-13

### Added
- Login via Chrome: opens Instagram login in your default browser using `vscode.env.openExternal`
- Reel display using Instagram's official embed endpoint (`/reel/{shortcode}/embed/`)
- Add reels by URL or shortcode from the Command Palette or toolbar button
- Browse button to open Instagram Reels in Chrome for discovery
- Mouse wheel navigation between reels (with cooldown to prevent rapid skipping)
- Arrow key navigation (Up/Down) and vim-style keys (j/k)
- On-screen up/down arrow buttons for click-based navigation
- Keyboard shortcuts: `Ctrl+Alt+Down` / `Ctrl+Alt+Up` when panel is focused
- Persistent login state across VS Code sessions
- Persistent saved reels list across sessions
- Logout command to clear session
- Empty state UI with inline reel URL input

### Fixed
- Instagram iframe embedding now works using the official embed endpoint (previously blocked by X-Frame-Options)
- Login no longer attempts to load inside a VS Code webview (Instagram blocks this)
- Scroll navigation no longer relies on cross-origin `contentWindow.scrollBy` (which always failed)

### Changed
- Reels are displayed one at a time via embed iframes instead of a single scrollable page
- Navigation switches between individual reel embeds instead of scrolling pixels

## [0.0.1] - 2026-04-12

### Added
- Initial prototype release
- External browser sidecar window approach
