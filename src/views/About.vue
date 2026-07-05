<template>
  <div class="bg-gray-900 text-white min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      <!-- Header -->
      <header class="text-center mb-16">
        <h1 class="text-5xl font-extrabold tracking-tight mb-3">Keith Thomson</h1>
        <p class="text-2xl text-purple-400 font-light">Programmer - Cloud-Native Development</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-10">
        
        <!-- Main Content -->
        <main class="lg:col-span-2">
          
          <!-- Background Section -->
          <section id="background" class="mb-12">
            <div class="bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-8">
              <img src="https://www.gravatar.com/avatar/986b3f67e5f2c3d2478a02a860d942f5?s=200&d=mp" alt="Keith Thomson" class="w-40 h-40 rounded-full object-cover border-4 border-purple-500 shadow-md">
              <div>
                <h2 class="text-3xl font-bold mb-4 flex items-center">
                  <UserIcon class="w-8 h-8 mr-3 text-purple-400" />
                  Background
                </h2>
                <div class="text-gray-300 space-y-4 leading-relaxed">
                  <p>
                    I was born and raised in Groton, Connecticut. I joined the US Army after highschool. After my service, I worked as a contractor for the US Navy in a finance role. I pursued higher education with the help of the G.I. Bill, earning degrees in Computer Science and Cloud Computing.
                  </p>
                  <p>
                    Outside of programming, I enjoy hiking, snowboarding, and spending time with my family. I'm always looking for ways to challenge myself and grow both personally and professionally.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <!-- Experience Section -->
          <section id="experience">
            <h2 class="text-3xl font-bold mb-6 flex items-center">
              <BriefcaseIcon class="w-8 h-8 mr-3 text-purple-400" />
              Professional Experience
            </h2>
            <div class="space-y-8 relative border-l-2 border-gray-700 ml-4">
              <div v-for="(job, index) in experience" :key="job.id" class="pl-8">
                <div class="absolute -left-[11px] top-1 w-5 h-5 bg-purple-500 rounded-full border-4 border-gray-800"></div>
                <p class="text-sm text-purple-400 font-medium">{{ job.period }}</p>
                <h3 class="text-xl font-semibold text-white mt-1">{{ job.title }}</h3>
                <p class="text-md text-gray-400 mb-2">{{ job.company }}</p>
                <p class="text-gray-300 leading-relaxed">
                  {{ job.description }}
                </p>
              </div>
            </div>
          </section>

        </main>

        <!-- Sidebar -->
        <aside class="space-y-10">
          
          <!-- Skills Section -->
          <section id="skills" class="bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 class="text-2xl font-bold mb-6 flex items-center">
              <WrenchScrewdriverIcon class="w-7 h-7 mr-3 text-purple-400" />
              Core Competencies
            </h2>
            <div class="space-y-6">
              <div v-for="category in skillCategories" :key="category.name">
                <h3 class="text-lg font-semibold text-white mb-3">{{ category.name }}</h3>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="skill in category.skills" 
                    :key="skill"
                    class="bg-purple-600/30 text-purple-200 text-sm font-medium px-3 py-1 rounded-full hover:bg-purple-500/50 transition-colors cursor-default"
                  >
                    {{ skill }}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <!-- Contact Section -->
          <section id="contact" class="bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 class="text-2xl font-bold mb-6 flex items-center">
              <EnvelopeIcon class="w-7 h-7 mr-3 text-purple-400" />
              Get in Touch
            </h2>
            <div class="space-y-4">
              <a 
                v-for="contact in contacts" 
                :key="contact.label"
                :href="contact.href" 
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-all group"
              >
                <component :is="contact.icon" class="w-6 h-6 mr-4 text-purple-400 group-hover:scale-110 transition-transform" />
                <span class="text-gray-300 group-hover:text-white">{{ contact.label }}</span>
              </a>
            </div>
          </section>

        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  UserIcon, 
  BriefcaseIcon, 
  WrenchScrewdriverIcon, 
  EnvelopeIcon,
  AtSymbolIcon,
  DevicePhoneMobileIcon
} from '@heroicons/vue/24/solid'

