# Bibek Mallik — Electrical Engineer Portfolio

A single-page personal portfolio site for **Bibek Mallik**, an Electrical Engineer
(Nepal Electricity Authority / ex K&A Engineering Consulting). Built as a static
site — no backend, no framework runtime.

## Tech Stack

- **HTML5** — single `index.html` containing all sections (Hero, Experience, About,
  Education, Skills, Projects, Contact).
- **Tailwind CSS** — utility classes (see *Build* below).
- **Custom CSS** — `assets/css/styles.css` holds the design tokens (CSS variables),
  4 switchable color palettes, light/dark themes, and component classes
  (`.glow-card`, `.nav-link`, `.btn-primary`, progress bars, etc.).
- **Vanilla JS** — `assets/js/main.js`: theme + palette managers (persisted to
  `localStorage`), mobile menu, smooth scroll, scroll-spy nav, animated skill bars,
  live experience/tenure counters, and the contact form handler.
- **AOS** — scroll-reveal animations (CDN).
- **Fonts/Icons** — Google Fonts (IBM Plex Sans/Mono, Space Grotesk), Material
  Symbols, Boxicons (all CDN).

## Features

- Dark/light theme toggle (dark is default).
- 4 color palettes: Grid Power, Classic Blueprint, High-Voltage Amber,
  Automation Terminal — cycled from the nav palette button.
- Live "career uptime" and tenure counters computed from employment start dates.
- Contact form posts to Formspree (endpoint configured via the
  `data-formspree-endpoint` attribute on `#contact-form` in `index.html`).

## Running Locally

The site is static. Any static server works:

```bash
# Python
python -m http.server 8000

# or Node
npx serve
```

Then open <http://localhost:8000>.

## Build (Tailwind)

Tailwind is compiled to `assets/css/tailwind.css` from the config and source.

```bash
npm install        # install dev dependencies
npm run build      # one-off production build
npm run watch      # rebuild on change while editing
```

In production, `index.html` links the compiled `assets/css/tailwind.css` instead of
the Tailwind CDN. The custom `styles.css` is linked after it.

## Editing Content

- **Text / sections** — edit `index.html`.
- **Colors / palettes / themes** — edit the CSS variables in `assets/css/styles.css`.
- **Tailwind utility classes** — available after a build; re-run `npm run build`
  (or `npm run watch`) to regenerate `assets/css/tailwind.css`.
- **Contact form** — set the Formspree form ID in the
  `data-formspree-endpoint` attribute on `#contact-form`.
- **Experience counters** — start dates live in `assets/js/main.js`
  (`initExperienceCounters`).

## Deploy

Upload the repo contents to any static host (GitHub Pages, Netlify, Cloudflare
Pages, etc.). No build step is required on the host if `assets/css/tailwind.css`
is already committed.
