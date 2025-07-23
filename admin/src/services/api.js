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
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
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
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default {
  // 认证相关
  login(credentials) {
    return api.post('/admin/login', credentials)
  },

  logout() {
    return api.post('/admin/logout')
  },

  // 仪表板统计
  getDashboardStats() {
    return api.get('/admin/stats')
  },

  // 用户管理
  getUsers(params = {}) {
    return api.get('/admin/users', { params })
  },

  createUser(data) {
    return api.post('/admin/users', data)
  },

  updateUser(id, data) {
    return api.put(`/admin/users/${id}`, data)
  },

  deleteUser(id) {
    return api.delete(`/admin/users/${id}`)
  },

  changeUserPassword(id, newPassword) {
    return api.put(`/admin/users/${id}/password`, { newPassword })
  },

  // 提示词管理
  getPrompts(params = {}) {
    return api.get('/prompts', { params })
  },

  getPrompt(id) {
    return api.get(`/prompts/${id}`)
  },

  createPrompt(data) {
    return api.post('/prompts', data)
  },

  updatePrompt(id, data) {
    return api.put(`/prompts/${id}`, data)
  },

  deletePrompt(id) {
    return api.delete(`/prompts/${id}`)
  },

  batchDeletePrompts(ids) {
    return api.post('/admin/prompts/batch-delete', { ids })
  },

  // 分类管理
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

  // 系统设置
  getSettings() {
    return api.get('/admin/settings')
  },

  updateSettings(data) {
    return api.put('/admin/settings', data)
  },

  // 操作日志
  getLogs(params = {}) {
    return api.get('/admin/logs', { params })
  },

  // 数据导出
  exportData(type) {
    return api.get(`/admin/export/${type}`, { responseType: 'blob' })
  },

  // 公告管理
  getAnnouncements() {
    return api.get('/admin/announcements')
  },

  createAnnouncement(data) {
    return api.post('/admin/announcements', data)
  },

  updateAnnouncement(id, data) {
    return api.put(`/admin/announcements/${id}`, data)
  },

  deleteAnnouncement(id) {
    return api.delete(`/admin/announcements/${id}`)
  },

  batchDeleteAnnouncements(ids) {
    return api.post('/admin/announcements/batch-delete', { ids })
  },

  // 仪表盘统计
  getDashboardStats() {
    return api.get('/admin/dashboard/stats')
  },

  // 使用趋势数据
  getUsageTrends() {
    return api.get('/admin/dashboard/usage-trends')
  },

  // 分类分布数据
  getCategoryDistribution() {
    return api.get('/admin/dashboard/category-distribution')
  },

  // 系统设置
  getSettings() {
    return api.get('/admin/settings')
  },

  saveSettings(settings) {
    return api.put('/admin/settings', settings)
  },

  testAIConnection(settings) {
    return api.post('/admin/settings/test-ai', settings)
  }
}
