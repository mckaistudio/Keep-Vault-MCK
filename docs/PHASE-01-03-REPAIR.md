# Phase 1–3 repair audit

## Confirmed
- The Phase 3 archive contains the Phase 1–3 application source and separate phase prompts.
- All three original ZIP archives pass ZIP CRC checks.
- The Phase 3 Node smoke test passes (one test only; not a complete product test).
- GitHub development branch previously contained planning documents, not the complete application source.

## Repairs in this package
- Switching notes clears stale prompt draft, placeholder values and revision list.
- New Note focus is scheduled after the UI updates.
- Empty prompt drafts are rejected by Use in Note and Copy Prompt.

## Remaining blockers
- Dependency installation timed out in the current environment. TypeScript compile and Vite production build not verified.
- IndexedDB behavior and Brave/Chrome visual testing not verified.
- Full source upload to GitHub still required; do not claim Phase 1–3 deployment or completion.
- The current test is only a smoke test and does not validate actual UI/database behavior.

## Required acceptance gate before Phase 4
1. Push complete source to development branch, leaving main untouched.
2. Install dependencies successfully and run npm run build and npm test.
3. Test create/edit/pin/archive/filter, @CODE allocation and revisions in Brave.
4. Verify persisted data survives reload and errors are displayed safely.
5. Record exact commit and test evidence.
