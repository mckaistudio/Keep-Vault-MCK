# Keep Vault MCK

Offline-first web application by MCK AI Studio. This is a **web app, not a Chrome extension**: do not use Chrome's Load unpacked button.

## Start on Windows

1. Extract the project ZIP into a folder.
2. Install Node.js 20.19+ or 22.12+ if needed.
3. Open a terminal in the extracted folder (the folder containing `package.json`).
4. Run `npm ci` to install the required packages using `package-lock.json`.
5. Run `npm run dev`, then open the local address printed in the terminal in Chrome or Brave.
6. Stop the local server with Ctrl+C when finished.

To check the code, run `npm test` and `npm run build`. The application runs locally; the browser stores notes in its own IndexedDB database. Browser data may be lost if the profile is cleared: keep separate backups.

## Features through Phase 6

- Notes, search, category codes, dark/light interface.
- Prompt and workflow tools.
- Import/export, backup integrity checks and ZIP backup/restore preview.
- Encrypted backup download and recovery with a passphrase of at least 12 characters.
- Private Vault for separately encrypted secrets, lock/unlock, and encrypted-record export/import.

**Security:** Private Vault records are encrypted before being saved to browser storage. Ordinary notes are not encrypted at rest. The general encrypted-backup feature encrypts its exported file, not every browser database entry. Unencrypted exports must be protected. A lost passphrase cannot be recovered by this app. Backups must be tested before deleting original data.

## Project status

Phase 6 automated tests and isolated Chrome recovery checks are documented in `docs/PHASE-06-VERIFICATION.md`. Browser tests do not guarantee a production security audit. The `development/phase-01-foundation` branch is the working branch; do not merge into `main` without approval.

The repository is private. No open-source license has been granted. Copyright 2026 MCK AI Studio. All rights reserved.
