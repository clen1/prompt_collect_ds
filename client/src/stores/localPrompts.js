import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useLocalPromptsStore = defineStore('localPrompts', () => {
  // 状态
  const localPrompts = ref([])
  const templatePrompts = ref([]) // 后台模板提示词（只读）
  const categories = ref([])
  const searchQuery = ref('')
  const selectedCategory = ref('')
  const loading = ref(false)
  const error = ref(null)

  // 计算属性
  const filteredPrompts = computed(() => {
    let filtered = localPrompts.value

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(prompt =>
        prompt.title.toLowerCase().includes(query) ||
        prompt.content.toLowerCase().includes(query) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    if (selectedCategory.value) {
      if (selectedCategory.value === 'uncategorized') {
        filtered = filtered.filter(prompt => !prompt.categoryId)
      } else {
        filtered = filtered.filter(prompt => prompt.categoryId === selectedCategory.value)
      }
    }

    return filtered
  })

  const filteredTemplatePrompts = computed(() => {
    let filtered = templatePrompts.value

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(prompt =>
        prompt.title.toLowerCase().includes(query) ||
        prompt.content.toLowerCase().includes(query) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    if (selectedCategory.value) {
      if (selectedCategory.value === 'uncategorized') {
        filtered = filtered.filter(prompt => !prompt.categoryId)
      } else {
        filtered = filtered.filter(prompt => prompt.categoryId === selectedCategory.value)
      }
    }

    return filtered
  })

  // 本地存储操作
  function saveToLocalStorage() {
    try {
      localStorage.setItem('localPrompts', JSON.stringify(localPrompts.value))
    } catch (error) {
      console.error('保存到本地存储失败:', error)
    }
  }

  function loadFromLocalStorage() {
    try {
      const stored = localStorage.getItem('localPrompts')
      if (stored) {
        localPrompts.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('从本地存储加载失败:', error)
      localPrompts.value = []
    }
  }

  // 生成唯一ID
  function generateId() {
    return 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  // 本地提示词操作
  function createLocalPrompt(promptData) {
    const newPrompt = {
      id: generateId(),
      ...promptData,
      isLocal: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0
    }

    localPrompts.value.unshift(newPrompt)
    saveToLocalStorage()
    return newPrompt
  }

  function updateLocalPrompt(id, promptData) {
    const index = localPrompts.value.findIndex(p => p.id === id)
    if (index !== -1) {
      localPrompts.value[index] = {
        ...localPrompts.value[index],
        ...promptData,
        updatedAt: new Date().toISOString()
      }
      saveToLocalStorage()
      return localPrompts.value[index]
    }
    throw new Error('提示词不存在')
  }

  function deleteLocalPrompt(id) {
    const index = localPrompts.value.findIndex(p => p.id === id)
    if (index !== -1) {
      localPrompts.value.splice(index, 1)
      saveToLocalStorage()
      return true
    }
    return false
  }

  function toggleLocalFavorite(id) {
    const prompt = localPrompts.value.find(p => p.id === id)
    if (prompt) {
      prompt.isFavorite = !prompt.isFavorite
      prompt.updatedAt = new Date().toISOString()
      saveToLocalStorage()
      return prompt
    }
    throw new Error('提示词不存在')
  }

  function incrementLocalUsage(id) {
    const prompt = localPrompts.value.find(p => p.id === id)
    if (prompt) {
      prompt.usageCount = (prompt.usageCount || 0) + 1
      prompt.updatedAt = new Date().toISOString()
      saveToLocalStorage()
      return prompt
    }
    throw new Error('提示词不存在')
  }

  // 从模板复制到本地
  function copyTemplateToLocal(templatePrompt) {
    const localPrompt = {
      ...templatePrompt,
      id: generateId(),
      isLocal: true,
      sourceTemplateId: templatePrompt.id, // 记录来源模板ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0
    }

    localPrompts.value.unshift(localPrompt)
    saveToLocalStorage()
    return localPrompt
  }

  // 获取后台模板提示词
  async function fetchTemplatePrompts() {
    loading.value = true
    try {
      const response = await fetch('/api/prompts')
      if (response.ok) {
        const data = await response.json()
        templatePrompts.value = data.map(prompt => ({
          ...prompt,
          isTemplate: true
        }))
      } else {
        throw new Error('获取模板提示词失败')
      }
    } catch (err) {
      error.value = err.message
      console.error('获取模板提示词失败:', err)
    } finally {
      loading.value = false
    }
  }

  // 获取分类
  async function fetchCategories() {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        categories.value = await response.json()
      } else {
        throw new Error('获取分类失败')
      }
    } catch (err) {
      error.value = err.message
      console.error('获取分类失败:', err)
    }
  }

  // 导出本地数据
  function exportLocalData() {
    const exportData = {
      prompts: localPrompts.value,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `my_prompts_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  // 导入本地数据
  function importLocalData(jsonData) {
    try {
      const data = JSON.parse(jsonData)
      if (data.prompts && Array.isArray(data.prompts)) {
        // 为导入的提示词生成新的本地ID
        const importedPrompts = data.prompts.map(prompt => ({
          ...prompt,
          id: generateId(),
          isLocal: true,
          importedAt: new Date().toISOString()
        }))

        localPrompts.value.unshift(...importedPrompts)
        saveToLocalStorage()
        return importedPrompts.length
      } else {
        throw new Error('无效的数据格式')
      }
    } catch (error) {
      throw new Error('导入失败: ' + error.message)
    }
  }

  // 清空本地数据
  function clearLocalData() {
    localPrompts.value = []
    saveToLocalStorage()
  }

  // 搜索和筛选
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

  // 获取分类信息
  function getCategoryById(id) {
    return categories.value.find(category => category.id === id)
  }

  function clearError() {
    error.value = null
  }

  // 初始化
  function initialize() {
    loadFromLocalStorage()
    fetchCategories()
    fetchTemplatePrompts()
  }

  return {
    // 状态
    localPrompts,
    templatePrompts,
    categories,
    searchQuery,
    selectedCategory,
    loading,
    error,

    // 计算属性
    filteredPrompts,
    filteredTemplatePrompts,

    // 本地提示词操作
    createLocalPrompt,
    updateLocalPrompt,
    deleteLocalPrompt,
    toggleLocalFavorite,
    incrementLocalUsage,

    // 模板操作
    copyTemplateToLocal,
    fetchTemplatePrompts,

    // 数据管理
    exportLocalData,
    importLocalData,
    clearLocalData,

    // 分类操作
    fetchCategories,
    getCategoryById,

    // 搜索筛选
    setSearchQuery,
    setSelectedCategory,
    clearFilters,

    // 工具方法
    clearError,
    initialize
  }
})