const experience = [
  {
    id: 1,
    title: 'Cloud Developer/Practitioner',
    company: 'WhaleLogic - Cloud Development and Administration Start-up (Gales Ferry, CT)',
    period: '2025 – Present',
    description: 'A self-started initiative to develop and maintain internal web applications and data systems that support small business operations. Examples include a Conent Management System (CMS) system, websocket-based secure communcation solutions, and automation-based tools hosted on cloud infrastructure.'
  },
  {
    id: 2,
    title: 'Product QA & Web Master',
    company: 'PennyBorne Development (PT Remote – Detroit, MI)',
    period: '2023 – Present',
    description: 'Oversee QA processes, manage and curate website content, source and structure business data, administer internal databases, and coordinate directly with clients and executives to align digital strategy with operational goals.'
  },
  {
    id: 3,
    title: 'Professional Break (Full-Time Student)',
    company: 'CT State College and Southern CT State University',
    period: '2021 – Present',
    description: 'Pursuing dual degrees in Computer Science (B.S.) and Cloud Computing (A.S.) while actively engaging in personal development projects related to software engineering, cloud architecture, and AI/ML technologies.'
  },
  {
    id: 4,
    title: 'Assistant Manager',
    company: 'The Spice & Tea Exchange – Mystic, CT',
    period: '2017 – 2021',
    description: 'Managed daily retail operations, optimized inventory control, and led a sales team to increase store revenue by over 25%. Developed customer loyalty initiatives and trained staff in product knowledge and service excellence.'
  },
  {
    id: 5,
    title: 'Financial Accounting Clerk',
    company: 'The Magetti Group / Various Federal Contracts',
    period: '2012 – 2016',
    description: 'Provided data analytics and financial systems support for U.S. Navy contracts. Delivered operational insights and managed backend data systems for logistics and accounting functions.'
  },
  {
    id: 6,
    title: 'Infantry Squad Leader (NCO)',
    company: 'U.S. Army – Active Duty',
    period: '2007 – 2011',
    description: 'Led combat infantry operations, coordinated mission-critical logistics, and managed team training and field execution under high-stakes conditions.'
  }
].sort((a, b) => b.id - a.id);


const skillCategories = [
  {
    name: 'Languages',
    skills: ['Go', 'Bash', 'Python', 'Rust', 'JS/TS', 'C++', 'SQL' ]
  },
  {
    name: 'Backend',
    skills: ['TCP/IP', 'gRPC', 'RESTful', 'HTTP/2', 'WebSockets', 'GraphQL', 'Microservices', 'JSON Web Tokens', 'Authentication']
  },
  {
    name: 'Databases',
    skills: ['PostgreSQL', 'Redis', 'MongoDB', 'Weaviate', 'SQLite', 'Elasticsearch', 'Couchbase']
  },
  {
    name: 'Cloud & DevOps',
    skills: ['Docker', 'Kubernetes', 'Networking', 'AWS', 'Google Cloud', 'Azure', 'IAM/Auth', 'Terraform', 'Ansible']
  },
  {
    name: 'AI/ML',
    skills: ['Genkit SDK', 'HuggingFace', 'PyTorch', 'TensorFlow', 'Langchain', 'RAG', 'Vector Databases', 'Embedding Models', 'Inferencing', 'Data Labeling']
  }
]

const contacts = [
  {
    label: 'thomsonk2@southernct.edu',
    href: 'mailto:thomsonk2@southernct.edu',
    icon: AtSymbolIcon
  },
  {
    label: 'thomsonk930@gmail.com',
    href: 'mailto:thomsonk930@gmail.com',
    icon: AtSymbolIcon
  },
  {
    label: '+1 (860) 405-7837',
    href: 'tel:+18604057837',
    icon: DevicePhoneMobileIcon
  }
]
</script>

<style scoped>
/* Scoped styles for custom timeline effect */
.relative.border-l-2::before {
  content: '';
  position: absolute;
  left: -2px;
  top: 0;
  height: 100%;
  width: 2px;
}
</style>
