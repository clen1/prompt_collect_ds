<template>
  <div class="ai-assistant">
    <!-- 主要工作区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- 左侧：输入区域 -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">AI 生成设置</h3>
          <div class="flex items-center space-x-2">
            <button
              @click="showHistory = !showHistory"
              class="text-sm text-blue-600 hover:text-blue-700"
            >
              {{ showHistory ? '隐藏历史' : '查看历史' }}
            </button>
          </div>
        </div>

        <div class="card-body space-y-4">
          <!-- 模型选择 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">选择模型</label>
            <div class="flex space-x-4">
              <label class="flex items-center">
                <input
                  type="radio"
                  v-model="selectedModel"
                  value="deepseek-chat"
                  class="mr-2"
                />
                <span>deepseek-chat（标准）</span>
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  v-model="selectedModel"
                  value="deepseek-reasoner"
                  class="mr-2"
                />
                <span>deepseek-reasoner（高级推理）</span>
              </label>
            </div>
          </div>

          <!-- 功能选择 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">功能选择</label>
            <div class="flex space-x-2">
              <button
                @click="activeTab = 'generate'"
                :class="[
                  'px-3 py-2 rounded-lg transition-colors text-sm',
                  activeTab === 'generate'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                生成提示词
              </button>
              <button
                @click="activeTab = 'optimize'"
                :class="[
                  'px-3 py-2 rounded-lg transition-colors text-sm',
                  activeTab === 'optimize'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                优化提示词
              </button>
            </div>
          </div>

          <!-- 生成提示词 -->
          <div v-if="activeTab === 'generate'" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                需求描述 <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="generateForm.description"
                rows="6"
                class="input"
                placeholder="请详细描述您需要的提示词功能，例如：&#10;- 帮助用户写作文的提示词&#10;- 翻译英文的提示词&#10;- 代码审查助手&#10;- 创意写作指导等..."
              ></textarea>
            </div>

            <button
              @click="generatePrompt"
              :disabled="!generateForm.description.trim() || loading"
              class="btn btn-primary w-full"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                AI 生成中...
              </span>
              <span v-else>🤖 生成提示词</span>
            </button>
          </div>

          <!-- 优化提示词 -->
          <div v-if="activeTab === 'optimize'" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                原提示词 <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="optimizeForm.prompt"
                rows="4"
                class="input"
                placeholder="请输入需要优化的提示词内容..."
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                优化要求（可选）
              </label>
              <textarea
                v-model="optimizeForm.requirements"
                rows="3"
                class="input"
                placeholder="请描述优化要求，例如：&#10;- 使语言更简洁明了&#10;- 增加创意性和趣味性&#10;- 提高专业性和准确性&#10;- 适合特定场景使用等..."
              ></textarea>
            </div>

            <button
              @click="optimizePrompt"
              :disabled="!optimizeForm.prompt.trim() || loading"
              class="btn btn-primary w-full"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                AI 优化中...
              </span>
              <span v-else>✨ 优化提示词</span>
            </button>
          </div>

          <!-- 错误信息 -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3">
            <div class="flex">
              <svg class="w-5 h-5 text-red-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 class="text-sm font-medium text-red-800">操作失败</h4>
                <p class="text-sm text-red-700 mt-1">{{ error }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：预览和编辑区域 -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">提示词预览</h3>
          <div class="flex items-center space-x-2" v-if="currentTemplate">
            <button
              @click="saveTemplate"
              :disabled="saving"
              class="btn btn-primary btn-sm"
            >
              {{ saving ? '保存中...' : '💾 保存为模板' }}
            </button>
            <button
              @click="resetTemplate"
              class="btn btn-secondary btn-sm"
            >
              🔄 重置
            </button>
          </div>
        </div>

        <div class="card-body">
          <div v-if="!currentTemplate" class="text-center py-12 text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p class="text-lg font-medium mb-2">等待 AI 生成</p>
            <p class="text-sm">在左侧输入需求描述，AI 将为您生成完整的提示词模板</p>
          </div>

          <div v-else class="space-y-4">
            <!-- 标题 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">标题</label>
              <input
                v-model="currentTemplate.title"
                type="text"
                class="input"
                placeholder="提示词标题"
              />
            </div>

            <!-- 描述 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">描述</label>
              <textarea
                v-model="currentTemplate.description"
                rows="2"
                class="input"
                placeholder="提示词描述"
              ></textarea>
            </div>

            <!-- 分类 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">分类</label>
              <input
                v-model="currentTemplate.category"
                type="text"
                class="input"
                placeholder="提示词分类"
              />
            </div>

            <!-- 提示词内容 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">提示词内容</label>
              <textarea
                v-model="currentTemplate.content"
                rows="8"
                class="input"
                placeholder="提示词内容"
              ></textarea>
            </div>

            <!-- 标签 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">标签</label>
              <div class="flex flex-wrap gap-2 mb-2">
                <span
                  v-for="(tag, index) in currentTemplate.tags"
                  :key="index"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                >
                  {{ tag }}
                  <button
                    @click="removeTag(index)"
                    class="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              </div>
              <div class="flex">
                <input
                  v-model="newTag"
                  @keyup.enter="addTag"
                  type="text"
                  class="input flex-1 mr-2"
                  placeholder="添加标签，按回车确认"
                />
                <button
                  @click="addTag"
                  class="btn btn-secondary btn-sm"
                >
                  添加
                </button>
              </div>
            </div>

            <!-- AI 生成信息 -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div class="flex items-center text-sm text-blue-700">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>由 {{ currentTemplate.model || selectedModel }} 生成</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 历史记录区域 -->
    <div v-if="showHistory" class="card">
      <div class="card-header">
        <h3 class="card-title">生成历史</h3>
        <div class="flex items-center space-x-2">
          <button
            @click="loadHistory"
            class="text-sm text-blue-600 hover:text-blue-700"
          >
            🔄 刷新
          </button>
          <button
            @click="clearHistory"
            class="text-sm text-red-600 hover:text-red-700"
          >
            🗑️ 清空
          </button>
        </div>
      </div>

      <div class="card-body">
        <div v-if="historyLoading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-gray-500">加载历史记录...</p>
        </div>

        <div v-else-if="history.length === 0" class="text-center py-8 text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>暂无生成历史</p>
        </div>

        <div v-else class="space-y-4 max-h-96 overflow-y-auto">
          <div
            v-for="record in history"
            :key="record.id"
            class="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
          >
            <div class="flex items-start justify-between mb-2">
              <div class="flex items-center space-x-2">
                <span
                  :class="[
                    'px-2 py-1 text-xs rounded-full',
                    record.type === 'generate'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  ]"
                >
                  {{ record.type === 'generate' ? '🤖 生成' : '✨ 优化' }}
                </span>
                <span class="text-xs text-gray-500">{{ record.model }}</span>
                <span class="text-xs text-gray-500">{{ formatTime(record.timestamp) }}</span>
              </div>
              <div class="flex space-x-2">
                <button
                  @click="useHistoryRecord(record)"
                  class="text-xs text-blue-600 hover:text-blue-700"
                  title="使用此记录"
                >
                  📋 使用
                </button>
                <button
                  @click="deleteHistoryRecord(record.id)"
                  class="text-xs text-red-600 hover:text-red-700"
                  title="删除记录"
                >
                  🗑️
                </button>
              </div>
            </div>

            <div class="text-sm text-gray-600 mb-2">
              <strong>输入:</strong> {{ record.input }}
            </div>

            <div class="text-sm">
              <strong>标题:</strong> {{ record.output.title }}
            </div>
            <div class="text-xs text-gray-500 mt-1 line-clamp-2">
              {{ record.output.content }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 使用说明 -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">使用说明</h3>
      </div>
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="text-sm font-medium text-gray-800 mb-2">🤖 生成提示词</h4>
            <ul class="text-sm text-gray-600 space-y-1">
              <li>• 详细描述您的需求</li>
              <li>• AI 将生成完整的提示词模板</li>
              <li>• 包含标题、描述、分类、内容和标签</li>
              <li>• 可在右侧预览区域编辑调整</li>
            </ul>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-800 mb-2">✨ 优化提示词</h4>
            <ul class="text-sm text-gray-600 space-y-1">
              <li>• 输入现有的提示词内容</li>
              <li>• 可选择性添加优化要求</li>
              <li>• AI 将改进提示词的表达和效果</li>
              <li>• 保持原意的同时提升质量</li>
            </ul>
          </div>
        </div>
        <div class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="text-sm text-yellow-800">
              <strong>模型选择建议：</strong>
              <p class="mt-1">• <strong>deepseek-chat：</strong>适合一般对话和文本生成任务，响应速度快</p>
              <p>• <strong>deepseek-reasoner：</strong>适合需要复杂推理的任务，生成质量更高</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 响应式数据
const activeTab = ref('generate')
const selectedModel = ref('deepseek-chat')
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const showHistory = ref(false)
const historyLoading = ref(false)

// 当前模板数据
const currentTemplate = ref(null)
const newTag = ref('')

// 历史记录
const history = ref([])

const generateForm = ref({
  description: ''
})

const optimizeForm = ref({
  prompt: '',
  requirements: ''
})

// 方法
async function generatePrompt() {
  if (!generateForm.value.description.trim()) {
    error.value = '请输入需求描述'
    return
  }

  loading.value = true
  error.value = ''
  currentTemplate.value = null

  try {
    const response = await fetch('/api/ai/generate-prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description: generateForm.value.description,
        model: selectedModel.value
      })
    })

    const data = await response.json()

    if (data.success && data.template) {
      currentTemplate.value = {
        ...data.template,
        model: data.model,
        tags: data.template.tags || []
      }
      // 刷新历史记录
      if (showHistory.value) {
        await loadHistory()
      }
    } else {
      error.value = data.error || 'AI生成失败'
    }
  } catch (err) {
    error.value = '请求失败: ' + err.message
  } finally {
    loading.value = false
  }
}

