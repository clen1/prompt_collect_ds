import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const usePromptsStore = defineStore('prompts', () => {
  const prompts = ref([])
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)
  const searchQuery = ref('')
  const selectedCategory = ref('')

  // Computed
  const filteredPrompts = computed(() => {
    let filtered = prompts.value

    if (selectedCategory.value) {
      filtered = filtered.filter(prompt => prompt.categoryId === selectedCategory.value)
    }

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(prompt =>
        prompt.title.toLowerCase().includes(query) ||
        prompt.content.toLowerCase().includes(query) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return filtered
  })

  const favoritePrompts = computed(() => {
    return prompts.value.filter(prompt => prompt.isFavorite)
  })

  const getCategoryById = computed(() => {
    return (id) => categories.value.find(cat => cat.id === id)
  })

  // Actions
  async function fetchPrompts() {
    loading.value = true
    error.value = null
    try {
      const response = await api.getPrompts()
      prompts.value = response.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
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

  async function toggleFavorite(id) {
    const prompt = prompts.value.find(p => p.id === id)
    if (prompt) {
      await updatePrompt(id, { isFavorite: !prompt.isFavorite })
    }
  }

  async function incrementUsage(id) {
    try {
      const response = await api.incrementUsage(id)
      const index = prompts.value.findIndex(p => p.id === id)
      if (index !== -1) {
        prompts.value[index] = response.data
      }
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

  function setSearchQuery(query) {
    searchQuery.value = query
  }

  function setSelectedCategory(categoryId) {
    selectedCategory.value = categoryId
  }

  function clearFilters() {
    searchQuery.value = ''
    selectedCategory.value = ''
  }

  return {
    // State
    prompts,
    categories,
    loading,
    error,
    searchQuery,
    selectedCategory,
    
    // Computed
    filteredPrompts,
    favoritePrompts,
    getCategoryById,
    
    // Actions
    fetchPrompts,
    fetchCategories,
    createPrompt,
    updatePrompt,
    deletePrompt,
    toggleFavorite,
    incrementUsage,
    createCategory,
    updateCategory,
    deleteCategory,
    setSearchQuery,
    setSelectedCategory,
    clearFilters
  }
})
