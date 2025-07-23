import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useAdminStore = defineStore('admin', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const dashboardStats = ref({})
  const users = ref([])
  const prompts = ref([])
  const categories = ref([])
  const logs = ref([])
  const announcements = ref([])
  const settings = ref({})

  // Computed
  const isAuthenticated = computed(() => !!user.value)
  const currentUser = computed(() => user.value)

  // Actions
  async function login(credentials) {
    loading.value = true
    error.value = null
    try {
      const response = await api.login(credentials)
      const { token, user: userData } = response.data

      localStorage.setItem('admin_token', token)
      localStorage.setItem('admin_user', JSON.stringify(userData))
      user.value = userData

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || '登录失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await api.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      user.value = null
    }
  }

  async function fetchDashboardStats() {
    loading.value = true
    try {
      const response = await api.getDashboardStats()
      dashboardStats.value = response.data
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchUsers(params = {}) {
    loading.value = true
    try {
      const response = await api.getUsers(params)
      users.value = response.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function createUser(userData) {
    try {
      const response = await api.createUser(userData)
      users.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function updateUser(id, userData) {
    try {
      const response = await api.updateUser(id, userData)
      const index = users.value.findIndex(u => u.id === id)
      if (index !== -1) {
        users.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function deleteUser(id) {
    try {
      await api.deleteUser(id)
      const index = users.value.findIndex(u => u.id === id)
      if (index !== -1) {
        users.value.splice(index, 1)
      }
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function fetchPrompts(params = {}) {
    loading.value = true
    try {
      const response = await api.getPrompts(params)
      prompts.value = response.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function createPrompt(promptData) {
    try {
      const response = await api.createPrompt(promptData)
      prompts.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function updatePrompt(id, promptData) {
    try {
      const response = await api.updatePrompt(id, promptData)
      const index = prompts.value.findIndex(p => p.id === id)
      if (index !== -1) {
        prompts.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function deletePrompt(id) {
    try {
      await api.deletePrompt(id)
      const index = prompts.value.findIndex(p => p.id === id)
      if (index !== -1) {
        prompts.value.splice(index, 1)
      }
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function batchDeletePrompts(ids) {
    try {
      await api.batchDeletePrompts(ids)
      prompts.value = prompts.value.filter(p => !ids.includes(p.id))
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function fetchCategories() {
    try {
      const response = await api.getCategories()
      categories.value = response.data
    } catch (err) {
      error.value = err.message
    }
  }

  async function createCategory(categoryData) {
    try {
      const response = await api.createCategory(categoryData)
      categories.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function updateCategory(id, categoryData) {
    try {
      const response = await api.updateCategory(id, categoryData)
      const index = categories.value.findIndex(c => c.id === id)
      if (index !== -1) {
        categories.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function deleteCategory(id) {
    try {
      await api.deleteCategory(id)
      const index = categories.value.findIndex(c => c.id === id)
      if (index !== -1) {
        categories.value.splice(index, 1)
      }
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function fetchLogs(params = {}) {
    loading.value = true
    try {
      const response = await api.getLogs(params)
      logs.value = response.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function fetchSettings() {
    try {
      const response = await api.getSettings()
      settings.value = response.data
    } catch (err) {
      error.value = err.message
    }
  }

  async function updateSettings(settingsData) {
    try {
      const response = await api.updateSettings(settingsData)
      settings.value = response.data
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  // 公告管理
  async function fetchAnnouncements() {
    loading.value = true
    try {
      const response = await api.getAnnouncements()
      announcements.value = response.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function createAnnouncement(announcementData) {
    try {
      const response = await api.createAnnouncement(announcementData)
      announcements.value.unshift(response.data)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function updateAnnouncement(id, announcementData) {
    try {
      const response = await api.updateAnnouncement(id, announcementData)
      const index = announcements.value.findIndex(a => a.id === id)
      if (index !== -1) {
        announcements.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function deleteAnnouncement(id) {
    try {
      await api.deleteAnnouncement(id)
      const index = announcements.value.findIndex(a => a.id === id)
      if (index !== -1) {
        announcements.value.splice(index, 1)
      }
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function batchDeleteAnnouncements(ids) {
    try {
      await api.batchDeleteAnnouncements(ids)
      announcements.value = announcements.value.filter(a => !ids.includes(a.id))
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    user,
    loading,
    error,
    dashboardStats,
    users,
    prompts,
    categories,
    logs,
    announcements,
    settings,

    // Computed
    isAuthenticated,
    currentUser,

    // Actions
    login,
    logout,
    fetchDashboardStats,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    fetchPrompts,
    createPrompt,
    updatePrompt,
    deletePrompt,
    batchDeletePrompts,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    fetchLogs,
    fetchSettings,
    updateSettings,
    fetchAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    batchDeleteAnnouncements,
    clearError
  }
})
