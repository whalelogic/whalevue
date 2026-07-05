<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black">
    <!-- Error State -->
    <div v-if="!post" class="text-center py-20 px-4">
      <div class="max-w-md mx-auto">
        <p class="text-red-400 text-xl mb-6">That page doesn't exist</p>
        <router-link
          to="/blog"
          class="inline-flex items-center text-purple-400 hover:text-purple-300 text-lg transition-colors"
        >
          <ArrowLeftIcon class="w-5 h-5 mr-2" />
          Back to Blog
        </router-link>
      </div>
    </div>

    <!-- Article Content -->
    <article v-else>
      <!-- Hero Section -->
      <div class="relative bg-gradient-to-br from-purple-900/40 via-pink-900/40 to-blue-900/40 border-b border-gray-800">
        <div class="max-w-5xl mx-auto px-4 py-12">
          <router-link
            to="/blog"
            class="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8 transition-colors group"
          >
            <ArrowLeftIcon class="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span class="text-base">Back to Blog</span>
          </router-link>

          <header class="max-w-4xl">
            <h1 class="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              {{ post.title }}
            </h1>

            <!-- Meta Info -->
            <div class="flex items-center flex-wrap gap-6 text-sm text-gray-300 mb-6">
              <span
                class="flex items-center gap-2 px-4 py-2 rounded-full font-semibold"
                :class="typeBadgeClass(post.type)"
              >
                {{ post.type }}
              </span>
              <span class="flex items-center gap-2 bg-gray-800/60 px-4 py-2 rounded-full capitalize">
                <FolderIcon class="w-4 h-4" />
                {{ post.category }}
              </span>
              <span class="flex items-center gap-2 bg-gray-800/60 px-4 py-2 rounded-full">
                <ClockIcon class="w-4 h-4" />
                {{ post.readTime }} min read
              </span>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in post.tags"
                :key="tag"
                class="text-xs font-medium bg-purple-600/30 text-purple-200 px-4 py-1.5 rounded-full border border-purple-500/30 hover:bg-purple-600/40 transition-colors"
              >
                {{ tag }}
              </span>
            </div>
          </header>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="max-w-4xl mx-auto px-4 py-12">
        <div class="bg-gray-800/30 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/30 overflow-hidden">
          <div class="p-8 md:p-12">
            <div class="article-content" v-html="renderedContent" ref="articleRef"></div>
          </div>

          <footer class="px-8 md:px-12 py-8 bg-gray-900/30 border-t border-gray-700/30">
            <div class="flex items-center justify-between flex-wrap gap-4">
              <div class="text-sm text-gray-400">
                <span class="inline-block mr-2">📁</span>
                <span>Category:</span>
                <span class="text-purple-400 font-medium ml-2 capitalize">{{ post.category }}</span>
              </div>
              <div class="text-sm text-gray-500">
                Source: markdown/{{ post.id }}.md
              </div>
            </div>
          </footer>
        </div>

        <div class="text-center mt-12">
          <router-link
            to="/blog"
            class="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-purple-500/50"
          >
            <ArrowLeftIcon class="w-5 h-5" />
            Browse All
          </router-link>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeftIcon, FolderIcon, ClockIcon } from '@heroicons/vue/24/outline'
import { getPost, renderMarkdown, typeBadgeClass } from '@/markdown.js'

const route = useRoute()

const post = computed(() => getPost(route.params.id))

const renderedContent = computed(() =>
  post.value ? renderMarkdown(post.value.body) : ''
)

// Render any ```mermaid diagrams in the article. Mermaid is loaded lazily so it
// only ships to visitors who open a post that actually contains a diagram.
const articleRef = ref(null)
let mermaidReady = false

async function renderDiagrams() {
  await nextTick()
  const el = articleRef.value
  if (!el) return
  const nodes = el.querySelectorAll('.mermaid:not([data-processed])')
  if (!nodes.length) return
  try {
    const mermaid = (await import('mermaid')).default
    if (!mermaidReady) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'loose',
        fontFamily: 'JetBrains Mono, monospace',
      })
      mermaidReady = true
    }
    await mermaid.run({ nodes })
  } catch (err) {
    console.error('Mermaid render error:', err)
  }
}

onMounted(renderDiagrams)
// Re-run when navigating between posts (the component is reused).
watch(() => route.params.id, renderDiagrams)
</script>

<style scoped>
/* Article Content Styling - Enhanced Typography */
.article-content {
  color: #e5e7eb;
  font-size: 1.125rem;
  line-height: 1.8;
}

/* Headings */
.article-content :deep(h1) {
  color: #ffffff;
  font-size: 2.5rem;
  font-weight: 800;
  margin-top: 3rem;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #a78bfa 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.article-content :deep(h1:first-child) {
  margin-top: 0;
}