async function optimizePrompt() {
  if (!optimizeForm.value.prompt.trim()) {
    error.value = '请输入要优化的提示词'
    return
  }

  loading.value = true
  error.value = ''
  currentTemplate.value = null

  try {
    const response = await fetch('/api/ai/optimize-prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: optimizeForm.value.prompt,
        requirements: optimizeForm.value.requirements,
        model: selectedModel.value
      })
    })

    const data = await response.json()

    if (data.success) {
      // 对于优化功能，创建一个模板结构
      currentTemplate.value = {
        title: "优化后的提示词",
        description: "由AI优化的提示词",
        category: "优化",
        content: data.content,
        tags: ["AI优化"],
        model: data.model
      }
      // 刷新历史记录
      if (showHistory.value) {
        await loadHistory()
      }
    } else {
      error.value = data.error || 'AI优化失败'
    }
  } catch (err) {
    error.value = '请求失败: ' + err.message
  } finally {
    loading.value = false
  }
}

// 标签管理
function addTag() {
  if (newTag.value.trim() && !currentTemplate.value.tags.includes(newTag.value.trim())) {
    currentTemplate.value.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}

function removeTag(index) {
  currentTemplate.value.tags.splice(index, 1)
}

// 保存模板
async function saveTemplate() {
  if (!currentTemplate.value) return

  saving.value = true
  error.value = ''

  try {
    const response = await fetch('/api/admin/prompts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: currentTemplate.value.title,
        content: currentTemplate.value.content,
        description: currentTemplate.value.description,
        categoryName: currentTemplate.value.category, // 使用分类名称，后端会自动创建
        tags: currentTemplate.value.tags,
        isPublished: true
      })
    })

    const data = await response.json()

    if (data.success) {
      // 成功提示
      alert(`保存成功！${data.message || ''}`)
      // 可以跳转到提示词管理页面
      router.push('/prompts')
    } else {
      error.value = data.error || '保存失败'
    }
  } catch (err) {
    error.value = '保存失败: ' + err.message
  } finally {
    saving.value = false
  }
}

