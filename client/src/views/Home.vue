<template>
  <div class="space-y-6">
    <!-- 公告横幅 -->
    <AnnouncementBanner ref="announcementBanner" />

    <!-- 页面标题和操作按钮 -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">提示词收藏</h1>
        <p class="mt-2 text-gray-600">管理您的个人提示词收藏和浏览模板库</p>
      </div>
      <div class="flex items-center space-x-3">
        <button
          @click="showImportModal = true"
          class="btn btn-secondary flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
          <span>导入</span>
        </button>
        <button
          @click="exportLocalData"
          class="btn btn-secondary flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span>导出</span>
        </button>
        <button
          @click="showCreateModal = true"
          class="btn btn-primary flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>创建提示词</span>
        </button>
      </div>
    </div>

    <!-- 标签页切换 -->
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8">
        <button
          @click="activeTab = 'local'"
          class="py-2 px-1 border-b-2 font-medium text-sm"
          :class="activeTab === 'local'
            ? 'border-primary-500 text-primary-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
        >
          我的收藏 ({{ localPrompts.length }})
        </button>
        <button
          @click="activeTab = 'templates'"
          class="py-2 px-1 border-b-2 font-medium text-sm"
          :class="activeTab === 'templates'
            ? 'border-primary-500 text-primary-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
        >
          模板库 ({{ templatePrompts.length }})
        </button>
      </nav>
    </div>

    <!-- 主要内容区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- 左侧分类筛选 -->
      <div class="lg:col-span-1">
        <div class="sticky top-6">
          <CategoryFilter
            :categories="categories"
            :local-prompts="localPrompts"
            :template-prompts="templatePrompts"
            :selected-category="localStore.selectedCategory"
            :active-tab="activeTab"
            @category-selected="handleCategorySelected"
          />
        </div>
      </div>

      <!-- 右侧主要内容 -->
      <div class="lg:col-span-3 space-y-6">
        <!-- 搜索和视图控制 -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">搜索提示词</label>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索标题、内容或标签..."
                class="input"
              />
            </div>
            <div class="flex items-end space-x-2">
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500">视图:</span>
                <button
                  @click="viewMode = 'grid'"
                  class="p-2 rounded-lg transition-colors"
                  :class="viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  @click="viewMode = 'list'"
                  class="p-2 rounded-lg transition-colors"
                  :class="viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="mt-4 flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-500">
                {{ activeTab === 'local' ? '我的收藏' : '模板库' }}：{{ currentPrompts.length }} 个提示词
              </span>
              <button
                v-if="searchQuery || selectedCategory"
                @click="clearFilters"
                class="text-sm text-primary-600 hover:text-primary-700"
              >
                清除筛选
              </button>
              <button
                v-if="activeTab === 'local' && localPrompts.length > 0"
                @click="clearLocalData"
                class="text-sm text-red-600 hover:text-red-700"
              >
                清空本地数据
              </button>
            </div>
          </div>
        </div>

        <!-- 提示词列表 -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p class="mt-2 text-gray-500">加载中...</p>
        </div>

        <div v-else-if="currentPrompts.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">
            {{ activeTab === 'local' ? '暂无本地提示词' : '暂无模板提示词' }}
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ activeTab === 'local' ? '开始创建您的第一个提示词吧' : '管理员还没有添加模板提示词' }}
          </p>
          <div v-if="activeTab === 'local'" class="mt-6">
            <button @click="showCreateModal = true" class="btn btn-primary">
              创建提示词
            </button>
          </div>
        </div>

        <div v-else>
          <!-- 网格视图 -->
          <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <PromptCard
              v-for="prompt in currentPrompts"
              :key="prompt.id"
              :prompt="prompt"
              :category="getCategoryById(prompt.categoryId)"
              :show-template-actions="activeTab === 'templates'"
              :local-prompts="localPrompts"
              @view="viewPrompt"
              @edit="editPrompt"
              @delete="deletePrompt"
              @toggle-favorite="toggleFavorite"
              @copy="copyPrompt"
              @copy-to-local="copyTemplateToLocal"
            />
          </div>

          <!-- 列表视图 -->
          <div v-else class="space-y-4">
            <PromptListItem
              v-for="prompt in currentPrompts"
              :key="prompt.id"
              :prompt="prompt"
              :category="getCategoryById(prompt.categoryId)"
              :show-template-actions="activeTab === 'templates'"
              :local-prompts="localPrompts"
              @view="viewPrompt"
              @edit="editPrompt"
              @delete="deletePrompt"
              @toggle-favorite="toggleFavorite"
              @copy="copyPrompt"
              @copy-to-local="copyTemplateToLocal"
            />
          </div>
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
      :prompt="viewingPrompt"
      :category="getCategoryById(viewingPrompt?.categoryId)"
      @close="closeDetailModal"
      @edit="editFromDetail"
      @toggle-favorite="toggleFavorite"
      @copy-to-local="copyTemplateToLocal"
    />

    <!-- 导入数据模态框 -->
    <div v-if="showImportModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4" @click="closeModal">
      <div class="relative w-full max-w-md bg-white rounded-lg shadow-xl" @click.stop>
        <div class="p-6">
          <div class="flex items-center justify-between pb-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">导入提示词</h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              选择JSON文件
            </label>
            <input
              type="file"
              accept=".json"
              @change="handleImport"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
            <p class="mt-2 text-sm text-gray-500">
              请选择之前导出的JSON格式文件
            </p>
          </div>
        </div>
      </div>
    </div>

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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useLocalPromptsStore } from '../stores/localPrompts'
import PromptCard from '../components/PromptCard.vue'
import PromptListItem from '../components/PromptListItem.vue'
import PromptModal from '../components/PromptModal.vue'
import PromptDetailModal from '../components/PromptDetailModal.vue'
import AnnouncementBanner from '../components/AnnouncementBanner.vue'
import CategoryFilter from '../components/CategoryFilter.vue'

