# Phase 6 — Recovery and security notes

1. Open Import & Backup, download the encrypted backup and save it outside the browser. The passphrase must be at least 12 characters. Keep the passphrase separately; there is no password reset.
2. To restore, choose the encrypted JSON backup, enter the passphrase, decrypt, review the candidates and select which notes to import. Existing notes are never overwritten by this workflow.
3. Integrity-manifest JSON backups detect accidental changes using SHA-256 but are NOT encrypted and do not prove who created them. Never share unencrypted backups containing sensitive information.
4. The Private Vault stores individual encrypted secrets in IndexedDB. Private records are NOT included in the normal notes backup. Losing the browser profile may lose these secrets. Do not rely on the Private Vault as your only copy of irreplaceable data.
5. To test recovery safely, create a disposable note, export a backup, change one character in a copy of the manifest backup and confirm the integrity check rejects it. Then restore the original backup and verify the review appears before import.
6. No automatic cloud upload or external AI transmission is implemented. Browser storage may be erased by profile cleanup. A seven-day reminder appears only when the backup page is opened, not as a background notification.
7. Threat model: AES-GCM encryption protects encrypted records at rest against casual inspection of IndexedDB. It does not protect data when the vault is unlocked, from malicious browser extensions, compromised operating systems or weak/reused passphrases. Names of private records remain visible; their contents are encrypted.
8. If a restore is interrupted before IndexedDB transaction completion, the notes batch is rolled back. Never clear browser data before verifying an external backup and successful restore.
