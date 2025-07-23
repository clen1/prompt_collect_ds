import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// 提示词相关API
export default {
  // 获取所有提示词
  getPrompts(params = {}) {
    return api.get('/prompts', { params })
  },

  // 获取单个提示词
  getPrompt(id) {
    return api.get(`/prompts/${id}`)
  },

  // 创建提示词
  createPrompt(data) {
    return api.post('/prompts', data)
  },

  // 更新提示词
  updatePrompt(id, data) {
    return api.put(`/prompts/${id}`, data)
  },

  // 删除提示词
  deletePrompt(id) {
    return api.delete(`/prompts/${id}`)
  },

  // 增加使用次数
  incrementUsage(id) {
    return api.post(`/prompts/${id}/use`)
  },

  // 分类相关API
  getCategories() {
    return api.get('/categories')
  },

  createCategory(data) {
    return api.post('/categories', data)
  },

  updateCategory(id, data) {
    return api.put(`/categories/${id}`, data)
  },

  deleteCategory(id) {
    return api.delete(`/categories/${id}`)
  },

  // 获取公告
  getAnnouncements() {
    return api.get('/announcements')
  },

  // AI对话
  chatWithAI(data) {
    return api.post('/ai/chat', data)
  }
}
