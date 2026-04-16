# Instagram Sidecar VSCode Extension - Improvements

## Changes Made

### 1. **Auto-Launch on VSCode Startup**
- Added `onStartupFinished` activation event
- Extension now activates automatically when VSCode starts
- If logged in, the Instagram panel opens automatically

### 2. **In-VSCode Login (No External Browser Required)**
- **Before**: Redirected to Chrome browser for login
- **After**: Login page now appears inside VSCode webview
- User still logs in via Instagram, but experience stays in VSCode
- Better UX with clear instructions

### 3. **Instagram Feed Display in VSCode**
- Added full Instagram feed viewer in a VSCode sidebar panel
- Users can now scroll through Instagram while coding
- Fallback UI if direct embedding is blocked (Instagram security restrictions)
- "Open in Browser" button for full Instagram features when needed

### 4. **Automatic Panel Opening After Login**
- After successful login, Instagram feed automatically opens in the sidebar
- No need to manually request reels URL
- Seamless experience from login to browsing

### 5. **Better State Management**
- Session state persists across VSCode restarts
- Logged-in users have panel open automatically on restart
- Logout properly clears all state

## How It Works Now

### First Time Use:
1. Open VSCode
2. Run command: **"Instagram Sidecar: Login"**
3. Login page opens in VSCode sidebar
4. Click "Open Instagram Login" button
5. Instagram login opens in your browser
6. After login, Instagram feed appears in VSCode sidebar
7. Enjoy scrolling while coding! 🎬

### Subsequent Sessions:
1. Open VSCode
2. Extension auto-activates and opens Instagram feed panel (if you were logged in)
3. Scroll and vibe 👍

## File Structure

```
src/
├── extension.ts          # Main extension code
  ├── activate()          # Load extension, auto-open panel if logged in
  ├── openLogin()         # Login command → login webview
  ├── openReels()         # Open Instagram feed directly  
  ├── openInstagramPanel()      # Manage Instagram feed panel
  ├── getLoginWebviewHtml()     # Login UI in VSCode
  ├── getInstagramWebviewHtml() # Instagram feed viewer
  └── ... other reels functions
```

## Configuration Changes

### package.json
```json
"activationEvents": [
  "onStartupFinished",     // Auto-start when VSCode starts
  "onCommand:instagramSidecar.openLogin",
  "onCommand:instagramSidecar.openReels"
]
```

## Technical Details

### Login Flow
1. Extension creates a webview with login instructions
2. User clicks "Open Instagram Login" button
3. Browser opens Instagram login (external, required for auth)
4. After ~5 seconds, extension assumes login successful
5. Panel switches to Instagram feed view

### Instagram Feed Display
1. Attempts to load Instagram in an iframe
2. If blocked by security policies (X-Frame-Options), shows helpful UI
3. User can still click "Open in Browser" for full Instagram
4. Alternative: Use the Reels Library instead for specific content

## Security & Privacy

✅ **What's NOT stored:**
- Username/password (only kept in your browser session)
- Session tokens (stored in Instagram's domain only)

✅ **What IS stored:**
- Login state (boolean: true/false)
- Your added reels list (shortcodes only)

## Usage Tips

### Keyboard/Mouse Navigation
- **Mouse Wheel**: Scroll through reels in player mode
- **Arrow Keys**: Navigate up/down through reels
- **Click buttons**: Browse library, add reels, refresh
- **Ctrl+Alt+Down/Up** (Windows) or **Cmd+Alt+Down/Up** (Mac): Navigate reels

### Commands
All available via Command Palette (Ctrl+Shift+P or Cmd+Shift+P):
- `Instagram Sidecar: Login` - Start login flow
- `Instagram Sidecar: Open Reels` - Open saved reels player
- `Instagram Sidecar: Add Reel` - Add new reel by URL/shortcode
- `Instagram Sidecar: Logout` - Clear session

## Known Limitations

1. **Instagram Embedding**: Instagram's main feed may not embed directly in VSCode due to security headers. The fallback UI provides alternatives.
2. **Authentication**: Still requires opening external browser for login (Instagram's requirement)
3. **Real-time Features**: Some live/interactive Instagram features work better in the native app

## Testing Checklist

- [ ] Extension activates on VSCode startup
- [ ] Login page appears in VSCode (not external)
- [ ] After login, Instagram panel opens
- [ ] Can scroll and navigate
- [ ] Can add reels and search
- [ ] Logout clears session properly
- [ ] Restarting VSCode shows feed if logged in
- [ ] "Open in Browser" button works

## Future Improvements

1. **Mobile Feed Optimization**: Load mobile Instagram UI for better sidebar fit
2. **Keyboard Shortcuts**: More customizable keybindings
3. **Notifications**: Unread messages/notifications in the sidebar
4. **Search Integration**: Search within VSCode to find reels/content
5. **Custom Collections**: Create curated reel playlists

---

**Version**: 0.0.5  
**Last Updated**: 2026-04-16
