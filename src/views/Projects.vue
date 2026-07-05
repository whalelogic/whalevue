<template>
  <div class="max-w-5xl mx-auto px-4 py-10">
    <div class="text-center mb-10">
      <h1 class="text-3xl font-bold text-white mb-4">Projects</h1>
      <p class="text-gray-400 max-w-2xl mx-auto">
        A collection of demonstrations and open-source projects showcasing various technologies and concepts.
        Explore the repositories to see code samples, implementations, and innovative solutions. 
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      <p class="text-gray-400 mt-4">Loading projects from GitHub...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-400">{{ error }}</p>
    </div>

    <!-- Projects Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <a 
        v-for="project in projects" 
        :key="project.id"
        :href="project.html_url"
        target="_blank"
        class="project-card block hover:bg-gray-800/50 p-6 rounded-lg transition-colors"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-3">
            <component :is="getIcon(project.language)" class="w-8 h-8 text-purple-400" />
            <h3 class="text-xl font-semibold text-white">{{ project.name }}</h3>
          </div>
          <div class="flex space-x-2">
            <a 
              :href="project.html_url" 
              target="_blank"
              class="text-gray-400 hover:text-white transition-colors"
              title="View on GitHub"
              @click.stop
            >
              <CodeBracketIcon class="w-5 h-5" />
            </a>
            <a 
              v-if="project.homepage"
              :href="project.homepage" 
              target="_blank"
              class="text-gray-400 hover:text-white transition-colors"
              title="View Demo"
              @click.stop
            >
              <ArrowTopRightOnSquareIcon class="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <p class="text-gray-400 mb-4">{{ project.description || 'No description available' }}</p>
        
        <div class="flex flex-wrap gap-2 mb-4">
          <span 
            v-if="project.language"
            class="text-xs bg-blue-700/20 text-blue-300 px-2 py-1 rounded-full"
          >
            {{ project.language }}
          </span>
          <span 
            v-for="topic in project.topics.slice(0, 4)" 
            :key="topic"
            class="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full"
          >
            {{ topic }}
          </span>
        </div>
        
        <div class="flex items-center justify-between text-sm text-gray-500">
          <div class="flex items-center space-x-4">
            <span class="flex items-center">
              ⭐ {{ project.stargazers_count }}
            </span>
            <span class="flex items-center">
              🔀 {{ project.forks_count }}
            </span>
          </div>
          <span>Updated {{ formatDate(project.updated_at) }}</span>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  CodeBracketIcon, 
  ArrowTopRightOnSquareIcon,
  CpuChipIcon,
  CloudIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  CubeIcon,
  ServerIcon,
  CommandLineIcon
} from '@heroicons/vue/24/outline'

const projects = ref([])
const loading = ref(true)
const error = ref(null)

const getIcon = (language) => {
  const iconMap = {
    'JavaScript': CpuChipIcon,
    'TypeScript': CpuChipIcon,
    'Python': CommandLineIcon,
    'Go': CloudIcon,
    'Rust': ShieldCheckIcon,
    'Java': ServerIcon,
    'C++': CubeIcon,
    'C#': ServerIcon,
  }
  return iconMap[language] || CodeBracketIcon
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

onMounted(async () => {
  try {
    const response = await fetch('https://api.github.com/users/whalelogic/repos?sort=updated&per_page=12')
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Filter out forks and sort by stars/recent activity
    projects.value = data
      .filter(repo => !repo.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
    
    loading.value = false
  } catch (err) {
    error.value = `Failed to load projects: ${err.message}`
    loading.value = false
    console.error('Error fetching GitHub repos:', err)
  }
})
</script>
