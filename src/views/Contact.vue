<template>
  <div class="py-12 bg-gray-900 text-white min-h-screen">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <header class="text-center mb-12">
        <h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl">Get in Touch</h1>
        <p class="mt-4 text-xl text-gray-400">I'd love to hear from you!</p>
      </header>

      <div class="bg-gray-800 rounded-2xl shadow-lg">
        <div v-if="submitted" class="p-8 text-center">
          <h3 class="text-2xl font-bold text-green-400 mb-4">Thank you!</h3>
          <p class="text-gray-300">Your message has been sent successfully. I'll get back to you shortly.</p>
        </div>
        
        <form v-else @submit.prevent="handleSubmit" class="p-8 space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-300 mb-2">Full name</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input v-model="form.name" type="text" name="name" id="name" required
                class="block w-full bg-gray-700 border-gray-600 rounded-md pl-10 pr-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="John Doe">
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email address</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input v-model="form.email" type="email" name="email" id="email" required
                class="block w-full bg-gray-700 border-gray-600 rounded-md pl-10 pr-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="you@example.com">
            </div>
          </div>

          <div>
            <label for="message" class="block text-sm font-medium text-gray-300 mb-2">Message</label>
            <div class="relative">
              <textarea v-model="form.message" name="message" id="message" rows="4" required maxlength="500"
                class="block w-full bg-gray-700 border-gray-600 rounded-md pr-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Your message..."></textarea>
              <div class="absolute bottom-2 right-2 text-xs text-gray-400">
                {{ form.message.length }} / 500
              </div>
            </div>
          </div>

          <div class="pt-2">
            <button type="submit"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition-colors">
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { UserIcon, EnvelopeIcon } from '@heroicons/vue/24/outline'

const form = reactive({
  name: '',
  email: '',
  message: '',
})

const submitted = ref(false)
const maxMessageLength = 500

const handleSubmit = () => {
  // Here you would typically send the form data to a server
  console.log('Form submitted:', form)
  submitted.value = true
}
</script>


