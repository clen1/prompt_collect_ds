<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-admin-900">用户管理</h2>
        <p class="mt-1 text-sm text-admin-600">管理系统用户和权限</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="btn btn-primary flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>添加用户</span>
      </button>
    </div>

    <!-- 搜索和筛选 -->
    <div class="card">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-admin-700 mb-2">搜索用户</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索用户名、邮箱..."
            class="input"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-admin-700 mb-2">状态筛选</label>
          <select v-model="statusFilter" class="input">
            <option value="">所有状态</option>
            <option value="active">活跃</option>
            <option value="inactive">禁用</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-admin-700 mb-2">角色筛选</label>
          <select v-model="roleFilter" class="input">
            <option value="">所有角色</option>
            <option value="admin">管理员</option>
            <option value="user">普通用户</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 用户列表 -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  v-model="selectAll"
                  @change="toggleSelectAll"
                  class="rounded border-admin-300 text-primary-600 focus:ring-primary-500"
                />
              </th>
              <th>用户信息</th>
              <th>角色</th>
              <th>状态</th>
              <th>注册时间</th>
              <th>最后登录</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-admin-200">
            <tr v-if="loading" class="text-center">
              <td colspan="7" class="py-12">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <p class="mt-2 text-admin-500">加载中...</p>
              </td>
            </tr>
            <tr v-else-if="filteredUsers.length === 0" class="text-center">
              <td colspan="7" class="py-12 text-admin-500">
                暂无用户数据
              </td>
            </tr>
            <tr v-else v-for="user in filteredUsers" :key="user.id" class="hover:bg-admin-50">
              <td>
                <input
                  type="checkbox"
                  v-model="selectedUsers"
                  :value="user.id"
                  class="rounded border-admin-300 text-primary-600 focus:ring-primary-500"
                />
              </td>
              <td>
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center mr-3">
                    <span class="text-white text-sm font-medium">
                      {{ user.username.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-admin-900">{{ user.username }}</div>
                    <div class="text-sm text-admin-500">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td>
                <span
                  class="badge"
                  :class="user.role === 'admin' ? 'badge-warning' : 'badge-info'"
                >
                  {{ user.role === 'admin' ? '管理员' : '普通用户' }}
                </span>
              </td>
              <td>
                <span
                  class="badge"
                  :class="user.status === 'active' ? 'badge-success' : 'badge-danger'"
                >
                  {{ user.status === 'active' ? '活跃' : '禁用' }}
                </span>
              </td>
              <td class="text-sm text-admin-500">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="text-sm text-admin-500">
                {{ user.lastLoginAt ? formatDate(user.lastLoginAt) : '从未登录' }}
              </td>
              <td>
                <div class="flex items-center space-x-2">
                  <button
                    @click="editUser(user)"
                    class="text-primary-600 hover:text-primary-700"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="toggleUserStatus(user)"
                    :class="user.status === 'active' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'"
                  >
                    <svg v-if="user.status === 'active'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button
                    @click="deleteUser(user)"
                    class="text-red-600 hover:text-red-700"
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

      <!-- 批量操作 -->
      <div v-if="selectedUsers.length > 0" class="mt-4 flex items-center justify-between bg-admin-50 p-4 rounded-lg">
        <span class="text-sm text-admin-600">
          已选择 {{ selectedUsers.length }} 个用户
        </span>
        <div class="flex items-center space-x-2">
          <button
            @click="batchToggleStatus('active')"
            class="btn btn-success btn-sm"
          >
            批量启用
          </button>
          <button
            @click="batchToggleStatus('inactive')"
            class="btn btn-secondary btn-sm"
          >
            批量禁用
          </button>
          <button
            @click="batchDeleteUsers"
            class="btn btn-danger btn-sm"
          >
            批量删除
          </button>
        </div>
      </div>
    </div>

    <!-- 创建/编辑用户模态框 -->
    <UserModal
      v-if="showCreateModal || showEditModal"
      :user="editingUser"
      @save="saveUser"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '../stores/admin'
import { format } from 'date-fns'
import UserModal from '../components/UserModal.vue'

const store = useAdminStore()

// 响应式数据
const searchQuery = ref('')
const statusFilter = ref('')
const roleFilter = ref('')
const selectedUsers = ref([])
const selectAll = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingUser = ref(null)

// 计算属性
const loading = computed(() => store.loading)
const users = computed(() => store.users)

const filteredUsers = computed(() => {
  let filtered = users.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user =>
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(user => user.status === statusFilter.value)
  }

  if (roleFilter.value) {
    filtered = filtered.filter(user => user.role === roleFilter.value)
  }

  return filtered
})

// 方法
function formatDate(dateString) {
  return format(new Date(dateString), 'yyyy-MM-dd HH:mm')
}

function toggleSelectAll() {
  if (selectAll.value) {
    selectedUsers.value = filteredUsers.value.map(user => user.id)
  } else {
    selectedUsers.value = []
  }
}

function editUser(user) {
  editingUser.value = { ...user }
  showEditModal.value = true
}

async function deleteUser(user) {
  if (confirm(`确定要删除用户"${user.username}"吗？`)) {
    try {
      await store.deleteUser(user.id)
    } catch (error) {
      console.error('删除失败:', error)
    }
  }
}

async function toggleUserStatus(user) {
  const newStatus = user.status === 'active' ? 'inactive' : 'active'
  const action = newStatus === 'active' ? '启用' : '禁用'

  if (confirm(`确定要${action}用户"${user.username}"吗？`)) {
    try {
      await store.updateUser(user.id, { status: newStatus })
    } catch (error) {
      console.error('操作失败:', error)
    }
  }
}

async function batchToggleStatus(status) {
  const action = status === 'active' ? '启用' : '禁用'
  if (confirm(`确定要${action}选中的 ${selectedUsers.value.length} 个用户吗？`)) {
    try {
      for (const userId of selectedUsers.value) {
        await store.updateUser(userId, { status })
      }
      selectedUsers.value = []
      selectAll.value = false
    } catch (error) {
      console.error('批量操作失败:', error)
    }
  }
}

async function batchDeleteUsers() {
  if (confirm(`确定要删除选中的 ${selectedUsers.value.length} 个用户吗？此操作不可恢复！`)) {
    try {
      for (const userId of selectedUsers.value) {
        await store.deleteUser(userId)
      }
      selectedUsers.value = []
      selectAll.value = false
    } catch (error) {
      console.error('批量删除失败:', error)
    }
  }
}

async function saveUser(userData) {
  try {
    if (editingUser.value) {
      await store.updateUser(editingUser.value.id, userData)
    } else {
      await store.createUser(userData)
    }
    closeModal()
  } catch (error) {
    console.error('保存失败:', error)
  }
}

function closeModal() {
  showCreateModal.value = false
  showEditModal.value = false
  editingUser.value = null
}

// 生命周期
onMounted(async () => {
  await store.fetchUsers()
})
</script>
