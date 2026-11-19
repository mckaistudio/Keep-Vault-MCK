# Keep Vault MCK Capture — Phase 7 prototype

This is a separate Manifest V3 browser extension. The web app at the repository root is NOT a browser extension.

## Manual installation (Chrome or Brave)

1. Open `chrome://extensions` in Chrome, or `brave://extensions` in Brave.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the `extension/dist` folder containing `manifest.json`.
4. Confirm that **Keep Vault MCK Capture** appears in the list. If an error appears, record its exact wording.
5. Open a normal HTTPS webpage, highlight non-sensitive text, click the extension icon, then **Capture selection**.
6. Edit title or text; use **Copy**, **Save file**, or **Cancel**.

The **Save file** button downloads a JSON capture file locally. It does NOT import the capture into the web app yet; safe handoff and import preview are pending Phase 7 tasks. No background scraping, cloud upload, or persistent browser storage is used. Permissions: `activeTab` (temporary access to the tab the user interacts with) and `scripting` (read selected text only when the Capture button is pressed). Restricted browser pages cannot be captured.

## Verification status

- Manifest JSON and popup JavaScript syntax: PASS.
- Automated extension installation using Chrome/Brave command-line flags: NOT VERIFIED. Both isolated profiles launched, but no Keep Vault extension entry was found in profile preferences. Do not report manual installation or capture as passing until actually tested.
- Manual install, capture, copy, save, cancel, shortcut, Keep assistance, safe web-app handoff: PENDING.

Test with a separate temporary browser profile only; never disturb the user's normal browser tabs or data. Stop test browsers after use. Do not merge `main` without approval.

## Keyboard shortcut

The extension suggests **Ctrl+Shift+Y** to open its popup. If it conflicts with another shortcut, open **chrome://extensions/shortcuts** in Chrome or **brave://extensions/shortcuts** in Brave and assign a different key. The shortcut only opens the popup; capture still requires a deliberate button click.


## Source URL privacy

The extension removes URL login credentials, query parameters (the part after ?), and fragments (the part after #) before showing or exporting the source. This prevents accidental export of common URL tokens, but some links may no longer point to the exact search result or section. Review captured text and source before saving; never select passwords, OTPs, payment information, or private account data.

