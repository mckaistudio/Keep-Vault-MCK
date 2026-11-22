# Keep Vault MCK

Keep Vault MCK is a private, local-first notes app. Phase 1 is a single-page
TypeScript, React, and Vite application. Notes are stored in the browser's
IndexedDB database through Dexie; no account, backend, AI service, analytics, or
cloud synchronization is used.

## Requirements

- Node.js 22.12 or later
- npm

## Run locally

```sh
npm ci
npm run dev
```

## Verify

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

## Phase 1 behavior

- Create, edit, save, view, search, and copy notes.
- Assign each note a UUID and a unique sequential `@000001`-style code.
- Store notes and the allocator sequence transactionally in IndexedDB.
- Search all fields, title only, content only, or an exact code/ID/title/content.
- Choose dark, light, or system appearance; enable lite surfaces or reduced motion.
- Notes remain in this browser profile on this device. Clearing browser site data
  can permanently remove them; Phase 1 does not sync or back up data.

See [the architecture](docs/ARCHITECTURE.md), [phase scope](docs/PHASES.md),
[security notes](docs/SECURITY.md), and [project status](docs/PROJECT_STATUS.md).

## License

No license has been selected. The repository is public, but public visibility
does not grant permission to reuse, modify, or redistribute its contents. A
maintainer must choose and add an appropriate license before the project can
clearly grant those permissions. No license file is included in Phase 1.
