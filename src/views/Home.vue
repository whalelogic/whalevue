<template>
  <div class="max-w-5xl mx-auto px-4 py-10">
    <!-- Header -->
    <div class="text-center mb-10">
      <div class="flex items-center justify-center space-x-6 mb-6">
        <img
          src="/meandsophia.jpeg"
          class="w-24 h-24 rounded-full border-4 border-pink-600 object-cover"
          :style="{ transform: 'rotate(180deg)' }"
          alt="whalevue"
        />
        <div class="text-left">
          <h1 class="text-3xl font-bold text-white">whalevue</h1>
          <div class="flex items-center space-x-2 mt-1">
            <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span class="text-sm text-green-400 font-semibold">{{ posts.length }} entries</span>
          </div>
        </div>
      </div>

      <h2 class="text-xl font-semibold text-white mb-3">A Markdown-Powered Technical Library</h2>
      <p class="text-gray-400 max-w-2xl mx-auto mb-6">
        Guides, references, and cheat-sheets across languages and tools —
        written in Markdown and rendered right here. Browse by topic or search it all.
      </p>

      <div class="flex flex-wrap justify-center gap-2">
        <router-link
          v-for="category in categories"
          :key="category"
          :to="{ path: '/blog', query: { category } }"
          class="skill-tag"
        >
          {{ category }}
        </router-link>
      </div>
    </div>

    <!-- Featured entries -->
    <section>
      <h2 class="text-2xl font-bold mb-2">Featured</h2>
      <p class="text-gray-400 mb-6">
        A handful of guides and references to get you started. Head to the Blog to explore everything.
      </p>

      <div class="space-y-6">
        <div
          v-for="post in featured"
          :key="post.id"
          class="post-card cursor-pointer"
          @click="$router.push(`/blog/${post.slug}`)"
        >
          <div class="flex flex-col md:flex-row gap-6">
            <img
              :src="post.image"
              class="w-full md:w-60 h-48 md:h-36 rounded-lg object-cover"
              :alt="post.title"
            />
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span
                  class="text-xs font-semibold px-2 py-0.5 rounded-full"
                  :class="typeBadgeClass(post.type)"
                >
                  {{ post.type }}
                </span>
                <span class="text-sm text-purple-400 capitalize">{{ post.category }}</span>
              </div>
              <h3 class="text-white text-lg font-semibold mb-2">{{ post.title }}</h3>
              <p class="text-gray-400 mb-3">{{ post.excerpt }}</p>
              <div class="flex flex-wrap gap-2 mb-3">
                <span
                  v-for="tag in post.tags"
                  :key="tag"
                  class="text-xs bg-purple-700/20 text-purple-300 px-2 py-1 rounded-full"
                >
                  {{ tag }}
                </span>
                <span class="text-xs text-gray-500 px-2 py-1">{{ post.readTime }} min read</span>
              </div>
              <div class="inline-flex items-center text-purple-400 hover:text-purple-300 text-sm font-medium">
                Read more
                <ArrowRightIcon class="w-4 h-4 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ArrowRightIcon } from '@heroicons/vue/24/outline'
import { posts, categories, typeBadgeClass } from '@/markdown.js'

// Show one representative entry per category (up to 6) as the featured set.
const seen = new Set()
const featured = posts
  .filter((post) => {
    if (seen.has(post.category)) return false
    seen.add(post.category)
    return true
  })
  .slice(0, 6)
</script>
