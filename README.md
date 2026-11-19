# Keep Vault MCK

Offline-first notes foundation by **MCK AI Studio**.

## Run locally

Requires Node.js 20.19+ or 22.12+. Run `npm install`, then `npm run dev`. Open the local URL displayed by Vite. Use `npm run build` for a production build.

## Phase 1 functionality

- Create, edit, list, search and copy notes.
- IndexedDB persistence in the current browser profile.
- Unique category-based @CODE identifiers allocated in one IndexedDB transaction.
- Responsive dark/light UI.

**Important:** Browser data is not a backup. No backup/export, encryption, cloud sync, Google Keep integration, prompt AI, or automatic deletion exists yet. Do not store passwords or recovery keys in Phase 1.

## Development

Phase prompts are kept under `prompts/phase-XX/` and do not affect the application build. Review `docs/ROADMAP.md` for future phases. This repository is public. No license has been granted yet; commercial/open-source licensing requires an explicit decision.

Copyright © 2026 | All Rights Reserved | Developed by MCK AI Studio

## Phase 6 encrypted backup
Open Import & Backup. Enter a passphrase of 12 or more characters twice and click Download encrypted backup. To restore, select the encrypted JSON, enter the same passphrase, click Decrypt and review, and confirm the import. This encrypts only the exported backup file; browser IndexedDB data is not encrypted at rest. No passphrase is stored. Losing it makes encrypted backup recovery impossible. The JSON backup from Phase 5 remains available and unencrypted.
