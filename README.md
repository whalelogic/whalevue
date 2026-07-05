# whalevue

A Vue 3 + Vite portfolio/blog that serves its content from **Markdown files**
instead of a JSON database. Adapted from `awesomeVueBlog`, which loaded posts
from `allposts.json`; whalevue reads the `markdown/` tree at build time.

## How content works

- Every `.md` file under [`markdown/`](./markdown) becomes a note/post.
- Each **top-level folder** (`go`, `python`, `rust`, `linux`, `bash`, …) is a
  **category**. Files directly in `markdown/` fall under `general`.
- Metadata is derived from the file itself — no frontmatter required:
  - **title** — the first `# Heading` (falls back to a prettified filename)
  - **excerpt** — the first real paragraph
  - **read time** — estimated from word count
  - **slug / id** — the folder-relative path, e.g. `go/variables`
- Files are loaded via Vite's `import.meta.glob('../markdown/**/*.md', { query: '?raw' })`
  in [`src/markdown.js`](./src/markdown.js).

To add a post, just drop a Markdown file into the right category folder.

## Features

- **Categorized browsing** with a category filter, plus **global search**
  across every note regardless of category (`src/views/Blog.vue`).
- **Syntax highlighting** for code blocks via `marked-highlight` + `highlight.js`
  (language auto-detection, since the source files use indented code blocks).
- **Web fonts** (Inter + JetBrains Mono) loaded from Google Fonts so they render
  even if the visitor doesn't have them installed.
- Home, Blog, Post, Projects, About, and Contact pages (Tailwind CSS, dark theme).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
