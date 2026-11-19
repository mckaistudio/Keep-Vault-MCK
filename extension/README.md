# Keep Vault MCK Capture â€” Phase 7 prototype

This is a separate Manifest V3 browser extension. The web app at the repository root is NOT a browser extension.

## Manual installation (Chrome or Brave)

1. Open `chrome://extensions` in Chrome, or `brave://extensions` in Brave.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the `extension/dist` folder containing `manifest.json`.
4. Confirm that **Keep Vault MCK Capture** appears in the list. If an error appears, record its exact wording.
5. Open a normal HTTPS webpage, highlight non-sensitive text, click the extension icon, then **Capture selection**.
6. Edit title or text; use **Copy**, **Save file**, or **Cancel**.

The **Save file** button downloads a JSON capture file locally. The web app now supports user-selected extension capture JSON files with a review step before local import. Open the web app Import and backup area, select the downloaded keep-vault-capture JSON, review the note, and click Import. No automatic handoff or upload is performed. No background scraping, cloud upload, or persistent browser storage is used. Permissions: `activeTab` (temporary access to the tab the user interacts with) and `scripting` (read selected text only when the Capture button is pressed). Restricted browser pages cannot be captured.

## Verification status

- Manifest JSON and popup JavaScript syntax: PASS.
- Automated extension installation using Chrome/Brave command-line flags: NOT VERIFIED. Both isolated profiles launched, but no Keep Vault extension entry was found in profile preferences. Do not report manual installation or capture as passing until actually tested.
- Manual install, capture, copy, save, cancel, shortcut, and Keep assistance: PENDING live browser verification. Local JSON handoff/import: automated tests PASS; end-to-end browser verification PENDING.

Test with a separate temporary browser profile only; never disturb the user's normal browser tabs or data. Stop test browsers after use. Do not merge `main` without approval.

## Keyboard shortcut

The extension suggests **Ctrl+Shift+Y** to open its popup. If it conflicts with another shortcut, open **chrome://extensions/shortcuts** in Chrome or **brave://extensions/shortcuts** in Brave and assign a different key. The shortcut only opens the popup; capture still requires a deliberate button click.


## Source URL privacy

The extension removes URL login credentials, query parameters (the part after ?), and fragments (the part after #) before showing or exporting the source. This prevents accidental export of common URL tokens, but some links may no longer point to the exact search result or section. Review captured text and source before saving; never select passwords, OTPs, payment information, or private account data.



## Google Keep manual fallback

Click **Copy** to put selected text on the clipboard, then click **Open Google Keep**. In the new Google Keep tab, create a note and paste with Ctrl+V. The extension never signs in, writes a Keep note automatically, or uploads captured text. Browser opening remains pending real Chrome/Brave verification.


**Copy for Keep** copies the title and body together with a blank line between them. This is separate from **Copy**, which copies body text only. The user still chooses whether to paste into Keep; no automatic write or account access occurs.


## Real Chrome smoke test (19 Nov 2026)

Using Chrome 157 with a separate temporary profile, the popup HTML and scripts rendered; capture, Copy for Keep and Open Google Keep handlers ran successfully with simulated extension APIs. In a separate real Chrome webpage, the captureSelection function returned highlighted public text and rejected an active private textarea. This verifies actual Chrome DOM behavior, **not** installed-extension permissions, keyboard shortcut, download, or actual end-to-end capture. Temporary Chrome processes were closed, and the user's normal browser tabs were untouched. Brave installation remains unverified.


## Installed Chrome JSON download test (19 November 2026)

Verified in Chrome 157 with a temporary isolated profile: the real unpacked extension was loaded via Chrome DevTools Protocol `Extensions.loadUnpacked`, and its real popup **Save file** button was clicked with a manually entered safe sample note. Chrome downloaded `keep-vault-capture-2026-11-19T17-00-28-557Z.json`. The downloaded JSON was parsed and checked: format marker, title, body, source URL, ISO capture timestamp, category, and tags all matched expected values. **PASS: installed Chrome extension popup JSON export and local download.** This was not a webpage capture test: the sample content was entered directly into popup fields. **PENDING:** actual activeTab-granted webpage capture via the extension, full browser import, and Brave installation. The temporary Chrome test processes were closed; the user's normal browser tabs were not touched.

## Installed Brave JSON download test (19 November 2026)

Brave Chromium 158 in an isolated temporary profile exposed Chrome DevTools Protocol with `--enable-unsafe-extension-debugging`. `Extensions.loadUnpacked` loaded the real extension and returned an extension ID. The real popup **Save file** handler was invoked with manually populated safe sample title/body/source/tags. Brave downloaded a `keep-vault-capture-*.json` file, and the exported format marker, title, body, URL, timestamp, category and tags were parsed and checked. **PASS: Brave installed extension JSON export and actual local download.** **NOT VERIFIED:** selection capture from a real HTTP(S) page via the installed extension and user-granted activeTab access, full browser app import. This test does not imply full end-to-end webpage capture.
