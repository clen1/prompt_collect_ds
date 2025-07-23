<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-admin-900">分类管理</h2>
        <p class="mt-1 text-sm text-admin-600">管理提示词分类和标签</p>
      </div>
      <div class="flex items-center space-x-3">
        <button
          @click="exportCategories"
          class="btn btn-secondary flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>导出分类</span>
        </button>
        <button
          @click="showCreateModal = true"
          class="btn btn-primary flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>添加分类</span>
        </button>
      </div>
    </div>

    <!-- 分类统计 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-admin-500 truncate">总分类数</dt>
              <dd class="text-lg font-medium text-admin-900">{{ categories.length }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-admin-500 truncate">已分类提示词</dt>
              <dd class="text-lg font-medium text-admin-900">{{ categorizedPromptsCount }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-admin-500 truncate">未分类提示词</dt>
              <dd class="text-lg font-medium text-admin-900">{{ uncategorizedPromptsCount }}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- 分类列表 -->
    <div class="card">
      <div class="mb-4">
        <h3 class="text-lg font-medium text-admin-900">分类列表</h3>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p class="mt-2 text-admin-500">加载中...</p>
      </div>

      <div v-else-if="categories.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-admin-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-admin-900">暂无分类</h3>
        <p class="mt-1 text-sm text-admin-500">创建您的第一个分类来组织提示词</p>
        <div class="mt-6">
          <button @click="showCreateModal = true" class="btn btn-primary">
            添加分类
          </button>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="category in categories"
          :key="category.id"
          class="border border-admin-200 rounded-lg p-6 hover:shadow-md transition-all duration-200 hover:border-primary-300 relative overflow-hidden"
        >
          <!-- 分类颜色条 -->
          <div
            class="absolute top-0 left-0 w-full h-1"
            :style="{ backgroundColor: category.color }"
          ></div>
          <!-- 分类头部 -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div
                class="w-4 h-4 rounded-full"
                :style="{ backgroundColor: category.color }"
              ></div>
              <h3 class="text-lg font-semibold text-admin-900">{{ category.name }}</h3>
            </div>

            <div class="flex items-center space-x-2">
              <button
                @click="editCategory(category)"
                class="text-primary-600 hover:text-primary-700"
                title="编辑"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click="deleteCategory(category)"
                class="text-red-600 hover:text-red-700"
                title="删除"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <!-- 分类统计 -->
          <div class="text-sm text-admin-600 mb-4 space-y-1">
            <p>{{ getCategoryPromptCount(category.id) }} 个提示词</p>
            <p>总使用次数: {{ getCategoryUsageCount(category.id) }}</p>
            <p>最近更新: {{ getLastUpdated(category.id) }}</p>
          </div>

          <!-- 分类预览和操作 -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                :style="{ backgroundColor: category.color }"
              >
                {{ category.name }}
              </span>
              <div class="flex items-center space-x-1">
                <button
                  @click="viewCategoryPrompts(category)"
                  class="text-xs text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-2 py-1 rounded transition-colors"
                  :disabled="getCategoryPromptCount(category.id) === 0"
                  :class="{ 'opacity-50 cursor-not-allowed': getCategoryPromptCount(category.id) === 0 }"
                  title="在弹窗中查看"
                >
                  查看
                </button>
                <button
                  @click="manageCategoryPrompts(category)"
                  class="text-xs text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-2 py-1 rounded transition-colors"
                  title="跳转到提示词管理页面"
                >
                  管理
                </button>
              </div>
            </div>

            <!-- 快速统计 -->
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div class="bg-admin-50 rounded p-2 text-center">
                <div class="font-medium text-admin-900">{{ getCategoryPromptCount(category.id) }}</div>
                <div class="text-admin-500">提示词</div>
              </div>
              <div class="bg-admin-50 rounded p-2 text-center">
                <div class="font-medium text-admin-900">{{ getCategoryUsageCount(category.id) }}</div>
                <div class="text-admin-500">使用次数</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建/编辑分类模态框 -->
    <CategoryModal
      v-if="showCreateModal || showEditModal"
      :category="editingCategory"
      @save="saveCategory"
      @close="closeModal"
    />

    <!-- 分类提示词查看模态框 -->
    <CategoryPromptsModal
      v-if="showCategoryPromptsModal"
      :category="selectedCategory"
      :prompts="categoryPrompts"
      @close="closeCategoryPromptsModal"
      @edit-prompt="editPromptFromCategory"
      @delete-prompt="deletePromptFromCategory"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '../stores/admin'
import CategoryModal from '../components/CategoryModal.vue'
import CategoryPromptsModal from '../components/CategoryPromptsModal.vue'

const store = useAdminStore()
const router = useRouter()

// 响应式数据
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingCategory = ref(null)
const showCategoryPromptsModal = ref(false)
const selectedCategory = ref(null)
const categoryPrompts = ref([])

// 计算属性
const loading = computed(() => store.loading)
const categories = computed(() => store.categories)
const prompts = computed(() => store.prompts)

const categorizedPromptsCount = computed(() => {
  return prompts.value.filter(prompt => prompt.categoryId).length
})

const uncategorizedPromptsCount = computed(() => {
  return prompts.value.filter(prompt => !prompt.categoryId).length
})

// 方法
function getCategoryPromptCount(categoryId) {
  return prompts.value.filter(prompt => prompt.categoryId === categoryId).length
}

function getCategoryUsageCount(categoryId) {
  return prompts.value
    .filter(prompt => prompt.categoryId === categoryId)
    .reduce((sum, prompt) => sum + (prompt.usageCount || 0), 0)
}

function getLastUpdated(categoryId) {
  const categoryPrompts = prompts.value.filter(prompt => prompt.categoryId === categoryId)
  if (categoryPrompts.length === 0) return '无'

  const lastUpdated = categoryPrompts.reduce((latest, prompt) => {
    const promptDate = new Date(prompt.updatedAt || prompt.createdAt)
    return promptDate > latest ? promptDate : latest
  }, new Date(0))

  const now = new Date()
  const diffTime = Math.abs(now - lastUpdated)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) {
    return '今天'
  } else if (diffDays <= 7) {
    return `${diffDays}天前`
  } else {
    return lastUpdated.toLocaleDateString('zh-CN')
  }
}

function editCategory(category) {
  editingCategory.value = { ...category }
  showEditModal.value = true
}

async function deleteCategory(category) {
  const promptCount = getCategoryPromptCount(category.id)

  let confirmMessage = `确定要删除分类"${category.name}"吗？`
  if (promptCount > 0) {
    confirmMessage += `\n\n注意：该分类下有 ${promptCount} 个提示词，删除后这些提示词将变为未分类状态。`
  }

  if (confirm(confirmMessage)) {
    try {
      await store.deleteCategory(category.id)
      // 重新获取提示词以更新分类信息
      await store.fetchPrompts()
    } catch (error) {
      console.error('删除失败:', error)
    }
  }
}

async function saveCategory(categoryData) {
  try {
    if (editingCategory.value) {
      await store.updateCategory(editingCategory.value.id, categoryData)
    } else {
      await store.createCategory(categoryData)
    }
    closeModal()
  } catch (error) {
    console.error('保存失败:', error)
  }
}

function closeModal() {
  showCreateModal.value = false
  showEditModal.value = false
  editingCategory.value = null
}

function viewCategoryPrompts(category) {
  selectedCategory.value = category
  categoryPrompts.value = prompts.value.filter(prompt => prompt.categoryId === category.id)
  showCategoryPromptsModal.value = true
}

function manageCategoryPrompts(category) {
  // 跳转到提示词管理页面，并筛选该分类
  router.push({
    name: 'Prompts',
    query: { category: category.id }
  })
}

function closeCategoryPromptsModal() {
  showCategoryPromptsModal.value = false
  selectedCategory.value = null
  categoryPrompts.value = []
}

async function editPromptFromCategory(prompt) {
  // 跳转到提示词管理页面并高亮该提示词
  await router.push({
    name: 'Prompts',
    query: {
      category: prompt.categoryId,
      highlight: prompt.id
    }
  })
}

async function deletePromptFromCategory(prompt) {
  if (confirm(`确定要删除提示词"${prompt.title}"吗？`)) {
    try {
      await store.deletePrompt(prompt.id)
      // 更新分类提示词列表
      categoryPrompts.value = categoryPrompts.value.filter(p => p.id !== prompt.id)
    } catch (error) {
      console.error('删除失败:', error)
    }
  }
}

async function exportCategories() {
  try {
    // 构建导出数据
    const exportData = {
      categories: categories.value.map(category => ({
        ...category,
        promptCount: getCategoryPromptCount(category.id)
      })),
      statistics: {
        totalCategories: categories.value.length,
        categorizedPrompts: categorizedPromptsCount.value,
        uncategorizedPrompts: uncategorizedPromptsCount.value
      },
      exportDate: new Date().toISOString()
    }

    // 创建下载链接
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `categories_export_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error('导出失败:', error)
  }
}

// 生命周期
onMounted(async () => {
  await store.fetchCategories()
  await store.fetchPrompts()
})
</script>
