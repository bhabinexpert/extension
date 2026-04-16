# Quick Testing Guide

## How to Test the Extension Locally

### Prerequisites
- VSCode 1.85.0 or higher
- Node.js 16+
- npm

### Setup

1. **Navigate to extension folder**
   ```bash
   cd "/c/Users/Bhabin/OneDrive/Desktop/extension"
   ```

2. **Install dependencies** (if not already done)
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run compile
   ```

### Launch Extension for Testing

#### Option 1: Via VSCode UI
1. Open VSCode
2. Go to **Run & Debug** (Ctrl+Shift+D)
3. Click **Run Extension** (or press F5)
4. A new VSCode window opens with your extension loaded
5. Check bottom-right for extension loading status

#### Option 2: Via Command Line
```bash
cd "/c/Users/Bhabin/OneDrive/Desktop/extension"
npm run watch  # Auto-recompile on changes
```
Then open VSCode and use Run & Debug as above.

---

## Test Scenarios

### Test 1: Auto-Activation on Startup
**Expected**: Extension loads automatically without user action
1. Launch testing window
2. Check "Output" panel (Ctrl+Shift+U) → select "Instagram Sidecar" to see logs
3. ✅ Should immediately activate

### Test 2: Login Flow (First Time)
**Expected**: Login happens in VSCode, then Instagram panel opens
1. Press Ctrl+Shift+P (Command Palette)
2. Type "Instagram"
3. Select **"Instagram Sidecar: Login"**
4. ✅ A login panel appears in the sidebar
5. Click **"Open Instagram Login"**
6. ✅ Instagram login page opens in your browser
7. Log in to Instagram quickly (or just close the window after 5 sec)
8. ✅ VSCode panel automatically switches to Instagram feed view

### Test 3: Auto-Open on Restart (If Logged In)
**Expected**: Instagram panel opens automatically after restart
1. Keep extension open and logged in
2. Close the testing window
3. Press F5 in VSCode to launch testing window again
4. ✅ Extension activates automatically and opens Instagram panel

### Test 4: Instagram Feed Panel
**Expected**: Feed is displayed, can scroll and interact
1. In Instagram panel, try scrolling with mouse wheel
2. ✅ Can scroll through content
3. Click **"Open in Browser"** button
4. ✅ Instagram opens in your default browser
5. Return to VSCode and verify panel still exists

### Test 5: Reels Library (Fallback)
**Expected**: Can still browse reels via library view
1. Press Ctrl+Shift+P
2. Select **"Instagram Sidecar: Open Reels"**
3. ✅ Library view opens with Popular Reels
4. Click **"+ Add"** on any reel
5. ✅ Reel is added to "Your Added Reels"
6. Click **"Play My Reels"**
7. ✅ Player view opens and shows the reel

### Test 6: Logout
**Expected**: Session is cleared, panel closes
1. Press Ctrl+Shift+P
2. Select **"Instagram Sidecar: Logout"**
3. ✅ Panel closes
4. ✅ Message: "Logged out of Instagram Sidecar"
5. Restart extension
6. ✅ Panel does NOT auto-open (login required again)

### Test 7: Add Reel by URL
**Expected**: Can add reels from URLs
1. Press Ctrl+Shift+P
2. Select **"Instagram Sidecar: Add Reel"**
3. Paste a URL like: `https://www.instagram.com/reel/ABC123/`
4. ✅ Reel is added and visible in library
5. Or try shortcode only: `ABC123`
6. ✅ Should also work

### Test 8: Keyboard Navigation
**Expected**: Can navigate reels with keyboard
1. Open Instagram Feed or Reels player
2. Try **Ctrl+Alt+Down** (Windows) or **Cmd+Alt+Down** (Mac)
3. ✅ Should navigate to next reel
4. Try **Ctrl+Alt+Up** 
5. ✅ Should navigate to previous reel

---

## Common Issues & Fixes

### Issue: Extension doesn't auto-activate
**Solution**: 
- Check if `activationEvents` includes `"onStartupFinished"` in package.json ✅ (Fixed)
- Restart VSCode completely (Ctrl+Shift+P → "Developer: Reload Window")

### Issue: Login window doesn't appear
**Solution**:
- Make sure `enableScripts: true` is set in webview options ✅ (Fixed)
- Check "Output" panel for errors
- Try restarting the test window (F5)

### Issue: Instagram feed is blank/not loading
**Solution**:
- This is expected if Instagram blocks embedding (security headers)
- Use "Open in Browser" button instead
- Or use the Reels Library for curated content
- Check console for CSP errors (Ctrl+Shift+H in webview)

### Issue: Panel doesn't persist across restarts
**Solution**:
- Make sure `retainContextWhenHidden: true` is set ✅ (Fixed)
- Check if login state was saved: verify `context.globalState` is being updated
- Try logging in again

---

## Performance Checklist

- [ ] Extension loads within 1-2 seconds
- [ ] No console errors in Output panel
- [ ] Panel opens/closes smoothly
- [ ] No memory leaks (task manager stays stable)
- [ ] VSCode remains responsive while panel is open
- [ ] Scrolling feels smooth
- [ ] Clicking buttons responds immediately

---

## Before Publishing

1. ✅ Run `npm run compile` - succeeds
2. ✅ Test all 8 scenarios above
3. ✅ No console errors
4. ✅ Updated package.json description
5. ✅ Version bump (currently 0.0.5)
6. ✅ Test on Windows (currently done)
7. 🔲 Test on macOS (if available)
8. 🔲 Test on Linux (if available)

---

## Debug Tips

### Enable Verbose Logging
Add this to extension code:
```typescript
console.log("Message here");
```

View logs in Output panel: Ctrl+Shift+U → Select "Instagram Sidecar"

### Inspect WebView
In the test window (Inspector window):
1. Press Ctrl+Shift+P
2. Type "Developer Tools"
3. Select "Open Webview Developer Tools"
4. Inspect HTML, check console for errors

### Check State Persistence
In test window console:
```javascript
vscode.workspace.getConfiguration().get('instagramLoggedIn')
```

---

## Next Steps After Testing

1. **Increment version** in package.json (e.g., 0.0.6)
2. **Create changelog** entry
3. **Commit changes**: `git add . && git commit -m "feat: in-VSCode login and Instagram feed display"`
4. **Tag release**: `git tag v0.0.6`
5. **Package**: `npm run package` to create .vsix file
6. **Publish** to VSCode marketplace or share .vsix directly

---

**Last Updated**: 2026-04-16  
**Created for**: Testing v0.0.5 improvements
