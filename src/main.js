import './style.css'
import 'highlight.js/styles/atom-one-dark.css'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import Projects from './views/Projects.vue'
import About from './views/About.vue'
import Blog from './views/Blog.vue'
import BlogPost from './views/BlogPost.vue'
import Contact from './views/Contact.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/projects', name: 'Projects', component: Projects },
  { path: '/about', name: 'About', component: About },
  { path: '/blog', name: 'Blog', component: Blog },
  // `:id(.*)` lets the slug contain slashes, e.g. /blog/go/variables
  { path: '/blog/:id(.*)', name: 'BlogPost', component: BlogPost },
  { path: '/contact', name: 'Contact', component: Contact },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

createApp(App).use(router).mount('#app')
