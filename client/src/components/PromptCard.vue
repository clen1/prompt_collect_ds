<template>
  <div class="card hover:shadow-md transition-shadow duration-200">
    <!-- 卡片头部 -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-semibold text-gray-900 truncate">{{ prompt.title }}</h3>
        <p v-if="prompt.description" class="text-sm text-gray-600 mt-1 line-clamp-2">
          {{ prompt.description }}
        </p>
      </div>

      <div class="flex items-center space-x-2 ml-3">
        <!-- 收藏按钮 - 根据是否为模板显示不同行为 -->
        <button
          v-if="showTemplateActions"
          @click="handleTemplateCollect"
          class="p-1 rounded-full hover:bg-gray-100 transition-colors"
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
          class="p-1 rounded-full hover:bg-gray-100 transition-colors"
          :class="prompt.isFavorite ? 'text-red-500' : 'text-gray-400'"
          :title="prompt.isFavorite ? '取消收藏' : '添加收藏'"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
          </svg>
        </button>

        <div class="relative">
          <button
            @click="showMenu = !showMenu"
            class="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-400"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          <!-- 下拉菜单 -->
          <div
            v-if="showMenu"
            v-click-outside="() => showMenu = false"
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10"
          >
            <div class="py-1">
              <button
                @click="handleView"
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                查看详情
              </button>
              <!-- 编辑按钮 - 只对本地提示词显示 -->
              <button
                v-if="!showTemplateActions"
                @click="handleEdit"
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                编辑
              </button>

              <!-- 复制到本地按钮 - 只对模板显示 -->
              <button
                v-if="showTemplateActions"
                @click="handleCopyToLocal"
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
                复制到本地
              </button>
              <button
                @click="handleCopy"
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                复制内容
              </button>
              <!-- 删除按钮 - 只对本地提示词显示 -->
              <button
                v-if="!showTemplateActions"
                @click="handleDelete"
                class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分类标签 -->
    <div v-if="category" class="mb-3">
      <span
        class="tag text-white text-xs"
        :style="{ backgroundColor: category.color }"
      >
        {{ category.name }}
      </span>
    </div>

    <!-- 提示词内容预览 -->
    <div class="mb-4">
      <p class="text-sm text-gray-700 line-clamp-4 leading-relaxed break-words">{{ prompt.content }}</p>
    </div>

    <!-- 标签 -->
    <div v-if="prompt.tags && prompt.tags.length > 0" class="mb-4">
      <div class="flex flex-wrap gap-1">
        <span
          v-for="tag in prompt.tags.slice(0, 3)"
          :key="tag"
          class="tag bg-gray-100 text-gray-700"
        >
          {{ tag }}
        </span>
        <span v-if="prompt.tags.length > 3" class="tag bg-gray-100 text-gray-500">
          +{{ prompt.tags.length - 3 }}
        </span>
      </div>
    </div>

    <!-- 卡片底部 -->
    <div class="flex items-center justify-between pt-4 border-t border-gray-100">
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

      <!-- 底部操作按钮 -->
      <button
        v-if="showTemplateActions"
        @click="handleCopyToLocal"
        class="btn btn-primary text-xs py-1 px-3 flex items-center space-x-1"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
        </svg>
        <span>收藏</span>
      </button>
      <button
        v-else
        @click="$emit('copy', prompt)"
        class="btn btn-secondary text-xs py-1 px-3 flex items-center space-x-1"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <span>复制</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

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

const emit = defineEmits(['edit', 'delete', 'toggle-favorite', 'copy', 'view', 'copy-to-local'])

const showMenu = ref(false)

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
  showMenu.value = false
}

// 处理菜单点击事件
function handleView() {
  emit('view', props.prompt)
  showMenu.value = false
}

function handleEdit() {
  emit('edit', props.prompt)
  showMenu.value = false
}

function handleCopy() {
  emit('copy', props.prompt)
  showMenu.value = false
}

function handleDelete() {
  emit('delete', props.prompt)
  showMenu.value = false
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

// 点击外部关闭菜单的指令
const vClickOutside = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
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
}

.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
}
</style>
