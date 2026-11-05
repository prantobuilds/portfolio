# Build Samiul H Pranto’s one-page portfolio

## What will change
- Replace the `/` placeholder with the complete portfolio, containing only the requested navigation and seven sections in the specified order.
- Add editable service and project copy in `src/data/services.ts` and `src/data/projects.ts`; use clean site-name mockups for project visuals and a neutral photo placeholder for the About section.
- Apply the specified light and dark palettes, typography, responsive layout, accessible mobile navigation, and reduced-motion-aware circular theme reveal with an instant fallback. Save the selected theme in local storage while following the system preference on first visit.
- Build the service-prefilled contact form with client-side validation, loading/success/error states, duplicate-submit prevention, and Web3Forms submission using `VITE_WEB3FORMS_KEY`; show a configuration message when the key is unavailable.
- Add page-specific SEO and social metadata, Person structured data, the single-URL sitemap, and the requested favicon and analytics placeholder.
- Preserve only the supplied copy and links. Do not add unlisted sections or fabricate clients, claims, credentials, or other content.

## Technical details
- Keep the implementation in the existing TanStack Start entry route and global stylesheet; no database, authentication, or backend is planned.
- Use the installed `lucide-react` icons and semantic HTML, keyboard-accessible controls, visible focus states, and responsive layouts without horizontal overflow.
- Update the routing test as appropriate and verify the rendered page, theme toggle, service selection, and contact form’s missing-key behavior.
