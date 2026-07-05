// Loads every markdown file under /markdown at build time and derives post
// metadata from it. This replaces the allposts.json data source of the
// original app — the file tree *is* the database.
//
// Each top-level folder (go, python, rust, linux, ...) becomes a category.
// The post `id` is the folder-relative path without the extension
// (e.g. "go/variables"), which doubles as the route slug.

import { Marked } from 'marked'
import hljs from 'highlight.js'

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// A marked instance with a custom code-block renderer:
//  - ```mermaid blocks become <div class="mermaid"> so the diagram can be
//    rendered client-side by mermaid.run() (see BlogPost.vue). The source is
//    HTML-escaped; the browser un-escapes it back to textContent for mermaid.
//  - everything else is syntax-highlighted with highlight.js. The source files
//    use indented code blocks without language tags, so we auto-detect the
//    language; fenced blocks that declare a language use it directly.
const marked = new Marked({
  breaks: true,
  gfm: true,
  renderer: {
    code({ text, lang }) {
      const language = (lang || '').trim().split(/\s+/)[0]
      if (language === 'mermaid') {
        return `<div class="mermaid">${escapeHtml(text)}</div>`
      }
      const known = language && hljs.getLanguage(language)
      const html = known
        ? hljs.highlight(text, { language }).value
        : hljs.highlightAuto(text).value
      return `<pre><code class="hljs language-${known ? language : 'plaintext'}">${html}</code></pre>`
    },
  },
})

// Render already-cleaned markdown to highlighted HTML.
export function renderMarkdown(md) {
  if (!md) return ''
  try {
    return marked.parse(md)
  } catch (err) {
    console.error('Error rendering markdown:', err)
    return '<p>Error rendering content</p>'
  }
}

// Eagerly import the raw text of all markdown files.
const rawFiles = import.meta.glob('../markdown/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

// A small palette of colorful cover images, assigned deterministically so the
// list/cards stay visually varied without needing per-file metadata.
const coverImages = [
  'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop',
]

// Strip pandoc-flavored syntax the source files use (`::: div` fences and
// `{#id .class}` attribute blocks on headings) plus escaped quotes, so the
// content renders cleanly through `marked`.
export function cleanMarkdown(md) {
  return md
    .split('\n')
    .filter((line) => !/^\s*:::/.test(line))
    .map((line) =>
      /^#{1,6}\s/.test(line) ? line.replace(/\s*\{[^}]*\}\s*$/, '') : line
    )
    .join('\n')
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
}

// Strip inline markdown (code spans, bold/italic, links) down to plain text.
// Used for titles so a heading like "Go's `net/http` package" doesn't show
// literal backticks in the nav/cards/hero.
function stripInline(text) {
  return text
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .trim()
}

// Turn a filename like "go_network_programming_guide" into a readable title.
function prettify(name) {
  return name
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

// First `# Heading` becomes the title; fall back to the prettified filename.
function extractTitle(cleaned, fallbackName) {
  const match = cleaned.match(/^#\s+(.+)$/m)
  return match ? stripInline(match[1].trim()) : prettify(fallbackName)
}

// The rendered article body, with the leading top-level `# H1` removed — the
// hero already displays the title, so rendering it again is redundant (and the
// gradient-clipped h1 mangles any inline code inside it).
function extractBody(cleaned) {
  return cleaned.replace(/^#\s+.*(?:\r?\n|$)/m, '').replace(/^\s+/, '')
}

// First real paragraph, stripped of inline markdown, for use as an excerpt.
function extractExcerpt(cleaned) {
  const lines = cleaned.split('\n')
  for (const line of lines) {
    const text = line.trim()
    if (!text) continue
    if (/^#{1,6}\s/.test(line)) continue // heading
    if (/^(\s{4}|\t|```|>|[-*+]\s|\d+\.\s|\|)/.test(line)) continue // code/list/quote/table
    const plain = text
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[#>*_`~]/g, '')
      .trim()
    if (plain.length < 20) continue
    return plain.length > 180 ? plain.slice(0, 180).trimEnd() + '…' : plain
  }
  return 'A technical reference.'
}

function estimateReadTime(md) {
  const words = md.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

// Classify a file as a Guide, Reference, or Article from its title + path.
// Priority: reference-style lookup material first, then step-by-step guides,
// then narrative articles; anything else (single-concept language docs) is a
// Reference by default.
function classify(title, rel) {
  const hay = `${title} ${rel}`.toLowerCase()
  if (
    /\breference\b|cheat\s?-?sheet|\bidioms?\b|\bkeywords?\b|conventions|quick\s+ref|command\s+reference|\btable\b/.test(
      hay
    )
  )
    return 'Reference'
  if (
    /\bguide\b|getting\s+started|how[\s-]?to|\bbuild(?:ing)?\b|mastering|deep[\s-]?dive|\bdeploy\b|development\s+with|\binstall\b|\bsetup\b|\btutorial\b|walkthrough/.test(
      hay
    )
  )
    return 'Guide'
  if (/\bvs\.?\b|versus|understanding|concepts?|\bintro(?:duction)?\b/.test(hay))
    return 'Article'
  return 'Reference'
}

// Tailwind classes for the colored type badge. Kept here (a file Tailwind
// scans) so the literal class names survive purging.
export function typeBadgeClass(type) {
  return (
    {
      Guide: 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30',
      Reference: 'bg-sky-600/20 text-sky-300 border border-sky-500/30',
      Article: 'bg-amber-600/20 text-amber-300 border border-amber-500/30',
    }[type] || 'bg-gray-600/20 text-gray-300 border border-gray-500/30'
  )
}

// Build the post list from the globbed files.
export const posts = Object.entries(rawFiles)
  .map(([path, raw], index) => {
    // "../markdown/go/variables.md" -> "go/variables"
    const rel = path.replace(/^\.\.\/markdown\//, '').replace(/\.md$/, '')
    const segments = rel.split('/')
    const category = segments.length > 1 ? segments[0] : 'general'
    const name = segments[segments.length - 1]
    const cleaned = cleanMarkdown(raw)
    const title = extractTitle(cleaned, name)

    return {
      id: rel,
      slug: rel,
      title,
      type: classify(title, rel),
      category,
      excerpt: extractExcerpt(cleaned),
      readTime: estimateReadTime(raw),
      tags: [category],
      image: coverImages[index % coverImages.length],
      raw,
      content: cleaned,
      body: extractBody(cleaned),
    }
  })
  .sort((a, b) => a.title.localeCompare(b.title))

// Unique category list for the filter dropdown.
export const categories = Array.from(
  new Set(posts.map((p) => p.category))
).sort()

export function getPost(id) {
  return posts.find((p) => p.id === id) || null
}
