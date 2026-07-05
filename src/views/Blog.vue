<template>
  <div class="max-w-4xl mx-auto px-4 py-10">
    <div class="text-center mb-10">
      <h1 class="text-3xl font-bold text-white mb-4">Guides &amp; References</h1>
      <p class="text-gray-400 max-w-2xl mx-auto">
        Technical guides and references across languages, tools, and systems.
        Filter by category or search across everything.
      </p>
    </div>

    <!-- Featured Post -->
    <div
      v-if="featuredPost"
      class="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg p-8 mb-12 cursor-pointer hover:from-purple-900/60 hover:to-pink-900/60 transition-all duration-200"
      @click="$router.push(`/blog/${featuredPost.slug}`)"
    >
      <div class="flex items-center space-x-2 mb-3">
        <StarIcon class="w-5 h-5 text-yellow-400" />
        <span class="text-yellow-400 text-sm font-medium">Featured {{ featuredPost.type }}</span>
      </div>
      <h2 class="text-2xl font-bold text-white mb-3">{{ featuredPost.title }}</h2>
      <p class="text-gray-300 mb-4">{{ featuredPost.excerpt }}</p>
      <div class="flex items-center justify-between">
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in featuredPost.tags"
            :key="tag"
            class="text-xs bg-white/10 text-white px-2 py-1 rounded-full"
          >
            {{ tag }}
          </span>
        </div>
        <span class="text-gray-400 text-sm">{{ featuredPost.readTime }} min read</span>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="flex flex-col sm:flex-row gap-4 mb-8">
      <div class="flex-1">
        <div class="relative">
          <MagnifyingGlassIcon class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search everything..."
            class="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>
      <select
        v-model="selectedCategory"
        class="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 capitalize"
      >
        <option value="">All Categories</option>
        <option v-for="category in categories" :key="category" :value="category" class="capitalize">
          {{ category }}
        </option>
      </select>
    </div>

    <!-- Result count -->
    <p class="text-gray-500 text-sm mb-6">
      Showing {{ filteredPosts.length }} of {{ posts.length }} entries
    </p>

    <!-- Blog Posts -->
    <div class="space-y-8">
      <article
        v-for="post in filteredPosts"
        :key="post.id"
        class="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors duration-200 cursor-pointer"
        @click="$router.push(`/blog/${post.slug}`)"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <div class="mb-2">
              <span
                class="text-xs font-semibold px-2 py-0.5 rounded-full"
                :class="typeBadgeClass(post.type)"
              >
                {{ post.type }}
              </span>
            </div>
            <h2 class="text-xl font-semibold text-white mb-2 hover:text-purple-400">
              {{ post.title }}
            </h2>
            <p class="text-gray-400 mb-3">{{ post.excerpt }}</p>
            <div class="flex items-center space-x-4 text-sm text-gray-500">
              <span class="flex items-center capitalize">
                <FolderIcon class="w-4 h-4 mr-1" />
                {{ post.category }}
              </span>
              <span class="flex items-center">
                <ClockIcon class="w-4 h-4 mr-1" />
                {{ post.readTime }} min read
              </span>
            </div>
          </div>
          <img
            :src="post.image"
            :alt="post.title"
            class="w-24 h-24 rounded-lg object-cover ml-6 hidden sm:block"
          />
        </div>

        <div class="flex items-center justify-between">
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in post.tags"
              :key="tag"
              class="text-xs bg-purple-700/20 text-purple-300 px-2 py-1 rounded-full"
            >
              {{ tag }}
            </span>
          </div>
          <button class="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center">
            Read more
            <ArrowRightIcon class="w-4 h-4 ml-1" />
          </button>
        </div>
      </article>
    </div>

    <!-- Empty State -->
    <div v-if="filteredPosts.length === 0" class="text-center py-16">
      <p class="text-gray-400 text-lg">Nothing matches your search.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  StarIcon,
  MagnifyingGlassIcon,
  FolderIcon,
  ClockIcon,
  ArrowRightIcon,
} from '@heroicons/vue/24/outline'
import { posts, categories, typeBadgeClass } from '@/markdown.js'

const route = useRoute()
const searchQuery = ref('')
// Honor a ?category= query (e.g. from the Home page category chips).
const selectedCategory = ref(route.query.category || '')

watch(
  () => route.query.category,
  (category) => {
    selectedCategory.value = category || ''
  }
)

// First post overall is the "featured" one (stable, alphabetical).
const featuredPost = computed(() => posts[0] || null)

const filteredPosts = computed(() => {
  let filtered = posts

  if (selectedCategory.value) {
    filtered = filtered.filter((post) => post.category === selectedCategory.value)
  }

  // Search spans title, excerpt, category, and tags — regardless of category.
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query))
    )
  }

  return filtered
})
</script>
