# Security and privacy

## Phase 1 data handling

- Note titles, bodies, UUIDs, codes, and timestamps are stored only in this
  browser profile's IndexedDB database (`keep-vault`).
- No note data is sent to a backend, AI provider, analytics service, or sync
  endpoint. There are no application secrets or API keys.
- The copy action writes the selected note to the system clipboard only after an
  explicit user action.
- Anyone with access to the browser profile or device may be able to access
  locally stored notes. Clearing site data can delete the vault. Phase 1 does not
  provide recovery, backup, or cross-device availability.
- Browser same-origin protections apply; IndexedDB storage is not a substitute
  for an application-level encryption feature.

## Dependency and delivery controls

Dependencies are declared in `package.json` and pinned by the npm lockfile.
GitHub Actions runs lint, type-check, tests, and a production build on pushes and
pull requests with read-only repository permissions.

## Scope

No authentication, server, sync, external AI, telemetry, import/export, or
cryptographic key management is included. Revisit the threat model before adding
any of those data flows. The repository is public and currently has no selected
license; this is an unresolved maintainer decision.
