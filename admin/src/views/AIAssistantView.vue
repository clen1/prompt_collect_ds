<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-admin-900">AI 提示词助手</h2>
        <p class="mt-1 text-sm text-admin-600">使用 DeepSeek AI 智能生成和优化提示词</p>
      </div>
      <div class="flex items-center space-x-3">
        <div class="flex items-center space-x-2 text-sm text-admin-600">
          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>DeepSeek API 已连接</span>
        </div>
        <button
          @click="clearAllHistory"
          class="btn btn-secondary flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>清空历史</span>
        </button>
      </div>
    </div>

    <!-- AI助手组件 -->
    <AIAssistant />

    <!-- 最近生成记录 -->
    <div class="card">
      <div class="px-6 py-4 border-b border-admin-200 flex justify-between items-center">
        <h3 class="text-lg font-semibold text-admin-900">最近生成记录</h3>
        <button
          @click="viewAllHistory"
          class="btn btn-secondary btn-sm"
        >
          查看全部
        </button>
      </div>
      <div class="p-6">
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-admin-500">加载中...</p>
        </div>
        <div v-else-if="recentRecords.length === 0" class="text-center py-8 text-admin-500">
          <svg class="w-12 h-12 mx-auto mb-4 text-admin-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>暂无生成记录</p>
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="record in recentRecords"
            :key="record.id"
            class="border border-admin-200 rounded-lg p-4 hover:border-admin-300 transition-colors"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-2">
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
                  <span class="text-xs text-admin-500">{{ record.model }}</span>
                  <span class="text-xs text-admin-500">{{ formatTime(record.timestamp) }}</span>
                </div>
                <div class="text-sm text-admin-600 mb-2">
                  <strong>输入:</strong> {{ record.input }}
                </div>
                <div class="text-sm text-admin-800 bg-admin-50 p-3 rounded">
                  <strong>标题:</strong> {{ record.output.title }}<br>
                  <span class="text-xs text-admin-600 line-clamp-2">{{ record.output.content }}</span>
                </div>
              </div>
              <div class="ml-4 flex space-x-2">
                <button
                  @click="copyText(record.output.content)"
                  class="p-1 text-admin-400 hover:text-admin-600 hover:bg-admin-100 rounded transition-colors"
                  title="复制内容"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AIAssistant from '../components/AIAssistant.vue'

// 响应式数据
const recentRecords = ref([])
const loading = ref(false)

// 方法
function formatTime(timestamp) {
  return new Date(timestamp).toLocaleString('zh-CN')
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    // 这里可以添加成功提示
    console.log('复制成功')
  } catch (err) {
    console.error('复制失败:', err)
  }
}

async function clearAllHistory() {
  if (!confirm('确定要清空所有AI生成历史记录吗？此操作不可恢复！')) return

  try {
    await fetch('/api/ai/history', { method: 'DELETE' })
    recentRecords.value = []
    // 可以添加成功提示
    console.log('历史记录已清空')
  } catch (err) {
    console.error('清空历史失败:', err)
  }
}

function viewAllHistory() {
  // 这里可以实现查看全部历史的功能
  // 比如打开一个模态框或跳转到专门的历史页面
  console.log('查看全部历史记录')
}

// 加载最近的AI生成记录
async function loadRecentRecords() {
  loading.value = true
  try {
    const response = await fetch('/api/ai/history')
    const data = await response.json()
    // 只取最近两条记录
    recentRecords.value = (data || []).slice(0, 2)
  } catch (err) {
    console.error('加载最近记录失败:', err)
    recentRecords.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadRecentRecords()
})
</script>

<style scoped>
/* 使用全局样式，只添加必要的自定义样式 */
</style>
