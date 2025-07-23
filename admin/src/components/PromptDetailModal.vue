<template>
  <!-- 模态框背景 -->
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4" @click="$emit('close')">
    <!-- 模态框内容 -->
    <div class="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden" @click.stop>
      <!-- 模态框滚动容器 -->
      <div class="overflow-y-auto max-h-[90vh]">
        <div class="p-6">
      <!-- 模态框头部 -->
      <div class="flex items-center justify-between pb-4 border-b border-admin-200">
        <h3 class="text-lg font-semibold text-admin-900">提示词详情</h3>
        <button
          @click="$emit('close')"
          class="text-admin-400 hover:text-admin-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- 提示词信息 -->
      <div class="mt-6 space-y-6">
        <!-- 基本信息 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-admin-700 mb-2">标题</label>
            <p class="text-admin-900 font-medium">{{ prompt.title }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-admin-700 mb-2">分类</label>
            <span
              v-if="category"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
              :style="{ backgroundColor: category.color }"
            >
              {{ category.name }}
            </span>
            <span v-else class="text-admin-500">未分类</span>
          </div>
        </div>

        <!-- 描述 -->
        <div v-if="prompt.description">
          <label class="block text-sm font-medium text-admin-700 mb-2">描述</label>
          <p class="text-admin-900">{{ prompt.description }}</p>
        </div>

        <!-- 提示词内容 -->
        <div>
          <label class="block text-sm font-medium text-admin-700 mb-2">提示词内容</label>
          <div class="bg-admin-50 rounded-lg p-4 border border-admin-200 max-h-64 overflow-y-auto">
            <pre class="whitespace-pre-wrap text-sm text-admin-800 font-mono leading-relaxed break-words">{{ prompt.content }}</pre>
          </div>
          <div class="mt-2 flex items-center justify-between text-sm text-admin-500">
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
          <label class="block text-sm font-medium text-admin-700 mb-2">标签</label>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in prompt.tags"
              :key="tag"
              class="badge badge-info"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- 统计信息 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-admin-700 mb-2">使用次数</label>
            <p class="text-admin-900 font-medium">{{ prompt.usageCount || 0 }} 次</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-admin-700 mb-2">创建时间</label>
            <p class="text-admin-900">{{ formatDate(prompt.createdAt) }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-admin-700 mb-2">更新时间</label>
            <p class="text-admin-900">{{ formatDate(prompt.updatedAt) }}</p>
          </div>
        </div>

        <!-- 收藏状态 -->
        <div>
          <label class="block text-sm font-medium text-admin-700 mb-2">收藏状态</label>
          <span
            class="badge"
            :class="prompt.isFavorite ? 'badge-warning' : 'badge-info'"
          >
            {{ prompt.isFavorite ? '已收藏' : '未收藏' }}
          </span>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-end space-x-3 pt-6 border-t border-admin-200 mt-6">
        <button
          @click="$emit('close')"
          class="btn btn-secondary"
        >
          关闭
        </button>
        <button
          @click="editPrompt"
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
import { format } from 'date-fns'

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

const emit = defineEmits(['close', 'edit'])

const showSuccessMessage = ref(false)

function formatDate(dateString) {
  return format(new Date(dateString), 'yyyy-MM-dd HH:mm:ss')
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
  }
}

function editPrompt() {
  // 这里可以跳转到编辑页面或打开编辑模态框
  console.log('编辑提示词功能待实现')
}
</script>