const route = useRoute()
const localStore = useLocalPromptsStore()

// 公告组件引用
const announcementBanner = ref(null)

// 响应式数据
const activeTab = ref('local') // 'local' 或 'templates'
const viewMode = ref('grid')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showImportModal = ref(false)
const editingPrompt = ref(null)
const showDetailModal = ref(false)
const viewingPrompt = ref(null)
const showSuccessMessage = ref(false)
const successMessage = ref('')

// 计算属性
const localPrompts = computed(() => localStore.localPrompts)
const templatePrompts = computed(() => localStore.templatePrompts)
const categories = computed(() => localStore.categories)
const loading = computed(() => localStore.loading)

const currentPrompts = computed(() => {
  return activeTab.value === 'local'
    ? localStore.filteredPrompts
    : localStore.filteredTemplatePrompts
})

const searchQuery = computed({
  get: () => localStore.searchQuery,
  set: (value) => localStore.setSearchQuery(value)
})
const selectedCategory = computed({
  get: () => localStore.selectedCategory,
  set: (value) => localStore.setSelectedCategory(value)
})

// 方法
const getCategoryById = (id) => localStore.getCategoryById(id)

function clearFilters() {
  localStore.clearFilters()
}

function handleCategorySelected(categoryId) {
  localStore.setSelectedCategory(categoryId)
}

function viewPrompt(prompt) {
  viewingPrompt.value = prompt
  showDetailModal.value = true
}

function editPrompt(prompt) {
  // 只有本地提示词可以编辑
  if (prompt.isLocal) {
    editingPrompt.value = { ...prompt }
    showEditModal.value = true
  } else {
    showMessage('模板提示词不能编辑，请复制到本地后编辑')
  }
}

function editFromDetail(prompt) {
  closeDetailModal()
  editPrompt(prompt)
}

async function deletePrompt(prompt) {
  // 只有本地提示词可以删除
  if (!prompt.isLocal) {
    showMessage('模板提示词不能删除')
    return
  }

  if (confirm(`确定要删除提示词"${prompt.title}"吗？`)) {
    try {
      localStore.deleteLocalPrompt(prompt.id)
      showMessage('提示词已删除')
    } catch (error) {
      console.error('删除失败:', error)
      showMessage('删除失败，请重试')
    }
  }
}

async function toggleFavorite(prompt) {
  try {
    if (prompt.isLocal) {
      localStore.toggleLocalFavorite(prompt.id)
    } else {
      showMessage('请先复制到本地收藏')
    }
  } catch (error) {
    console.error('操作失败:', error)
    showMessage('操作失败，请重试')
  }
}

async function copyPrompt(prompt) {
  try {
    await navigator.clipboard.writeText(prompt.content)

    if (prompt.isLocal) {
      localStore.incrementLocalUsage(prompt.id)
    }

    showMessage('内容已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
    showMessage('复制失败，请重试')
  }
}

// 复制模板到本地
function copyTemplateToLocal(prompt) {
  try {
    localStore.copyTemplateToLocal(prompt)
    showMessage('已复制到我的收藏')
  } catch (error) {
    console.error('复制失败:', error)
    showMessage('复制失败，请重试')
  }
}

function showMessage(message) {
  successMessage.value = message
  showSuccessMessage.value = true
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 3000)
}

async function savePrompt(promptData) {
  try {
    if (editingPrompt.value) {
      localStore.updateLocalPrompt(editingPrompt.value.id, promptData)
      showMessage('提示词已更新')
    } else {
      localStore.createLocalPrompt(promptData)
      showMessage('提示词已创建')
    }
    closeModal()
  } catch (error) {
    console.error('保存失败:', error)
    showMessage('保存失败，请重试')
  }
}

function closeModal() {
  showCreateModal.value = false
  showEditModal.value = false
  showImportModal.value = false
  editingPrompt.value = null
}

function closeDetailModal() {
  showDetailModal.value = false
  viewingPrompt.value = null
}

// 数据管理
function exportLocalData() {
  try {
    localStore.exportLocalData()
    showMessage('数据导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    showMessage('导出失败，请重试')
  }
}

function handleImport(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const count = localStore.importLocalData(e.target.result)
      showMessage(`成功导入 ${count} 个提示词`)
      closeModal()
    } catch (error) {
      console.error('导入失败:', error)
      showMessage('导入失败: ' + error.message)
    }
  }
  reader.readAsText(file)
}

function clearLocalData() {
  if (confirm('确定要清空所有本地数据吗？此操作不可恢复！')) {
    localStore.clearLocalData()
    showMessage('本地数据已清空')
  }
}

// 键盘快捷键处理
function handleKeydown(event) {
  // Ctrl/Cmd + R 刷新公告
  if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
    event.preventDefault()
    refreshAnnouncements()
  }
}

// 手动刷新公告
async function refreshAnnouncements() {
  if (announcementBanner.value) {
    try {
      await announcementBanner.value.manualRefresh()
      showMessage('公告已刷新')
    } catch (error) {
      console.error('刷新公告失败:', error)
      showMessage('刷新公告失败')
    }
  }
}

// 生命周期
onMounted(() => {
  localStore.initialize()

  // 处理来自分类页面的查询参数
  if (route.query.category) {
    localStore.setSelectedCategory(route.query.category)
  }

  // 添加键盘事件监听
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  // 移除键盘事件监听
  document.removeEventListener('keydown', handleKeydown)
})
</script>
