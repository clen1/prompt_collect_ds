<template>
  <div class="max-w-4xl mx-auto">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- 头部 -->
      <div class="border-b border-gray-200 p-6">
        <h1 class="text-2xl font-bold text-gray-900">AI 对话</h1>
        <p class="text-gray-600 mt-2">使用您的提示词与AI进行对话</p>
      </div>

      <!-- 提示词选择区域 -->
      <div class="p-6 border-b border-gray-200 bg-gray-50">
        <div class="flex items-center space-x-4">
          <label class="text-sm font-medium text-gray-700">选择提示词:</label>
          <select
            v-model="selectedPromptId"
            @change="onPromptChange"
            class="flex-1 max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">请选择一个提示词</option>
            <option
              v-for="prompt in availablePrompts"
              :key="prompt.id"
              :value="prompt.id"
            >
              {{ prompt.title }}
            </option>
          </select>
          <button
            v-if="selectedPrompt"
            @click="showPromptDetail = true"
            class="px-3 py-2 text-sm text-primary-600 hover:text-primary-700 border border-primary-300 rounded-md hover:bg-primary-50"
          >
            查看详情
          </button>
        </div>

        <!-- 选中的提示词预览 -->
        <div v-if="selectedPrompt" class="mt-4 p-4 bg-white rounded-lg border border-gray-200">
          <h3 class="font-medium text-gray-900 mb-2">{{ selectedPrompt.title }}</h3>
          <p class="text-sm text-gray-600 mb-2">{{ selectedPrompt.description }}</p>
          <div class="text-xs text-gray-500 line-clamp-3">
            {{ selectedPrompt.content }}
          </div>
        </div>
      </div>

      <!-- 对话区域 -->
      <div class="flex flex-col h-96">
        <!-- 消息列表 -->
        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-4">
          <div v-if="messages.length === 0" class="text-center text-gray-500 py-8">
            选择一个提示词开始对话
          </div>
          
          <div
            v-for="message in messages"
            :key="message.id"
            class="flex"
            :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg"
              :class="message.role === 'user' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-900'"
            >
              <div class="text-sm">{{ message.content }}</div>
              <div class="text-xs mt-1 opacity-70">
                {{ formatTime(message.timestamp) }}
              </div>
            </div>
          </div>

          <!-- 加载状态 -->
          <div v-if="isLoading" class="flex justify-start">
            <div class="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
              <div class="flex items-center space-x-2">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                <span class="text-sm">AI正在思考...</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="border-t border-gray-200 p-4">
          <div class="flex space-x-4">
            <input
              v-model="userInput"
              @keypress.enter="sendMessage"
              :disabled="!selectedPrompt || isLoading"
              placeholder="输入您的消息..."
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              @click="sendMessage"
              :disabled="!selectedPrompt || !userInput.trim() || isLoading"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              发送
            </button>
          </div>
        </div>
      </div>

      <!-- 对话历史管理 -->
      <div class="border-t border-gray-200 p-4 bg-gray-50">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-600">
            当前对话: {{ messages.length }} 条消息
          </div>
          <div class="flex space-x-2">
            <button
              @click="clearChat"
              :disabled="messages.length === 0"
              class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              清空对话
            </button>
            <button
              @click="saveChat"
              :disabled="messages.length === 0"
              class="px-3 py-1 text-sm text-primary-600 hover:text-primary-700 border border-primary-300 rounded hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              保存对话
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 提示词详情模态框 -->
    <div
      v-if="showPromptDetail && selectedPrompt"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showPromptDetail = false"
    >
      <div
        class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto"
        @click.stop
      >
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-semibold text-gray-900">{{ selectedPrompt.title }}</h3>
          <button
            @click="showPromptDetail = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p class="text-gray-600 mb-4">{{ selectedPrompt.description }}</p>
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-medium text-gray-900 mb-2">提示词内容:</h4>
          <pre class="text-sm text-gray-700 whitespace-pre-wrap">{{ selectedPrompt.content }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { usePromptsStore } from '../stores/prompts'
import api from '../services/api'

const store = usePromptsStore()

// 响应式数据
const selectedPromptId = ref('')
const selectedPrompt = ref(null)
const messages = ref([])
const userInput = ref('')
const isLoading = ref(false)
const showPromptDetail = ref(false)
const messagesContainer = ref(null)

// 计算属性
const availablePrompts = computed(() => {
  // 获取本地缓存的提示词和后端提示词
  const localPrompts = store.localPrompts || []
  const backendPrompts = store.prompts || []
  
  // 合并并去重
  const allPrompts = [...localPrompts, ...backendPrompts]
  const uniquePrompts = allPrompts.filter((prompt, index, self) => 
    index === self.findIndex(p => p.id === prompt.id)
  )
  
  return uniquePrompts
})

// 方法
function onPromptChange() {
  if (selectedPromptId.value) {
    selectedPrompt.value = availablePrompts.value.find(p => p.id === selectedPromptId.value)
    // 清空之前的对话
    messages.value = []
  } else {
    selectedPrompt.value = null
  }
}

async function sendMessage() {
  if (!userInput.value.trim() || !selectedPrompt.value || isLoading.value) return

  const userMessage = {
    id: Date.now(),
    role: 'user',
    content: userInput.value.trim(),
    timestamp: new Date()
  }

  messages.value.push(userMessage)
  const currentInput = userInput.value.trim()
  userInput.value = ''
  isLoading.value = true

  try {
    // 构建完整的提示词内容
    const fullPrompt = `${selectedPrompt.value.content}\n\n用户问题: ${currentInput}`
    
    const response = await api.chatWithAI({
      prompt: fullPrompt,
      promptId: selectedPrompt.value.id,
      promptTitle: selectedPrompt.value.title
    })

    const aiMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: response.data.response,
      timestamp: new Date()
    }

    messages.value.push(aiMessage)
  } catch (error) {
    console.error('AI对话失败:', error)
    const errorMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: '抱歉，AI服务暂时不可用，请稍后再试。',
      timestamp: new Date()
    }
    messages.value.push(errorMessage)
  } finally {
    isLoading.value = false
    await nextTick()
    scrollToBottom()
  }
}

function clearChat() {
  messages.value = []
}

function saveChat() {
  if (messages.value.length === 0) return
  
  const chatData = {
    promptId: selectedPrompt.value.id,
    promptTitle: selectedPrompt.value.title,
    messages: messages.value,
    timestamp: new Date().toISOString()
  }
  
  // 保存到本地存储
  const savedChats = JSON.parse(localStorage.getItem('ai_chat_history') || '[]')
  savedChats.unshift(chatData)
  
  // 只保留最近50条对话记录
  if (savedChats.length > 50) {
    savedChats.splice(50)
  }
  
  localStorage.setItem('ai_chat_history', JSON.stringify(savedChats))
  
  // 显示成功提示
  store.showSuccess('对话已保存到本地')
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 生命周期
onMounted(async () => {
  // 加载提示词数据
  await store.fetchPrompts()
  await store.loadLocalPrompts()
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
