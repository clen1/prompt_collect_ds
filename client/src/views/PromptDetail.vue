<template>
  <div v-if="loading" class="text-center py-12">
    <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    <p class="mt-2 text-gray-500">加载中...</p>
  </div>

  <div v-else-if="!prompt" class="text-center py-12">
    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    <h3 class="mt-2 text-sm font-medium text-gray-900">提示词不存在</h3>
    <p class="mt-1 text-sm text-gray-500">您访问的提示词可能已被删除</p>
    <div class="mt-6">
      <router-link to="/" class="btn btn-primary">
        返回首页
      </router-link>
    </div>
  </div>

  <div v-else class="space-y-6">
    <!-- 返回按钮 -->
    <div>
      <router-link
        to="/"
        class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        返回列表
      </router-link>
    </div>

    <!-- 提示词详情 -->
    <div class="card">
      <!-- 头部 -->
      <div class="flex items-start justify-between mb-6">
        <div class="flex-1 min-w-0">
          <div class="flex items-center space-x-3 mb-2">
            <h1 class="text-2xl font-bold text-gray-900">{{ prompt.title }}</h1>
            <button
              @click="toggleFavorite"
              class="p-2 rounded-full hover:bg-gray-100 transition-colors"
              :class="prompt.isFavorite ? 'text-red-500' : 'text-gray-400'"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
            </button>
          </div>

          <p v-if="prompt.description" class="text-gray-600 mb-4">
            {{ prompt.description }}
          </p>

          <!-- 分类和标签 -->
          <div class="flex items-center space-x-4 mb-4">
            <span
              v-if="category"
              class="tag text-white"
              :style="{ backgroundColor: category.color }"
            >
              {{ category.name }}
            </span>

            <div v-if="prompt.tags && prompt.tags.length > 0" class="flex flex-wrap gap-2">
              <span
                v-for="tag in prompt.tags"
                :key="tag"
                class="tag bg-gray-100 text-gray-700"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- 元信息 -->
          <div class="flex items-center space-x-6 text-sm text-gray-500">
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              使用 {{ prompt.usageCount || 0 }} 次
            </span>
            <span>创建于 {{ formatDate(prompt.createdAt) }}</span>
            <span v-if="prompt.updatedAt !== prompt.createdAt">
              更新于 {{ formatDate(prompt.updatedAt) }}
            </span>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex items-center space-x-3 ml-6">
          <button
            @click="copyPrompt"
            class="btn btn-primary flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>复制</span>
          </button>

          <button
            @click="editPrompt"
            class="btn btn-secondary flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>编辑</span>
          </button>

          <button
            @click="deletePrompt"
            class="btn btn-danger flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>删除</span>
          </button>
        </div>
      </div>

      <!-- 提示词内容 -->
      <div class="border-t border-gray-200 pt-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">提示词内容</h2>
        <div class="bg-gray-50 rounded-lg p-6">
          <pre class="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">{{ prompt.content }}</pre>
        </div>
        <div class="mt-2 text-sm text-gray-500 text-right">
          {{ prompt.content.length }} 字符
        </div>
      </div>
    </div>

    <!-- 编辑模态框 -->
    <PromptModal
      v-if="showEditModal"
      :prompt="prompt"
      :categories="categories"
      @save="savePrompt"
      @close="showEditModal = false"
    />

    <!-- 成功提示 -->
    <div
      v-if="showSuccessMessage"
      class="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg"
    >
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span>{{ successMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePromptsStore } from '../stores/prompts'
import PromptModal from '../components/PromptModal.vue'
import api from '../services/api'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const router = useRouter()
const store = usePromptsStore()

// 响应式数据
const prompt = ref(null)
const loading = ref(true)
const showEditModal = ref(false)
const showSuccessMessage = ref(false)
const successMessage = ref('')

// 计算属性
const categories = computed(() => store.categories)
const category = computed(() => {
  if (prompt.value && prompt.value.categoryId) {
    return store.getCategoryById(prompt.value.categoryId)
  }
  return null
})

// 方法
async function fetchPrompt() {
  loading.value = true
  try {
    const response = await api.getPrompt(props.id)
    prompt.value = response.data
  } catch (error) {
    console.error('获取提示词失败:', error)
    prompt.value = null
  } finally {
    loading.value = false
  }
}

async function toggleFavorite() {
  try {
    await store.toggleFavorite(prompt.value.id)
    prompt.value.isFavorite = !prompt.value.isFavorite
    showMessage(prompt.value.isFavorite ? '已添加到收藏' : '已取消收藏')
  } catch (error) {
    console.error('操作失败:', error)
  }
}

async function copyPrompt() {
  try {
    await navigator.clipboard.writeText(prompt.value.content)
    await store.incrementUsage(prompt.value.id)
    prompt.value.usageCount = (prompt.value.usageCount || 0) + 1
    showMessage('已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
  }
}

function editPrompt() {
  showEditModal.value = true
}

async function savePrompt(promptData) {
  try {
    const response = await store.updatePrompt(prompt.value.id, promptData)
    prompt.value = response
    showEditModal.value = false
    showMessage('提示词已更新')
  } catch (error) {
    console.error('保存失败:', error)
  }
}

async function deletePrompt() {
  if (confirm(`确定要删除提示词"${prompt.value.title}"吗？`)) {
    try {
      await store.deletePrompt(prompt.value.id)
      router.push('/')
    } catch (error) {
      console.error('删除失败:', error)
    }
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

function showMessage(message) {
  successMessage.value = message
  showSuccessMessage.value = true
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 3000)
}

// 生命周期
onMounted(async () => {
  await store.fetchCategories()
  await fetchPrompt()
})
</script>
