<template>
  <!-- 模态框背景 -->
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4" @click="$emit('close')">
    <!-- 模态框内容 -->
    <div class="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden" @click.stop>
      <!-- 模态框滚动容器 -->
      <div class="overflow-y-auto max-h-[90vh]">
        <div class="p-6">
          <!-- 模态框头部 -->
          <div class="flex items-center justify-between pb-4 border-b border-gray-200">
            <div class="flex items-center space-x-3">
              <h3 class="text-xl font-semibold text-gray-900">提示词详情</h3>
              <button
                v-if="prompt.isFavorite"
                @click="$emit('toggle-favorite', prompt)"
                class="text-red-500 hover:text-red-600"
                title="取消收藏"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
              </button>
              <button
                v-else
                @click="$emit('toggle-favorite', prompt)"
                class="text-gray-400 hover:text-red-500"
                title="添加收藏"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
              </button>
            </div>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- 提示词信息 -->
          <div class="mt-6 space-y-6">
            <!-- 标题 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">标题</label>
              <h2 class="text-lg font-semibold text-gray-900">{{ prompt.title }}</h2>
            </div>

            <!-- 描述 -->
            <div v-if="prompt.description">
              <label class="block text-sm font-medium text-gray-700 mb-2">描述</label>
              <p class="text-gray-700">{{ prompt.description }}</p>
            </div>

            <!-- 分类 -->
            <div v-if="category">
              <label class="block text-sm font-medium text-gray-700 mb-2">分类</label>
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                :style="{ backgroundColor: category.color }"
              >
                {{ category.name }}
              </span>
            </div>

            <!-- 提示词内容 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">提示词内容</label>
              <div class="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-80 overflow-y-auto">
                <pre class="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed break-words font-sans">{{ prompt.content }}</pre>
              </div>
              <div class="mt-2 flex items-center justify-between text-sm text-gray-500">
                <span>{{ prompt.content.length }} 字符</span>
                <button
                  @click="copyContent"
                  class="text-primary-600 hover:text-primary-700 flex items-center space-x-1 hover:bg-primary-50 px-2 py-1 rounded transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>复制内容</span>
                </button>
              </div>
            </div>

            <!-- 标签 -->
            <div v-if="prompt.tags && prompt.tags.length > 0">
              <label class="block text-sm font-medium text-gray-700 mb-2">标签</label>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in prompt.tags"
                  :key="tag"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- 统计信息 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div class="text-center">
                <div class="text-lg font-semibold text-gray-900">{{ prompt.usageCount || 0 }}</div>
                <div class="text-sm text-gray-500">使用次数</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-semibold text-gray-900">{{ formatDate(prompt.createdAt) }}</div>
                <div class="text-sm text-gray-500">创建时间</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-semibold text-gray-900">{{ formatDate(prompt.updatedAt) }}</div>
                <div class="text-sm text-gray-500">更新时间</div>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
            <button
              @click="$emit('close')"
              class="btn btn-secondary"
            >
              关闭
            </button>
            <button
              @click="copyContent"
              class="btn btn-primary flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>复制内容</span>
            </button>
            <button
              @click="$emit('edit', prompt)"
              class="btn btn-primary flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>编辑</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 成功提示 -->
      <div
        v-if="showSuccessMessage"
        class="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50"
      >
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <span>内容已复制到剪贴板</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  prompt: {
    type: Object,
    required: true
  },
  category: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'edit', 'toggle-favorite'])

const showSuccessMessage = ref(false)

function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(props.prompt.content)
    showSuccessMessage.value = true
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
  } catch (error) {
    console.error('复制失败:', error)
    // 降级方案：创建临时文本区域
    const textArea = document.createElement('textarea')
    textArea.value = props.prompt.content
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      showSuccessMessage.value = true
      setTimeout(() => {
        showSuccessMessage.value = false
      }, 3000)
    } catch (fallbackError) {
      console.error('降级复制也失败:', fallbackError)
    }
    document.body.removeChild(textArea)
  }
}
</script>

<style scoped>
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
