<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-admin-900">操作日志</h2>
        <p class="mt-1 text-sm text-admin-600">查看系统操作记录和用户活动</p>
      </div>
      <div class="flex items-center space-x-3">
        <button
          @click="refreshLogs"
          class="btn btn-secondary flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>刷新</span>
        </button>
        <button
          @click="exportLogs"
          class="btn btn-primary flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>导出日志</span>
        </button>
      </div>
    </div>

    <!-- 筛选条件 -->
    <div class="card">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-admin-700 mb-2">操作类型</label>
          <select v-model="actionFilter" class="input">
            <option value="">所有操作</option>
            <optgroup label="基础操作">
              <option value="create">创建</option>
              <option value="update">更新</option>
              <option value="delete">删除</option>
              <option value="login">登录</option>
              <option value="logout">登出</option>
            </optgroup>
            <optgroup label="提示词操作">
              <option value="CREATE_PROMPT">创建提示词</option>
              <option value="UPDATE_PROMPT">更新提示词</option>
              <option value="DELETE_PROMPT">删除提示词</option>
              <option value="USE_PROMPT">使用提示词</option>
              <option value="BATCH_DELETE_PROMPTS">批量删除</option>
            </optgroup>
            <optgroup label="分类操作">
              <option value="CREATE_CATEGORY">创建分类</option>
              <option value="UPDATE_CATEGORY">更新分类</option>
              <option value="DELETE_CATEGORY">删除分类</option>
            </optgroup>
            <optgroup label="公告操作">
              <option value="CREATE_ANNOUNCEMENT">创建公告</option>
              <option value="UPDATE_ANNOUNCEMENT">更新公告</option>
              <option value="DELETE_ANNOUNCEMENT">删除公告</option>
              <option value="BATCH_DELETE_ANNOUNCEMENTS">批量删除公告</option>
            </optgroup>
            <optgroup label="AI操作">
              <option value="AI_GENERATE_PROMPT">AI生成</option>
              <option value="AI_OPTIMIZE_PROMPT">AI优化</option>
            </optgroup>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-admin-700 mb-2">资源类型</label>
          <select v-model="resourceFilter" class="input">
            <option value="">所有资源</option>
            <option value="prompt">提示词</option>
            <option value="category">分类</option>
            <option value="announcement">公告</option>
            <option value="user">用户</option>
            <option value="system">系统</option>
            <option value="ai">AI助手</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-admin-700 mb-2">开始日期</label>
          <input
            v-model="startDate"
            type="date"
            class="input"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-admin-700 mb-2">结束日期</label>
          <input
            v-model="endDate"
            type="date"
            class="input"
          />
        </div>
      </div>
      <div class="mt-4 flex items-center justify-between">
        <span class="text-sm text-admin-500">
          共 {{ filteredLogs.length }} 条记录
        </span>
        <button
          v-if="hasFilters"
          @click="clearFilters"
          class="text-sm text-primary-600 hover:text-primary-700"
        >
          清除筛选
        </button>
      </div>
    </div>

    <!-- 日志列表 -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>时间</th>
              <th>用户</th>
              <th>操作</th>
              <th>资源</th>
              <th>详情</th>
              <th>IP地址</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-admin-200">
            <tr v-if="loading" class="text-center">
              <td colspan="7" class="py-12">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <p class="mt-2 text-admin-500">加载中...</p>
              </td>
            </tr>
            <tr v-else-if="filteredLogs.length === 0" class="text-center">
              <td colspan="7" class="py-12 text-admin-500">
                暂无日志记录
              </td>
            </tr>
            <tr v-else v-for="log in paginatedLogs" :key="log.id" class="hover:bg-admin-50">
              <td class="text-sm text-admin-900">
                {{ formatDate(log.createdAt) }}
              </td>
              <td>
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center mr-2">
                    <span class="text-white text-xs font-medium">
                      {{ log.user?.username?.charAt(0).toUpperCase() || 'S' }}
                    </span>
                  </div>
                  <span class="text-sm text-admin-900">{{ log.user?.username || 'System' }}</span>
                </div>
              </td>
              <td>
                <span
                  class="badge"
                  :class="getActionBadgeClass(log.action)"
                >
                  {{ getActionText(log.action) }}
                </span>
              </td>
              <td class="text-sm text-admin-900">
                {{ getResourceText(log.resource) }}
              </td>
              <td class="text-sm text-admin-600 max-w-xs truncate">
                {{ log.details }}
              </td>
              <td class="text-sm text-admin-500">
                {{ log.ipAddress }}
              </td>
              <td>
                <span
                  class="badge"
                  :class="log.status === 'success' ? 'badge-success' : 'badge-danger'"
                >
                  {{ log.status === 'success' ? '成功' : '失败' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="mt-6 flex items-center justify-between">
        <div class="text-sm text-admin-500">
          显示第 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, filteredLogs.length) }} 条，共 {{ filteredLogs.length }} 条
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="btn btn-secondary btn-sm"
          >
            上一页
          </button>
          <span class="text-sm text-admin-600">
            第 {{ currentPage }} / {{ totalPages }} 页
          </span>
          <button
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="btn btn-secondary btn-sm"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '../stores/admin'
import { format } from 'date-fns'

const store = useAdminStore()

// 响应式数据
const actionFilter = ref('')
const resourceFilter = ref('')
const startDate = ref('')
const endDate = ref('')
const currentPage = ref(1)
const pageSize = ref(20)

