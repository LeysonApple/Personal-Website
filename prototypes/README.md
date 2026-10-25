# Local prototypes

Static builds of the real prototypes, linked from the case-study pages ("体验原型 ↗"). Built artefacts — do not edit by hand.

- `picto/` — imLeyson/Picto, `npx vite build --base ./` only (portfolio copy step skipped). Post-build: splash logo path made relative; canonical/OG pointed at this site.
- `focenda/` — imLeyson/Focenda, `npm run build:web` (app/ only, no marketing site) in local-only demo mode: Supabase client replaced by an offline stub, backend config emptied, Supabase removed from CSP, service worker not shipped. No account, no cloud sync; data stays in the browser's localStorage.