// 重置模板
function resetTemplate() {
  currentTemplate.value = null
  error.value = ''
}

// 历史记录管理
async function loadHistory() {
  historyLoading.value = true
  try {
    const response = await fetch('/api/ai/history')
    const data = await response.json()
    history.value = data || []
  } catch (err) {
    console.error('加载历史失败:', err)
  } finally {
    historyLoading.value = false
  }
}

async function clearHistory() {
  if (!confirm('确定要清空所有历史记录吗？')) return

  try {
    await fetch('/api/ai/history', { method: 'DELETE' })
    history.value = []
  } catch (err) {
    error.value = '清空历史失败'
  }
}

async function deleteHistoryRecord(id) {
  try {
    await fetch(`/api/ai/history/${id}`, { method: 'DELETE' })
    history.value = history.value.filter(record => record.id !== id)
  } catch (err) {
    error.value = '删除记录失败'
  }
}

function useHistoryRecord(record) {
  currentTemplate.value = {
    ...record.output,
    model: record.model
  }
}

// 时间格式化
function formatTime(timestamp) {
  return new Date(timestamp).toLocaleString('zh-CN')
}

// 生命周期
onMounted(() => {
  loadHistory()
})
</script>

<style scoped>
.ai-assistant {
  width: 100%;
}

.input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  resize: vertical;
}

.input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.15s ease-in-out;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

.card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.card-header {
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-body {
  padding: 1.5rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

/* 文本截断 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .ai-assistant {
    padding: 1rem;
  }

  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
}

/* 动画效果 */
.card {
  transition: all 0.2s ease-in-out;
}

.card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* 标签样式 */
.inline-flex.items-center {
  transition: all 0.15s ease-in-out;
}

.inline-flex.items-center:hover {
  transform: scale(1.05);
}
</style>