// 计算属性
const loading = computed(() => store.loading)
const logs = computed(() => store.logs)

const hasFilters = computed(() => {
  return actionFilter.value || resourceFilter.value || startDate.value || endDate.value
})

const filteredLogs = computed(() => {
  let filtered = logs.value

  if (actionFilter.value) {
    filtered = filtered.filter(log => log.action === actionFilter.value)
  }

  if (resourceFilter.value) {
    filtered = filtered.filter(log => log.resource === resourceFilter.value)
  }

  if (startDate.value) {
    filtered = filtered.filter(log => new Date(log.createdAt) >= new Date(startDate.value))
  }

  if (endDate.value) {
    filtered = filtered.filter(log => new Date(log.createdAt) <= new Date(endDate.value + 'T23:59:59'))
  }

  return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const totalPages = computed(() => {
  return Math.ceil(filteredLogs.value.length / pageSize.value)
})

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredLogs.value.slice(start, end)
})

// 方法
function formatDate(dateString) {
  return format(new Date(dateString), 'yyyy-MM-dd HH:mm:ss')
}

function getActionText(action) {
  const actionMap = {
    create: '创建',
    update: '更新',
    delete: '删除',
    login: '登录',
    logout: '登出',
    view: '查看',
    export: '导出',
    AI_GENERATE_PROMPT: 'AI生成',
    AI_OPTIMIZE_PROMPT: 'AI优化',
    CREATE_PROMPT: '创建提示词',
    UPDATE_PROMPT: '更新提示词',
    DELETE_PROMPT: '删除提示词',
    USE_PROMPT: '使用提示词',
    BATCH_DELETE_PROMPTS: '批量删除',
    CREATE_CATEGORY: '创建分类',
    UPDATE_CATEGORY: '更新分类',
    DELETE_CATEGORY: '删除分类',
    CREATE_ANNOUNCEMENT: '创建公告',
    UPDATE_ANNOUNCEMENT: '更新公告',
    DELETE_ANNOUNCEMENT: '删除公告',
    BATCH_DELETE_ANNOUNCEMENTS: '批量删除公告'
  }
  return actionMap[action] || action
}

function getResourceText(resource) {
  const resourceMap = {
    prompt: '提示词',
    category: '分类',
    user: '用户',
    system: '系统',
    ai: 'AI助手',
    announcement: '公告'
  }
  return resourceMap[resource] || resource
}

function getActionBadgeClass(action) {
  const classMap = {
    create: 'badge-success',
    update: 'badge-info',
    delete: 'badge-danger',
    login: 'badge-success',
    logout: 'badge-warning',
    view: 'badge-info',
    export: 'badge-info',
    AI_GENERATE_PROMPT: 'badge-primary',
    AI_OPTIMIZE_PROMPT: 'badge-info',
    CREATE_PROMPT: 'badge-success',
    UPDATE_PROMPT: 'badge-info',
    DELETE_PROMPT: 'badge-danger',
    USE_PROMPT: 'badge-success',
    BATCH_DELETE_PROMPTS: 'badge-danger',
    CREATE_CATEGORY: 'badge-success',
    UPDATE_CATEGORY: 'badge-info',
    DELETE_CATEGORY: 'badge-danger',
    CREATE_ANNOUNCEMENT: 'badge-success',
    UPDATE_ANNOUNCEMENT: 'badge-info',
    DELETE_ANNOUNCEMENT: 'badge-danger',
    BATCH_DELETE_ANNOUNCEMENTS: 'badge-danger'
  }
  return classMap[action] || 'badge-info'
}

function clearFilters() {
  actionFilter.value = ''
  resourceFilter.value = ''
  startDate.value = ''
  endDate.value = ''
  currentPage.value = 1
}

async function exportLogs() {
  try {
    // 构建导出数据
    const exportData = {
      logs: filteredLogs.value,
      filters: {
        action: actionFilter.value,
        resource: resourceFilter.value,
        startDate: startDate.value,
        endDate: endDate.value
      },
      exportDate: new Date().toISOString(),
      totalCount: filteredLogs.value.length
    }

    // 创建下载链接
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `logs_export_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error('导出失败:', error)
  }
}

// 加载日志数据
async function loadLogs() {
  try {
    store.loading = true
    const response = await fetch('/api/admin/logs')
    const data = await response.json()

    // 转换数据格式以匹配前端期望的格式
    store.logs = data.map(log => ({
      id: log.id,
      action: log.action,
      resource: getResourceFromAction(log.action),
      details: log.details,
      user: { username: log.user || 'admin' },
      ipAddress: '127.0.0.1', // 模拟IP地址
      status: 'success',
      createdAt: log.timestamp
    }))
  } catch (error) {
    console.error('加载日志失败:', error)
    store.logs = []
  } finally {
    store.loading = false
  }
}

// 根据操作类型推断资源类型
function getResourceFromAction(action) {
  if (action.includes('AI_')) {
    return 'ai'
  } else if (action.includes('PROMPT')) {
    return 'prompt'
  } else if (action.includes('CATEGORY')) {
    return 'category'
  } else if (action.includes('ANNOUNCEMENT')) {
    return 'announcement'
  } else if (action.includes('USER')) {
    return 'user'
  }
  return 'system'
}

async function refreshLogs() {
  await loadLogs()
}

// 生命周期
onMounted(async () => {
  await loadLogs()
})
</script>
