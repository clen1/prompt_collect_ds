<template>
  <!-- 模态框背景 -->
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4" @click="$emit('close')">
    <!-- 模态框内容 -->
    <div class="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden" @click.stop>
      <!-- 模态框滚动容器 -->
      <div class="overflow-y-auto max-h-[90vh]">
        <div class="p-6">
          <!-- 模态框头部 -->
          <div class="flex items-center justify-between pb-4 border-b border-gray-200">
            <div class="flex items-center space-x-3">
              <h3 class="text-xl font-semibold text-gray-900">公告详情</h3>
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="getTypeClass(announcement.type)"
              >
                {{ getTypeText(announcement.type) }}
              </span>
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="announcement.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
              >
                {{ announcement.isPublished ? '已发布' : '草稿' }}
              </span>
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

          <!-- 公告信息 -->
          <div class="mt-6 space-y-6">
            <!-- 标题 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">公告标题</label>
              <h2 class="text-lg font-semibold text-gray-900">{{ announcement.title }}</h2>
            </div>

            <!-- 公告内容 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">公告内容</label>
              <div
                class="p-4 rounded-lg border-l-4"
                :class="getPreviewClass(announcement.type)"
              >
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5" :class="getIconClass(announcement.type)" fill="currentColor" viewBox="0 0 20 20">
                      <path v-if="announcement.type === 'info'" fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                      <path v-else-if="announcement.type === 'warning'" fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                      <path v-else-if="announcement.type === 'success'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      <path v-else-if="announcement.type === 'error'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium" :class="getTitleClass(announcement.type)">
                      {{ announcement.title }}
                    </h3>
                    <div class="mt-2 text-sm" :class="getContentClass(announcement.type)">
                      <p class="whitespace-pre-wrap">{{ announcement.content }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 统计信息 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div class="text-center">
                <div class="text-lg font-semibold text-gray-900">{{ getTypeText(announcement.type) }}</div>
                <div class="text-sm text-gray-500">公告类型</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-semibold text-gray-900">{{ formatDate(announcement.createdAt) }}</div>
                <div class="text-sm text-gray-500">创建时间</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-semibold text-gray-900">{{ formatDate(announcement.updatedAt) }}</div>
                <div class="text-sm text-gray-500">更新时间</div>
              </div>
            </div>

            <!-- 发布信息 -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-blue-800">发布状态</h3>
                  <div class="mt-2 text-sm text-blue-700">
                    <p v-if="announcement.isPublished">
                      此公告已发布，用户可以在前端看到此公告。
                    </p>
                    <p v-else>
                      此公告尚未发布，仍为草稿状态，用户无法看到。
                    </p>
                  </div>
                </div>
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
              @click="$emit('edit', announcement)"
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
  announcement: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'edit'])

const showSuccessMessage = ref(false)

function getTypeClass(type) {
  const classes = {
    info: 'bg-blue-100 text-blue-800',
    warning: 'bg-yellow-100 text-yellow-800',
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800'
  }
  return classes[type] || classes.info
}

function getTypeText(type) {
  const texts = {
    info: '信息',
    warning: '警告',
    success: '成功',
    error: '错误'
  }
  return texts[type] || '信息'
}

function getPreviewClass(type) {
  const classes = {
    info: 'bg-blue-50 border-blue-400',
    warning: 'bg-yellow-50 border-yellow-400',
    success: 'bg-green-50 border-green-400',
    error: 'bg-red-50 border-red-400'
  }
  return classes[type] || classes.info
}

function getIconClass(type) {
  const classes = {
    info: 'text-blue-400',
    warning: 'text-yellow-400',
    success: 'text-green-400',
    error: 'text-red-400'
  }
  return classes[type] || classes.info
}

function getTitleClass(type) {
  const classes = {
    info: 'text-blue-800',
    warning: 'text-yellow-800',
    success: 'text-green-800',
    error: 'text-red-800'
  }
  return classes[type] || classes.info
}

function getContentClass(type) {
  const classes = {
    info: 'text-blue-700',
    warning: 'text-yellow-700',
    success: 'text-green-700',
    error: 'text-red-700'
  }
  return classes[type] || classes.info
}

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
    const content = `${props.announcement.title}\n\n${props.announcement.content}`
    await navigator.clipboard.writeText(content)
    showSuccessMessage.value = true
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
  } catch (error) {
    console.error('复制失败:', error)
    // 降级方案：创建临时文本区域
    const textArea = document.createElement('textarea')
    textArea.value = `${props.announcement.title}\n\n${props.announcement.content}`
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
