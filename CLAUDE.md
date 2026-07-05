# whalevue - Project Guide & Memory

Technical documentation and project rules for `whalevue`, a Vue 3 + Vite app
that renders a library of Markdown guides, references, and articles. Content
lives as plain `.md` files — the file tree *is* the database (no CMS, no JSON).

## 👤 Developer Profile
* **Author:** Keith Thomson
* **Role:** SysAdmin | Programmer | Professional Cloud Developer (Gales Ferry, CT)
* **Employer:** Systems Resource Management Inc. (Supporting US Nuclear Navy submarine training programs)
* **Core Skills:** Go, Bash, Google Cloud Platform (GCP), AWS, Docker, Kubernetes, Zsh, DevOps

> Author focus is Go/Bash/Cloud, but **this app is written in JavaScript + Vue** —
> do not translate app code to Go/Bash idioms. Match the surrounding Vue/JS style.

---

## 🧱 Tech Stack

* **Vue 3** (Composition API, `<script setup>`) + **Vue Router 4**
* **Vite 8** build tooling (`@vitejs/plugin-vue`, `vite-plugin-vue-devtools`)
* **Tailwind CSS 3** (+ `@tailwindcss/forms`), PostCSS + Autoprefixer
* **Markdown:** `marked` + `marked-highlight` + `highlight.js`
* **Language:** **plain JavaScript** (`.js` / `.vue`). **No TypeScript** — author preference.
* **Fonts:** Inter (UI) + JetBrains Mono (code), loaded from Google Fonts in `index.html`.

---

## 🛠️ Core Commands

* `npm run dev` - Start local development server (http://localhost:5173)
* `npm run build` - Generate production static build to `dist/`
* `npm run preview` - Preview the production build locally

> Lint/test scripts are not configured yet. If added, prefer ESLint + Vitest and
> document them here.

---

## 🎨 Architecture & Style Guide

### Content pipeline (the core of the app)
* Markdown source files live in [`/markdown/`](./markdown) at the project root,
  organized into **category folders** (`go/`, `python/`, `rust/`, `linux/`, …).
* Files are loaded at build time in [`src/markdown.js`](./src/markdown.js) via
  `import.meta.glob('../markdown/**/*.md', { query: '?raw', eager: true })`.
* **No frontmatter.** Metadata is *derived* from each file:
  * `title` — first `# H1` (falls back to a prettified filename), inline markdown stripped
  * `category` — the top-level folder
  * `type` — auto-classified as **Guide**, **Reference**, or **Article** (see `classify()`)
  * `excerpt` — first real paragraph; `readTime` — estimated from word count
  * `id`/`slug` — folder-relative path, e.g. `go/variables`
* To add content, drop a `.md` file into the right category folder — that's it.

### Rendering
* Render markdown with `marked` via the shared `renderMarkdown()` in `src/markdown.js`.
* `cleanMarkdown()` strips the pandoc syntax some source files use
  (`::: div` fences, `{#id .class}` heading attributes) before rendering.
* Code blocks are highlighted by `highlight.js` with **language auto-detection**
  (source files use indented code blocks without language tags). Theme:
  `atom-one-dark` (imported in `src/main.js`).
* Inject rendered HTML with Vue's `v-html` bound to a `computed` — never manipulate the DOM directly.

### Vue & Tailwind standards
* Use the **Composition API** with `<script setup>`.
* Prefer **Tailwind utility classes** in templates.
* Custom CSS is allowed where utilities fall short: global tokens and component
  classes live in `src/style.css` (`@tailwind` + `@layer components` with `@apply`),
  and the rich article typography is a scoped `<style>` block in `BlogPost.vue`.
* Keep layouts responsive with Tailwind breakpoint prefixes (`sm:`, `md:`, `lg:`).

### Directory Structure
```text
├── index.html            # Google Fonts links + app title
├── markdown/             # Markdown content, categorized by folder (the "database")
├── public/               # Static assets (favicon.ico, meandsophia.jpeg)
├── src/
│   ├── main.js           # App entry: router setup + global CSS/theme imports
│   ├── App.vue           # Root component (nav shell)
│   ├── markdown.js       # Content loader, metadata derivation, renderMarkdown()
│   ├── style.css         # Tailwind entry + @layer component classes
│   ├── components/
│   │   └── icons/        # GitHubIcon.vue, etc.
│   └── views/            # Home, Blog, BlogPost, Projects, About, Contact
├── vite.config.js        # Vue plugin, devtools, `@` -> ./src alias
├── jsconfig.json         # editor `@/*` -> ./src/* path mapping
├── tailwind.config.js    # Inter + JetBrains Mono font families
└── postcss.config.js
```

---

## 🛑 Strict Rules

1. **Keep it lean:** avoid heavy runtime dependencies; write fast, structural code.
2. **No frontmatter contract:** content files carry no metadata — all metadata is
   derived in `src/markdown.js`. Improve the derivation there rather than requiring
   authors to annotate files.
3. **Label by type, not "notes":** individual items are **Guides**, **References**, or
   **Articles** (via the `type` field + `typeBadgeClass()`); use neutral umbrella
   wording ("entries", "Guides & References") for mixed collections.
4. **No direct DOM manipulation:** render markdown through `v-html` bound to a reactive
   `computed`/`ref`.
5. **DevOps ready:** any container config (`Dockerfile`, `docker-compose.yml`) must be
   clean, multi-stage for small images, and documented.
