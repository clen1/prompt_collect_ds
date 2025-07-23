<template>
  <div class="card">
    <div class="flex items-center justify-between">
      <!-- 左侧内容 -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center space-x-3">
          <!-- 收藏按钮 -->
          <button
            v-if="showTemplateActions"
            @click="handleTemplateCollect"
            class="p-1 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
            :class="isCollected ? 'text-red-500' : 'text-gray-400'"
            :title="isCollected ? '已收藏到本地' : '收藏到本地'"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
          </button>
          <button
            v-else
            @click="$emit('toggle-favorite', prompt)"
            class="p-1 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
            :class="prompt.isFavorite ? 'text-red-500' : 'text-gray-400'"
            :title="prompt.isFavorite ? '取消收藏' : '添加收藏'"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
          </button>

          <!-- 主要内容 -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-3 mb-2">
              <h3 class="text-lg font-semibold text-gray-900 truncate">{{ prompt.title }}</h3>

              <!-- 分类标签 -->
              <span
                v-if="category"
                class="tag text-white text-xs flex-shrink-0"
                :style="{ backgroundColor: category.color }"
              >
                {{ category.name }}
              </span>
            </div>

            <p v-if="prompt.description" class="text-sm text-gray-600 mb-2 line-clamp-1">
              {{ prompt.description }}
            </p>

            <p class="text-sm text-gray-700 line-clamp-2 mb-3">{{ prompt.content }}</p>

            <!-- 标签和元信息 -->
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <!-- 标签 -->
                <div v-if="prompt.tags && prompt.tags.length > 0" class="flex flex-wrap gap-1">
                  <span
                    v-for="tag in prompt.tags.slice(0, 3)"
                    :key="tag"
                    class="tag bg-gray-100 text-gray-700 text-xs"
                  >
                    {{ tag }}
                  </span>
                  <span v-if="prompt.tags.length > 3" class="tag bg-gray-100 text-gray-500 text-xs">
                    +{{ prompt.tags.length - 3 }}
                  </span>
                </div>
              </div>

              <!-- 元信息 -->
              <div class="flex items-center space-x-4 text-xs text-gray-500">
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {{ prompt.usageCount || 0 }}
                </span>
                <span>{{ formatDate(prompt.updatedAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧操作按钮 -->
      <div class="flex items-center space-x-2 ml-4">
        <button
          @click="$emit('view', prompt)"
          class="btn btn-secondary text-sm py-2 px-4 flex items-center space-x-2"
          title="查看详情"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>查看</span>
        </button>

        <!-- 模板库操作按钮 -->
        <button
          v-if="showTemplateActions"
          @click="handleCopyToLocal"
          class="btn btn-primary text-sm py-2 px-4 flex items-center space-x-2"
          title="收藏到本地"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
          </svg>
          <span>收藏</span>
        </button>

        <!-- 本地提示词操作按钮 -->
        <template v-else>
          <button
            @click="$emit('copy', prompt)"
            class="btn btn-secondary text-sm py-2 px-4 flex items-center space-x-2"
            title="复制内容"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>复制</span>
          </button>

          <button
            @click="$emit('edit', prompt)"
            class="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
            title="编辑"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          <button
            @click="$emit('delete', prompt)"
            class="p-2 rounded-lg hover:bg-red-50 transition-colors text-gray-600 hover:text-red-600"
            title="删除"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  prompt: {
    type: Object,
    required: true
  },
  category: {
    type: Object,
    default: null
  },
  showTemplateActions: {
    type: Boolean,
    default: false
  },
  localPrompts: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['view', 'edit', 'delete', 'toggle-favorite', 'copy', 'copy-to-local'])

// 计算属性 - 检查模板是否已被收藏到本地
const isCollected = computed(() => {
  if (!props.showTemplateActions) return false
  return props.localPrompts.some(localPrompt =>
    localPrompt.sourceTemplateId === props.prompt.id
  )
})

// 处理模板收藏
function handleTemplateCollect() {
  if (isCollected.value) {
    // 如果已收藏，提示用户
    return
  }
  handleCopyToLocal()
}

// 复制模板到本地
function handleCopyToLocal() {
  emit('copy-to-local', props.prompt)
}

function formatDate(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) {
    return '今天'
  } else if (diffDays <= 7) {
    return `${diffDays}天前`
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
