<template>
  <div class="space-y-6">
    <!-- 页面标题和操作按钮 -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-admin-900">公告管理</h1>
        <p class="mt-1 text-sm text-admin-600">发布和管理系统公告</p>
      </div>
      <div class="flex items-center space-x-3">
        <button
          @click="exportAnnouncements"
          class="btn btn-secondary flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>导出公告</span>
        </button>
        <button
          @click="showCreateModal = true"
          class="btn btn-primary flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>发布公告</span>
        </button>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="card">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-admin-700 mb-2">搜索公告</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索标题或内容..."
            class="input"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-admin-700 mb-2">类型筛选</label>
          <select v-model="typeFilter" class="input">
            <option value="">所有类型</option>
            <option value="info">信息</option>
            <option value="warning">警告</option>
            <option value="success">成功</option>
            <option value="error">错误</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-admin-700 mb-2">状态筛选</label>
          <select v-model="statusFilter" class="input">
            <option value="">所有状态</option>
            <option value="published">已发布</option>
            <option value="draft">草稿</option>
          </select>
        </div>
      </div>

      <div class="mt-4 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <span class="text-sm text-admin-500">
            共 {{ filteredAnnouncements.length }} 个公告
          </span>
          <button
            v-if="searchQuery || typeFilter || statusFilter"
            @click="clearFilters"
            class="text-sm text-primary-600 hover:text-primary-700"
          >
            清除筛选
          </button>
        </div>

        <div v-if="selectedAnnouncements.length > 0" class="flex items-center space-x-2">
          <span class="text-sm text-admin-500">已选择 {{ selectedAnnouncements.length }} 项</span>
          <button
            @click="batchDelete"
            class="btn btn-danger btn-sm"
          >
            批量删除
          </button>
        </div>
      </div>
    </div>

    <!-- 公告列表 -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-admin-200">
          <thead class="bg-admin-50">
            <tr>
              <th class="w-12 px-4 py-3 text-left text-xs font-medium text-admin-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  v-model="selectAll"
                  @change="toggleSelectAll"
                  class="rounded border-admin-300 text-primary-600 focus:ring-primary-500"
                />
              </th>
              <th class="w-2/5 px-4 py-3 text-left text-xs font-medium text-admin-500 uppercase tracking-wider">
                公告信息
              </th>
              <th class="w-20 px-4 py-3 text-left text-xs font-medium text-admin-500 uppercase tracking-wider">
                类型
              </th>
              <th class="w-20 px-4 py-3 text-left text-xs font-medium text-admin-500 uppercase tracking-wider">
                状态
              </th>
              <th class="w-28 px-4 py-3 text-left text-xs font-medium text-admin-500 uppercase tracking-wider">
                创建时间
              </th>
              <th class="w-28 px-4 py-3 text-left text-xs font-medium text-admin-500 uppercase tracking-wider">
                更新时间
              </th>
              <th class="w-32 px-4 py-3 text-left text-xs font-medium text-admin-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-admin-200">
            <tr v-if="loading" class="text-center">
              <td colspan="7" class="px-4 py-8">
                <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                <p class="mt-2 text-sm text-admin-500">加载中...</p>
              </td>
            </tr>
            <tr v-else-if="filteredAnnouncements.length === 0" class="text-center">
              <td colspan="7" class="px-4 py-8">
                <svg class="mx-auto h-12 w-12 text-admin-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0v10a2 2 0 002 2h8a2 2 0 002-2V8M9 12h6" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-admin-900">暂无公告</h3>
                <p class="mt-1 text-sm text-admin-500">开始发布您的第一个公告吧</p>
              </td>
            </tr>
            <tr v-else v-for="announcement in filteredAnnouncements" :key="announcement.id" class="hover:bg-admin-50">
              <td class="px-4 py-4">
                <input
                  type="checkbox"
                  v-model="selectedAnnouncements"
                  :value="announcement.id"
                  class="rounded border-admin-300 text-primary-600 focus:ring-primary-500"
                />
              </td>
              <td class="px-4 py-4">
                <div class="space-y-1">
                  <div class="text-sm font-medium text-admin-900 truncate" :title="announcement.title">
                    {{ announcement.title }}
                  </div>
                  <div class="text-xs text-admin-500 line-clamp-2 leading-relaxed" :title="announcement.content">
                    {{ announcement.content }}
                  </div>
                </div>
              </td>
              <td class="px-4 py-4">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getTypeClass(announcement.type)"
                >
                  {{ getTypeText(announcement.type) }}
                </span>
              </td>
              <td class="px-4 py-4">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="announcement.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                >
                  {{ announcement.isPublished ? '已发布' : '草稿' }}
                </span>
              </td>
              <td class="px-4 py-4 text-xs text-admin-500">
                {{ formatDate(announcement.createdAt) }}
              </td>
              <td class="px-4 py-4 text-xs text-admin-500">
                <span v-if="announcement.updatedAt && announcement.updatedAt !== announcement.createdAt">
                  {{ formatDate(announcement.updatedAt) }}
                </span>
                <span v-else class="text-admin-300">-</span>
              </td>
              <td class="px-4 py-4">
                <div class="flex items-center space-x-1">
                  <button
                    @click="viewAnnouncement(announcement)"
                    class="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                    title="查看详情"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    @click="editAnnouncement(announcement)"
                    class="p-1 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded transition-colors"
                    title="编辑"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    v-if="!announcement.isPublished"
                    @click="publishAnnouncement(announcement)"
                    class="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                    title="发布"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                  <button
                    v-else
                    @click="unpublishAnnouncement(announcement)"
                    class="p-1 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded transition-colors"
                    title="取消发布"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18 12M6 6l12 12" />
                    </svg>
                  </button>
                  <button
                    @click="deleteAnnouncement(announcement)"
                    class="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    title="删除"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 创建/编辑公告模态框 -->
    <AnnouncementModal
      v-if="showCreateModal || showEditModal"
      :announcement="editingAnnouncement"
      @save="saveAnnouncement"
      @close="closeModal"
    />

    <!-- 查看公告详情模态框 -->
    <AnnouncementDetailModal
      v-if="showDetailModal"
      :announcement="selectedAnnouncement"
      @close="showDetailModal = false"
      @edit="editFromDetail"
    />

    <!-- 成功提示 -->
    <div
      v-if="showSuccessMessage"
      class="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50 max-w-sm"
    >
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span class="text-sm">{{ successMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '../stores/admin'
import { format } from 'date-fns'
import AnnouncementModal from '../components/AnnouncementModal.vue'
import AnnouncementDetailModal from '../components/AnnouncementDetailModal.vue'

const store = useAdminStore()

// 响应式数据
const searchQuery = ref('')
const typeFilter = ref('')
const statusFilter = ref('')
const selectedAnnouncements = ref([])
const selectAll = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDetailModal = ref(false)
const editingAnnouncement = ref(null)
const selectedAnnouncement = ref(null)
const showSuccessMessage = ref(false)
const successMessage = ref('')

// 计算属性
const announcements = computed(() => store.announcements)
const loading = computed(() => store.loading)

const filteredAnnouncements = computed(() => {
  let filtered = announcements.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(announcement =>
      announcement.title.toLowerCase().includes(query) ||
      announcement.content.toLowerCase().includes(query)
    )
  }

  if (typeFilter.value) {
    filtered = filtered.filter(announcement => announcement.type === typeFilter.value)
  }

  if (statusFilter.value) {
    if (statusFilter.value === 'published') {
      filtered = filtered.filter(announcement => announcement.isPublished)
    } else if (statusFilter.value === 'draft') {
      filtered = filtered.filter(announcement => !announcement.isPublished)
    }
  }

  return filtered
})

// 方法
function clearFilters() {
  searchQuery.value = ''
  typeFilter.value = ''
  statusFilter.value = ''
}

function toggleSelectAll() {
  if (selectAll.value) {
    selectedAnnouncements.value = filteredAnnouncements.value.map(a => a.id)
  } else {
    selectedAnnouncements.value = []
  }
}

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

function formatDate(dateString) {
  return format(new Date(dateString), 'MM-dd HH:mm')
}

function viewAnnouncement(announcement) {
  selectedAnnouncement.value = announcement
  showDetailModal.value = true
}

function editAnnouncement(announcement) {
  editingAnnouncement.value = { ...announcement }
  showEditModal.value = true
}

function editFromDetail(announcement) {
  showDetailModal.value = false
  editAnnouncement(announcement)
}

async function publishAnnouncement(announcement) {
  try {
    const updatedAnnouncement = await store.updateAnnouncement(announcement.id, { isPublished: true })
    console.log('发布成功，更新后的公告:', updatedAnnouncement)
    showMessage('公告已发布')
  } catch (error) {
    console.error('发布失败:', error)
    showMessage('发布失败，请重试')
  }
}

async function unpublishAnnouncement(announcement) {
  if (confirm('确定要取消发布此公告吗？')) {
    try {
      const updatedAnnouncement = await store.updateAnnouncement(announcement.id, { isPublished: false })
      console.log('取消发布成功，更新后的公告:', updatedAnnouncement)
      showMessage('已取消发布')
    } catch (error) {
      console.error('操作失败:', error)
      showMessage('操作失败，请重试')
    }
  }
}

async function deleteAnnouncement(announcement) {
  if (confirm(`确定要删除公告"${announcement.title}"吗？`)) {
    try {
      await store.deleteAnnouncement(announcement.id)
      showMessage('公告已删除')
    } catch (error) {
      console.error('删除失败:', error)
      showMessage('删除失败，请重试')
    }
  }
}

async function batchDelete() {
  if (confirm(`确定要删除选中的 ${selectedAnnouncements.value.length} 个公告吗？`)) {
    try {
      await store.batchDeleteAnnouncements(selectedAnnouncements.value)
      selectedAnnouncements.value = []
      selectAll.value = false
      showMessage('批量删除成功')
    } catch (error) {
      console.error('批量删除失败:', error)
      showMessage('批量删除失败，请重试')
    }
  }
}

async function saveAnnouncement(announcementData) {
  try {
    if (editingAnnouncement.value) {
      await store.updateAnnouncement(editingAnnouncement.value.id, announcementData)
      showMessage('公告已更新')
    } else {
      await store.createAnnouncement(announcementData)
      showMessage('公告已创建')
    }
    closeModal()
  } catch (error) {
    console.error('保存失败:', error)
    showMessage('保存失败，请重试')
  }
}

function closeModal() {
  showCreateModal.value = false
  showEditModal.value = false
  editingAnnouncement.value = null
}

async function exportAnnouncements() {
  try {
    const exportData = {
      announcements: filteredAnnouncements.value,
      exportDate: new Date().toISOString(),
      totalCount: filteredAnnouncements.value.length
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `announcements_export_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    showMessage('数据导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    showMessage('导出失败，请重试')
  }
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
  await store.fetchAnnouncements()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
}

/* 确保表格布局固定 */
table {
  table-layout: fixed;
  width: 100%;
}

/* 表格单元格垂直对齐 */
td {
  vertical-align: top;
}

/* 紧凑的行间距 */
.space-y-1 > * + * {
  margin-top: 0.25rem;
}

/* 表格行悬停效果 */
tbody tr:hover {
  background-color: #f8fafc;
}

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
