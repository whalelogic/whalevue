<template>
  <div class="min-h-screen bg-gray-900">
    <nav class="border-b border-gray-700">
      <div class="max-w-5xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold text-lg">
                🐳
              </div>
              <span class="text-white font-semibold">whalevue</span>
            </router-link>
          </div>

          <div class="flex items-center space-x-1">
            <router-link
              v-for="route in routes"
              :key="route.name"
              :to="route.path"
              :class="[
                'nav-link',
                $route.name === route.name ? 'nav-link-active' : 'nav-link-inactive'
              ]"
            >
              {{ route.name }}
            </router-link>
            <a
              href="https://github.com/whalelogic"
              target="_blank"
              rel="noopener noreferrer"
              class="ml-4 text-gray-400 hover:text-white transition-colors flex items-center"
              title="GitHub Profile"
            >
              <GitHubIcon />
            </a>
          </div>
        </div>
      </div>
    </nav>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import GitHubIcon from '@/components/icons/GitHubIcon.vue'
const routes = [
  { name: 'Home', path: '/' },
  { name: 'Blog', path: '/blog' },
  { name: 'Projects', path: '/projects' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
]
</script>
