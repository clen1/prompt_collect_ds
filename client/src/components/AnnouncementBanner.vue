<template>
  <div v-if="announcements.length > 0 || showRefreshButton" class="space-y-3 mb-6">
    <!-- 手动刷新按钮 -->
    <div v-if="showRefreshButton && announcements.length === 0" class="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-sm text-gray-600">暂无公告</span>
      </div>
      <button
        @click="manualRefresh"
        :disabled="refreshing"
        class="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
      >
        <svg
          class="w-4 h-4"
          :class="{ 'animate-spin': refreshing }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>{{ refreshing ? '刷新中...' : '刷新公告' }}</span>
      </button>
    </div>

    <!-- 公告列表 -->
    <div v-if="announcements.length > 0" class="space-y-3">
      <!-- 刷新按钮（当有公告时显示在右上角） -->
      <div class="flex justify-end">
        <button
          @click="manualRefresh"
          :disabled="refreshing"
          class="flex items-center space-x-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
          title="刷新公告"
        >
          <svg
            class="w-3 h-3"
            :class="{ 'animate-spin': refreshing }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{{ refreshing ? '刷新中' : '刷新' }}</span>
        </button>
      </div>
      <div
        v-for="announcement in announcements"
        :key="announcement.id"
        class="rounded-lg border-l-4 p-4 shadow-sm"
        :class="getBannerClass(announcement.type)"
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
        <div class="ml-3 flex-1">
          <h3 class="text-sm font-medium" :class="getTitleClass(announcement.type)">
            {{ announcement.title }}
          </h3>
          <div class="mt-2 text-sm" :class="getContentClass(announcement.type)">
            <p class="whitespace-pre-wrap">{{ announcement.content }}</p>
          </div>
          <div class="mt-2 text-xs" :class="getDateClass(announcement.type)">
            发布时间：{{ formatDate(announcement.createdAt) }}
          </div>
        </div>
        <div class="ml-4 flex-shrink-0">
          <button
            @click="dismissAnnouncement(announcement.id)"
            class="rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
            :class="getDismissClass(announcement.type)"
          >
            <span class="sr-only">关闭</span>
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const announcements = ref([])
const dismissedAnnouncements = ref(new Set())
const refreshing = ref(false)
const showRefreshButton = ref(true) // 总是显示刷新功能
let refreshInterval = null

// 从localStorage获取已关闭的公告
onMounted(async () => {
  const dismissed = localStorage.getItem('dismissedAnnouncements')
  if (dismissed) {
    dismissedAnnouncements.value = new Set(JSON.parse(dismissed))
  }

  await fetchAnnouncements()

  // 设置定期刷新（每5分钟刷新一次）
  refreshInterval = setInterval(fetchAnnouncements, 5 * 60 * 1000)
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})

async function fetchAnnouncements() {
  try {
    console.log('正在获取公告...')
    const response = await fetch('/api/announcements')
    console.log('公告API响应状态:', response.status)

    if (response.ok) {
      const data = await response.json()
      console.log('获取到的公告数据:', data)

      // 过滤掉已关闭的公告
      const filteredAnnouncements = data.filter(announcement =>
        !dismissedAnnouncements.value.has(announcement.id)
      )

      console.log('过滤后的公告:', filteredAnnouncements)
      announcements.value = filteredAnnouncements
    } else {
      console.error('获取公告失败，状态码:', response.status)
    }
  } catch (error) {
    console.error('获取公告失败:', error)
  }
}

// 手动刷新公告
async function manualRefresh() {
  refreshing.value = true
  try {
    await fetchAnnouncements()
    // 显示刷新成功的提示（可选）
    console.log('公告刷新成功')
  } catch (error) {
    console.error('手动刷新失败:', error)
  } finally {
    refreshing.value = false
  }
}

function dismissAnnouncement(id) {
  // 添加到已关闭列表
  dismissedAnnouncements.value.add(id)

  // 保存到localStorage
  localStorage.setItem('dismissedAnnouncements',
    JSON.stringify([...dismissedAnnouncements.value])
  )

  // 从显示列表中移除
  announcements.value = announcements.value.filter(announcement => announcement.id !== id)
}

function getBannerClass(type) {
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

function getDateClass(type) {
  const classes = {
    info: 'text-blue-600',
    warning: 'text-yellow-600',
    success: 'text-green-600',
    error: 'text-red-600'
  }
  return classes[type] || classes.info
}

function getDismissClass(type) {
  const classes = {
    info: 'text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:ring-blue-600',
    warning: 'text-yellow-400 hover:bg-yellow-200 hover:text-yellow-600 focus:ring-yellow-600',
    success: 'text-green-400 hover:bg-green-200 hover:text-green-600 focus:ring-green-600',
    error: 'text-red-400 hover:bg-red-200 hover:text-red-600 focus:ring-red-600'
  }
  return classes[type] || classes.info
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 暴露刷新方法供父组件调用
defineExpose({
  fetchAnnouncements,
  manualRefresh
})
</script>

<style scoped>
/* 动画效果 */
.announcement-enter-active,
.announcement-leave-active {
  transition: all 0.3s ease;
}

.announcement-enter-from,
.announcement-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
