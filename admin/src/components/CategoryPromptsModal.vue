<template>
  <!-- 模态框背景 -->
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="$emit('close')">
    <!-- 模态框内容 -->
    <div class="relative top-10 mx-auto p-5 border w-11/12 md:w-5/6 lg:w-4/5 shadow-lg rounded-md bg-white" @click.stop>
      <!-- 模态框头部 -->
      <div class="flex items-center justify-between pb-4 border-b border-admin-200">
        <div class="flex items-center space-x-3">
          <div
            class="w-4 h-4 rounded-full"
            :style="{ backgroundColor: category.color }"
          ></div>
          <h3 class="text-lg font-semibold text-admin-900">
            {{ category.name }} - 提示词列表
          </h3>
          <span class="badge badge-info">{{ prompts.length }} 个提示词</span>
        </div>
        <button
          @click="$emit('close')"
          class="text-admin-400 hover:text-admin-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- 搜索和操作栏 -->
      <div class="mt-6 mb-4 flex items-center justify-between">
        <div class="flex-1 max-w-md">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索提示词..."
            class="input"
          />
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-admin-500">
            显示 {{ filteredPrompts.length }} / {{ prompts.length }} 个提示词
          </span>
          <button
            @click="exportCategoryPrompts"
            class="btn btn-secondary btn-sm flex items-center space-x-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>导出</span>
          </button>
        </div>
      </div>

      <!-- 提示词列表 -->
      <div class="max-h-96 overflow-y-auto">
        <div v-if="filteredPrompts.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-admin-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-admin-900">
            {{ searchQuery ? '未找到匹配的提示词' : '该分类下暂无提示词' }}
          </h3>
          <p class="mt-1 text-sm text-admin-500">
            {{ searchQuery ? '尝试使用其他关键词搜索' : '可以在提示词管理页面添加新的提示词' }}
          </p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="prompt in filteredPrompts"
            :key="prompt.id"
            class="border border-admin-200 rounded-lg p-4 hover:bg-admin-50 transition-colors"
          >
            <!-- 提示词头部 -->
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2 mb-1">
                  <h4 class="text-lg font-medium text-admin-900 truncate">{{ prompt.title }}</h4>
                  <span
                    v-if="prompt.isFavorite"
                    class="text-red-500"
                    title="收藏"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                    </svg>
                  </span>
                </div>
                <p v-if="prompt.description" class="text-sm text-admin-600 mb-2">
                  {{ prompt.description }}
                </p>
                <div class="flex items-center space-x-4 text-xs text-admin-500">
                  <span class="flex items-center">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {{ prompt.usageCount || 0 }} 次使用
                  </span>
                  <span>{{ formatDate(prompt.createdAt) }}</span>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="flex items-center space-x-2 ml-4">
                <button
                  @click="viewPromptDetail(prompt)"
                  class="text-blue-600 hover:text-blue-700 p-1"
                  title="查看详情"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button
                  @click="copyPromptContent(prompt)"
                  class="text-green-600 hover:text-green-700 p-1"
                  title="复制内容"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  @click="$emit('edit-prompt', prompt)"
                  class="text-primary-600 hover:text-primary-700 p-1"
                  title="编辑"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="$emit('delete-prompt', prompt)"
                  class="text-red-600 hover:text-red-700 p-1"
                  title="删除"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- 提示词内容预览 -->
            <div class="mb-3">
              <p class="text-sm text-admin-700 line-clamp-3 leading-relaxed break-words">{{ prompt.content }}</p>
            </div>

            <!-- 标签 -->
            <div v-if="prompt.tags && prompt.tags.length > 0" class="flex flex-wrap gap-1">
              <span
                v-for="tag in prompt.tags.slice(0, 5)"
                :key="tag"
                class="badge badge-info text-xs"
              >
                {{ tag }}
              </span>
              <span v-if="prompt.tags.length > 5" class="badge badge-info text-xs">
                +{{ prompt.tags.length - 5 }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 模态框底部 -->
      <div class="flex justify-end space-x-3 pt-6 border-t border-admin-200 mt-6">
        <button
          @click="$emit('close')"
          class="btn btn-secondary"
        >
          关闭
        </button>
      </div>

      <!-- 提示词详情模态框 -->
      <PromptDetailModal
        v-if="showDetailModal"
        :prompt="selectedPrompt"
        :category="category"
        @close="showDetailModal = false"
      />

      <!-- 成功提示 -->
      <div
        v-if="showSuccessMessage"
        class="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50"
      >
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <span>{{ successMessage }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { format } from 'date-fns'
import PromptDetailModal from './PromptDetailModal.vue'

const props = defineProps({
  category: {
    type: Object,
    required: true
  },
  prompts: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'edit-prompt', 'delete-prompt'])

// 响应式数据
const searchQuery = ref('')
const showDetailModal = ref(false)
const selectedPrompt = ref(null)
const showSuccessMessage = ref(false)
const successMessage = ref('')

// 计算属性
const filteredPrompts = computed(() => {
  if (!searchQuery.value) {
    return props.prompts
  }

  const query = searchQuery.value.toLowerCase()
  return props.prompts.filter(prompt =>
    prompt.title.toLowerCase().includes(query) ||
    prompt.content.toLowerCase().includes(query) ||
    prompt.tags.some(tag => tag.toLowerCase().includes(query))
  )
})

// 方法
function formatDate(dateString) {
  return format(new Date(dateString), 'MM-dd HH:mm')
}

function viewPromptDetail(prompt) {
  selectedPrompt.value = prompt
  showDetailModal.value = true
}

async function copyPromptContent(prompt) {
  try {
    await navigator.clipboard.writeText(prompt.content)
    showMessage('内容已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
  }
}

function exportCategoryPrompts() {
  try {
    const exportData = {
      category: props.category,
      prompts: filteredPrompts.value,
      exportDate: new Date().toISOString(),
      totalCount: filteredPrompts.value.length
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${props.category.name}_prompts_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    showMessage('数据导出成功')
  } catch (error) {
    console.error('导出失败:', error)
  }
}

function showMessage(message) {
  successMessage.value = message
  showSuccessMessage.value = true
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 3000)
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
