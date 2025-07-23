import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import PromptDetail from '../views/PromptDetail.vue'
import Categories from '../views/Categories.vue'
import AIChat from '../views/AIChat.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/prompt/:id',
    name: 'PromptDetail',
    component: PromptDetail,
    props: true
  },
  {
    path: '/categories',
    name: 'Categories',
    component: Categories
  },
  {
    path: '/ai-chat',
    name: 'AIChat',
    component: AIChat
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
