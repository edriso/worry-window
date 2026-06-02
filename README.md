# Worry Window

A **frontend-only** take on CBT **worry postponement**: instead of worrying all
day, park each worry the moment it shows up and get back to your life — then face
them all at once in one short, scheduled **worry window**. No backend, works
offline.

## The idea

Quick-add worries to a parked list anytime → a card shows when the window opens
(default 18:00) or "open now" while it's open → a **worry session** runs a short
timer (default 10 min) over the parked worries; then **clear & close** and notice
how many already feel smaller.

## Tech

React 19 + TypeScript (strict), Vite, Tailwind v4, Zustand, Zod-validated
localStorage, PWA. Tested with Vitest + Testing Library and Playwright.

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm test
pnpm test:e2e
```

## Notes

- The window-open check and the "parked … ago" label are pure (`lib/window.ts`)
  and unit-tested (the window stays reachable for an hour after its time).
- Entrances animate transform only and keep `opacity: 1`; reduced motion honored.

## License

MIT.
