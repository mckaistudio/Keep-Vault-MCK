# Phase 6 verification — 2026-11-19

## Verified
- Connected Windows laptop project source matched the supplied Phase 6 source (SHA-256 checked for seven representative files before repair).
- Node automated suite: 20/20 passed on the laptop.
- TypeScript + Vite production build: passed on the laptop after fixing Web Crypto BufferSource typing in `src/vaultCrypto.ts`.
- Phase 6 backup encryption unit tests cover round trip, random salt/IV, wrong password, tampered ciphertext, malformed file and short passphrase.
- Application's production preview HTTP endpoint responded 200 on the laptop.
- GitHub development branch `development/phase-01-foundation`: source pushed in commit `fab9229` (not merged to main).

## Not verified or not yet implemented
- Brave graphical or interactive test: two isolated Brave headless runs timed out without DOM output; cannot claim a pass.
- Chrome interactive compatibility: not tested.
- Encrypted **backup files** are supported; notes in IndexedDB are **not encrypted at rest**. Sensitive vault, lock/unlock, backup ZIP manifest/integrity, selective restore, scheduled reminders, and recovery drills are not yet implemented.
- Google Takeout ZIP import is not implemented; extracted JSON files only.
- Full UI buttons and restore behavior have not been exercised end-to-end in a browser.

## Recovery guidance
1. Download a backup from the Import & Backup screen and store it outside the browser profile.
2. For encrypted backups, use a unique passphrase of at least 12 characters and keep it separately. Lost passphrases cannot be recovered.
3. Restore by selecting an encrypted backup JSON file, entering its passphrase, and reviewing duplicates before import.
4. The restore process skips exact duplicate title/body pairs and does not silently overwrite existing notes.
5. Do not treat local browser data as a substitute for backups. Do not put highly sensitive secrets in notes until at-rest encryption is implemented and independently verified.
