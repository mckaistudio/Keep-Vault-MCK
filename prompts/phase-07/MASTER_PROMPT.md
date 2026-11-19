# Phase 7 — Keep Vault MCK Browser Extension

Build a real lightweight Manifest V3 Chrome and Brave extension as a SEPARATE `extension/` package alongside the existing React/Vite web application. Never load the existing web-app folder as an extension or add a fake root manifest. Preserve all Phase 1–6 behavior and data.

## Required functionality
1. Capture user-selected webpage text on demand only; show editable preview with title, source URL, capture time, category and tags. Save, Copy and Cancel must work.
2. Keyboard shortcut for capture; document configuration at `chrome://extensions/shortcuts` and conflicts.
3. Google Keep assistance only when user explicitly requests it; provide safe manual copy and Google Takeout fallback. Do not assume an official Keep API, scrape private content automatically, or bypass login.
4. Safe explicit handoff to local Keep Vault web app, with a user-driven export/import fallback. A separate extension cannot directly access the web app's IndexedDB. Never silently overwrite notes.
5. Lightweight accessible popup with clear error messages and dark/light appearance.
6. Minimal permissions; prefer activeTab, scripting and storage only if justified. Avoid all_urls and persistent host access unless absolutely necessary.
7. Never auto-capture passwords, OTPs, payment details, private windows or clipboard. Never send data to remote services, use telemetry, load remote scripts or store vault passphrases.
8. Preserve AES-GCM private-record encryption and backup verification. Do not put secrets or private vault keys in extension storage.
9. Offline and low-RAM behavior on Windows 10 with 4GB RAM. No background polling or heavy animation.
10. Build an actual extension/dist/manifest.json and document Load unpacked for that directory ONLY.

## Work phases
A. Audit existing code and document security boundaries, data flow and permissions.
B. Implement separate MV3 manifest, popup and user-triggered selection capture.
C. Implement safe local web-app handoff and manual export/import fallback.
D. Implement Keep assistance, keyboard shortcuts and robust errors.
E. Test, package, document and checkpoint each verified stage.

## Required tests
- Valid manifest and real installation in both Chrome and Brave.
- Capture on allowed pages, edit, cancel, copy, save, source metadata and Unicode.
- Empty selection, denied permission, restricted URLs, oversize text, duplicate data, unavailable web app and storage failures.
- No sensitive-field capture, no automatic page scraping, no data transmission, no remote code.
- Shortcut operation and conflict fallback; Google Keep assistance with manual fallback.
- Safe import preview and duplicate handling, no silent replacement.
- Existing Phase 1–6 automated tests and production build PASS.
- Record actual Chrome and Brave test evidence, do not claim untested items PASS.

## Project rules
Keep private GitHub development branch; do not merge main without approval. Use one isolated temporary browser profile at a time; never touch normal Chrome tabs or user data. Close temporary browsers and servers after tests. Use only free tools, and do not overload the 4GB RAM laptop. Commit tested checkpoints. Deliver an English development prompt, beginner-friendly installation instructions, permission justification, privacy notes and accurate progress percentage. Phase 7 remains IN PROGRESS until real Chrome and Brave extension tests pass.

Date: 19 November 2026. Time: 06:53 PM PKT (verified from connected laptop).
