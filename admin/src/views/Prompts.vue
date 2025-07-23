<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-admin-900">提示词管理</h2>
        <p class="mt-1 text-sm text-admin-600">管理所有用户的提示词内容</p>
      </div>
      <div class="flex items-center space-x-3">
        <button
          @click="exportData"
          class="btn btn-secondary flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>导出数据</span>
        </button>
        <button
          @click="showCreateModal = true"
          class="btn btn-primary flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>添加提示词</span>
        </button>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="card">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-admin-700 mb-2">搜索提示词</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索标题、内容、标签..."
            class="input"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-admin-700 mb-2">分类筛选</label>
          <select v-model="categoryFilter" class="input">
            <option value="">所有分类</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-admin-700 mb-2">排序方式</label>
          <select v-model="sortBy" class="input">
            <option value="createdAt">创建时间</option>
            <option value="updatedAt">更新时间</option>
            <option value="usageCount">使用次数</option>
            <option value="title">标题</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 提示词列表 -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-admin-200">
          <thead class="bg-admin-50">
            <tr>
              <th class="w-12 px-4 py-3 text-left text-xs font-medium text-admin-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  v-model="selectAll"
                  @change="toggleSelectAll"
                  class="rounded border-admin-300 text-primary-600 focus:ring-primary-500"
                />
              </th>
              <th class="w-2/5 px-4 py-3 text-left text-xs font-medium text-admin-500 uppercase tracking-wider">
                提示词信息
              </th>
              <th class="w-32 px-4 py-3 text-left text-xs font-medium text-admin-500 uppercase tracking-wider">
                分类
              </th>
              <th class="w-20 px-4 py-3 text-left text-xs font-medium text-admin-500 uppercase tracking-wider">
                使用次数
              </th>
              <th class="w-36 px-4 py-3 text-left text-xs font-medium text-admin-500 uppercase tracking-wider">
                创建时间
              </th>
              <th class="w-32 px-4 py-3 text-left text-xs font-medium text-admin-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-admin-200">
            <tr v-if="loading" class="text-center">
              <td colspan="6" class="py-12">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <p class="mt-2 text-admin-500">加载中...</p>
              </td>
            </tr>
            <tr v-else-if="filteredPrompts.length === 0" class="text-center">
              <td colspan="6" class="py-12 text-admin-500">
                暂无提示词数据
              </td>
            </tr>
            <tr v-else v-for="prompt in filteredPrompts" :key="prompt.id" class="hover:bg-admin-50">
              <td class="px-4 py-4">
                <input
                  type="checkbox"
                  v-model="selectedPrompts"
                  :value="prompt.id"
                  class="rounded border-admin-300 text-primary-600 focus:ring-primary-500"
                />
              </td>
              <td class="px-4 py-4">
                <div class="space-y-1.5">
                  <div class="text-sm font-medium text-admin-900 truncate" :title="prompt.title">
                    {{ prompt.title }}
                  </div>
                  <div v-if="prompt.description" class="text-xs text-admin-600 truncate" :title="prompt.description">
                    {{ prompt.description }}
                  </div>
                  <div class="text-xs text-admin-500 line-clamp-2 leading-relaxed" :title="prompt.content">
                    {{ prompt.content }}
                  </div>
                  <div v-if="prompt.tags && prompt.tags.length > 0" class="flex flex-wrap gap-1 mt-1">
                    <span
                      v-for="tag in prompt.tags.slice(0, 3)"
                      :key="tag"
                      class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {{ tag }}
                    </span>
                    <span v-if="prompt.tags.length > 3" class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      +{{ prompt.tags.length - 3 }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="px-4 py-4">
                <span
                  v-if="getCategoryById(prompt.categoryId)"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                  :style="{ backgroundColor: getCategoryById(prompt.categoryId).color }"
                >
                  {{ getCategoryById(prompt.categoryId).name }}
                </span>
                <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  未分类
                </span>
              </td>
              <td class="px-4 py-4 text-sm text-admin-900 text-center">
                {{ prompt.usageCount || 0 }}
              </td>
              <td class="px-4 py-4 text-sm text-admin-500">
                {{ formatDate(prompt.createdAt) }}
              </td>
              <td class="px-4 py-4">
                <div class="flex items-center space-x-1">
                  <button
                    @click="viewPrompt(prompt)"
                    class="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                    title="查看详情"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    @click="copyPromptContent(prompt)"
                    class="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                    title="复制内容"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    @click="editPrompt(prompt)"
                    class="p-1 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded transition-colors"
                    title="编辑"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="deletePrompt(prompt)"
                    class="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    title="删除"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 批量操作 -->
      <div v-if="selectedPrompts.length > 0" class="mt-4 flex items-center justify-between bg-admin-50 p-4 rounded-lg">
        <span class="text-sm text-admin-600">
          已选择 {{ selectedPrompts.length }} 个提示词
        </span>
        <div class="flex items-center space-x-2">
          <button
            @click="batchDeletePrompts"
            class="btn btn-danger btn-sm"
          >
            批量删除
          </button>
        </div>
      </div>
    </div>

    <!-- 创建/编辑提示词模态框 -->
    <PromptModal
      v-if="showCreateModal || showEditModal"
      :prompt="editingPrompt"
      :categories="categories"
      @save="savePrompt"
      @close="closeModal"
    />

    <!-- 查看提示词详情模态框 -->
    <PromptDetailModal
      v-if="showDetailModal"
      :prompt="selectedPrompt"
      :category="getCategoryById(selectedPrompt?.categoryId)"
      @close="showDetailModal = false"
    />

    <!-- 成功提示 -->
    <div
      v-if="showSuccessMessage"
      class="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50 max-w-sm"
    >
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span class="text-sm">{{ successMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '../stores/admin'
import { format } from 'date-fns'
import PromptModal from '../components/PromptModal.vue'
import PromptDetailModal from '../components/PromptDetailModal.vue'

const store = useAdminStore()
const router = useRouter()

// 响应式数据
const searchQuery = ref('')
const categoryFilter = ref('')
const sortBy = ref('createdAt')
const selectedPrompts = ref([])
const selectAll = ref(false)
const showDetailModal = ref(false)
const selectedPrompt = ref(null)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingPrompt = ref(null)
const showSuccessMessage = ref(false)
const successMessage = ref('')

// 计算属性
const loading = computed(() => store.loading)
const prompts = computed(() => store.prompts)
const categories = computed(() => store.categories)

const filteredPrompts = computed(() => {
  let filtered = prompts.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(prompt =>
      prompt.title.toLowerCase().includes(query) ||
      prompt.content.toLowerCase().includes(query) ||
      prompt.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  if (categoryFilter.value) {
    filtered = filtered.filter(prompt => prompt.categoryId === categoryFilter.value)
  }

  // 排序
  filtered.sort((a, b) => {
    if (sortBy.value === 'createdAt' || sortBy.value === 'updatedAt') {
      return new Date(b[sortBy.value]) - new Date(a[sortBy.value])
    } else if (sortBy.value === 'usageCount') {
      return (b.usageCount || 0) - (a.usageCount || 0)
    } else if (sortBy.value === 'title') {
      return a.title.localeCompare(b.title)
    }
    return 0
  })

  return filtered
})

// 方法
function formatDate(dateString) {
  return format(new Date(dateString), 'yyyy-MM-dd HH:mm')
}

function getCategoryById(id) {
  return categories.value.find(cat => cat.id === id)
}

function toggleSelectAll() {
  if (selectAll.value) {
    selectedPrompts.value = filteredPrompts.value.map(prompt => prompt.id)
  } else {
    selectedPrompts.value = []
  }
}

function viewPrompt(prompt) {
  selectedPrompt.value = prompt
  showDetailModal.value = true
}

function editPrompt(prompt) {
  editingPrompt.value = { ...prompt }
  showEditModal.value = true
}

async function deletePrompt(prompt) {
  if (confirm(`确定要删除提示词"${prompt.title}"吗？`)) {
    try {
      await store.deletePrompt(prompt.id)
    } catch (error) {
      console.error('删除失败:', error)
    }
  }
}

async function batchDeletePrompts() {
  if (confirm(`确定要删除选中的 ${selectedPrompts.value.length} 个提示词吗？此操作不可恢复！`)) {
    try {
      await store.batchDeletePrompts(selectedPrompts.value)
      selectedPrompts.value = []
      selectAll.value = false
    } catch (error) {
      console.error('批量删除失败:', error)
    }
  }
}

async function savePrompt(promptData) {
  try {
    if (editingPrompt.value) {
      await store.updatePrompt(editingPrompt.value.id, promptData)
    } else {
      await store.createPrompt(promptData)
    }
    closeModal()
  } catch (error) {
    console.error('保存失败:', error)
  }
}

function closeModal() {
  showCreateModal.value = false
  showEditModal.value = false
  editingPrompt.value = null
}

async function copyPromptContent(prompt) {
  try {
    await navigator.clipboard.writeText(prompt.content)
    showMessage('内容已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
    showMessage('复制失败，请手动复制')
  }
}

function showMessage(message) {
  successMessage.value = message
  showSuccessMessage.value = true
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 3000)
}

async function exportData() {
  try {
    const response = await fetch('/api/admin/export/prompts')
    if (response.ok) {
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `prompts_export_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      showMessage('数据导出成功')
    } else {
      throw new Error('导出失败')
    }
  } catch (error) {
    console.error('导出失败:', error)
    showMessage('导出失败，请重试')
  }
}

// 生命周期
onMounted(async () => {
  await store.fetchCategories()
  await store.fetchPrompts()

  // 检查是否有分类筛选参数
  const categoryId = router.currentRoute.value.query.category
  if (categoryId) {
    categoryFilter.value = categoryId
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
}

/* 确保表格单元格不会过度拉伸 */
table {
  table-layout: fixed;
  width: 100%;
}

/* 表格单元格垂直对齐 */
td {
  vertical-align: top;
}

/* 紧凑的行间距 */
.space-y-1\.5 > * + * {
  margin-top: 0.375rem;
}

/* 悬停效果优化 */
.hover\:bg-admin-50:hover {
  background-color: #f8fafc;
}

/* 按钮悬停效果 */
.hover\:bg-blue-50:hover {
  background-color: #eff6ff;
}

.hover\:bg-primary-50:hover {
  background-color: #f0f9ff;
}

.hover\:bg-red-50:hover {
  background-color: #fef2f2;
}

.hover\:bg-green-50:hover {
  background-color: #f0fdf4;
}

/* 表格行悬停效果 */
tbody tr:hover {
  background-color: #f8fafc;
}

/* 成功提示动画 */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.fixed.bottom-4.right-4 {
  animation: slideInRight 0.3s ease-out;
}
</style>