.article-content :deep(h2) {
  color: #ffffff;
  font-size: 2rem;
  font-weight: 700;
  margin-top: 2.5rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #4b5563;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.article-content :deep(h3) {
  color: #f3f4f6;
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.article-content :deep(h4) {
  color: #f3f4f6;
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.75rem;
  margin-bottom: 0.875rem;
  line-height: 1.4;
}

.article-content :deep(h5) {
  color: #f3f4f6;
  font-size: 1.125rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.article-content :deep(h6) {
  color: #d1d5db;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

/* Paragraphs */
.article-content :deep(p) {
  margin-bottom: 1.5rem;
  line-height: 1.8;
  color: #d1d5db;
}

/* Links */
.article-content :deep(a) {
  color: #a78bfa;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid #a78bfa;
  transition: all 0.2s ease;
}

.article-content :deep(a:hover) {
  color: #c4b5fd;
  border-bottom-color: #c4b5fd;
  background-color: #a78bfa10;
}

/* Inline Code — sized to sit inline with prose. JetBrains Mono reads visually
   larger than Inter, so keep it below 1em and use light padding so dense lists
   don't turn into rows of chunky pills. */
.article-content :deep(code) {
  background: #1f2937;
  color: #f472b6;
  padding: 0.1em 0.35em;
  border-radius: 0.3rem;
  font-size: 0.82em;
  font-family: 'JetBrains Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  border: 1px solid #374151;
  font-weight: 500;
}

/* Inline code inside a gradient-clipped heading inherits a transparent text
   fill, which makes it invisible. Force it to paint its own pink color. */
.article-content :deep(h1) code,
.article-content :deep(h2) code,
.article-content :deep(h3) code,
.article-content :deep(h4) code,
.article-content :deep(h5) code,
.article-content :deep(h6) code {
  -webkit-text-fill-color: #f472b6;
}

/* Code Blocks */
.article-content :deep(pre) {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border: 1px solid #334155;
  border-radius: 0.75rem;
  padding: 1.5rem;
  overflow-x: auto;
  margin: 2rem 0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
}

.article-content :deep(pre code) {
  background: transparent;
  color: #e2e8f0;
  padding: 0;
  border: none;
  font-size: 0.95rem;
  line-height: 1.6;
  display: block;
  font-family: 'JetBrains Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

/* highlight.js: let its token colors show, but keep our code-block background */
.article-content :deep(pre code.hljs) {
  background: transparent;
  padding: 0;
}

/* Mermaid diagrams: centered, with the raw definition hidden until rendered
   into an <svg> (mermaid marks the node data-processed once done). */
.article-content :deep(.mermaid) {
  margin: 2rem 0;
  text-align: center;
  overflow-x: auto;
}

.article-content :deep(.mermaid:not([data-processed])) {
  visibility: hidden;
  height: 0;
  overflow: hidden;
}

.article-content :deep(.mermaid svg) {
  max-width: 100%;
  height: auto;
}

/* Scrollbar for code blocks */
.article-content :deep(pre::-webkit-scrollbar) {
  height: 8px;
}

.article-content :deep(pre::-webkit-scrollbar-track) {
  background: #1e293b;
  border-radius: 4px;
}

.article-content :deep(pre::-webkit-scrollbar-thumb) {
  background: #475569;
  border-radius: 4px;
}

.article-content :deep(pre::-webkit-scrollbar-thumb:hover) {
  background: #64748b;
}

/* Lists — standard markers so inline text and code flow (and wrap) naturally.
   (A previous flex-based bullet turned every inline <code>/<strong> into its
   own flex item, scattering sentences into disconnected chunks.) */
.article-content :deep(ul),
.article-content :deep(ol) {
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
  color: #d1d5db;
}

.article-content :deep(ul) {
  list-style-type: disc;
}

.article-content :deep(ol) {
  list-style-type: decimal;
}

.article-content :deep(li) {
  margin-bottom: 0.5rem;
  padding-left: 0.25rem;
  line-height: 1.8;
}

.article-content :deep(li::marker) {
  color: #a78bfa;
}

/* Nested lists */
.article-content :deep(li > ul),
.article-content :deep(li > ol) {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

/* Blockquotes */
.article-content :deep(blockquote) {
  border-left: 4px solid #a78bfa;
  background: linear-gradient(90deg, #a78bfa15 0%, transparent 100%);
  padding: 1rem 1.5rem;
  margin: 2rem 0;
  border-radius: 0 0.5rem 0.5rem 0;
  color: #d1d5db;
  font-style: italic;
  position: relative;
}

.article-content :deep(blockquote p) {
  margin-bottom: 0.5rem;
}

.article-content :deep(blockquote p:last-child) {
  margin-bottom: 0;
}

/* Tables */
.article-content :deep(table) {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 2rem 0;
  font-size: 0.95rem;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.article-content :deep(thead) {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
}

.article-content :deep(th) {
  color: #ffffff;
  font-weight: 600;
  padding: 1rem;
  text-align: left;
  border-bottom: 2px solid #374151;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.article-content :deep(td) {
  padding: 1rem;
  border-bottom: 1px solid #374151;
  color: #d1d5db;
}

.article-content :deep(tbody tr) {
  background-color: #1f2937;
  transition: background-color 0.2s ease;
}

.article-content :deep(tbody tr:hover) {
  background-color: #374151;
}

.article-content :deep(tbody tr:nth-child(even)) {
  background-color: #111827;
}

.article-content :deep(tbody tr:nth-child(even):hover) {
  background-color: #374151;
}

/* Images */
.article-content :deep(img) {
  border-radius: 0.75rem;
  margin: 2rem auto;
  max-width: 100%;
  height: auto;
  display: block;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  border: 1px solid #374151;
}

/* Horizontal Rules */
.article-content :deep(hr) {
  border: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #4b5563, transparent);
  margin: 3rem 0;
}

/* Strong and Emphasis */
.article-content :deep(strong) {
  color: #ffffff;
  font-weight: 700;
}

.article-content :deep(em) {
  font-style: italic;
  color: #e5e7eb;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .article-content {
    font-size: 1rem;
  }

  .article-content :deep(h1) {
    font-size: 2rem;
  }

  .article-content :deep(h2) {
    font-size: 1.75rem;
  }

  .article-content :deep(h3) {
    font-size: 1.375rem;
  }

  .article-content :deep(pre) {
    padding: 1rem;
    font-size: 0.85rem;
  }

  .article-content :deep(table) {
    font-size: 0.875rem;
  }

  .article-content :deep(th),
  .article-content :deep(td) {
    padding: 0.75rem;
  }
}
</style>
