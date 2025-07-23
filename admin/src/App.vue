<template>
  <div id="app" class="min-h-screen bg-admin-50">
    <!-- 登录页面 -->
    <div v-if="$route.name === 'Login'" class="min-h-screen">
      <router-view />
    </div>

    <!-- 管理后台布局 -->
    <div v-else class="flex h-screen">
      <!-- 侧边栏 -->
      <aside class="w-64 bg-white shadow-sm border-r border-admin-200">
        <div class="p-6">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">P</span>
            </div>
            <span class="text-xl font-semibold text-admin-900">管理后台</span>
          </div>
        </div>

        <nav class="mt-6">
          <!-- 仪表盘 - 所有用户都可以访问 -->
          <router-link
            to="/"
            class="sidebar-item"
            :class="{ active: $route.name === 'Dashboard' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
            </svg>
            仪表板
          </router-link>

          <!-- 管理员专用菜单 -->
          <template v-if="currentUser?.role === 'admin'">
            <router-link
              to="/users"
              class="sidebar-item"
              :class="{ active: $route.name === 'Users' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              用户管理
            </router-link>

            <router-link
              to="/prompts"
              class="sidebar-item"
              :class="{ active: $route.name === 'Prompts' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              提示词管理
            </router-link>

            <router-link
              to="/categories"
              class="sidebar-item"
              :class="{ active: $route.name === 'Categories' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              分类管理
            </router-link>

            <router-link
              to="/announcements"
              class="sidebar-item"
              :class="{ active: $route.name === 'Announcements' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              公告管理
            </router-link>

            <router-link
              to="/ai-assistant"
              class="sidebar-item"
              :class="{ active: $route.name === 'AIAssistant' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI 助手
            </router-link>

            <router-link
              to="/logs"
              class="sidebar-item"
              :class="{ active: $route.name === 'Logs' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              操作日志
            </router-link>

            <router-link
              to="/settings"
              class="sidebar-item"
              :class="{ active: $route.name === 'Settings' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              系统设置
            </router-link>
          </template>

          <!-- 普通用户提示 -->
          <div v-else-if="currentUser?.role === 'user'" class="px-4 py-3 mt-4">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div class="flex items-start">
                <svg class="w-5 h-5 text-blue-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p class="text-sm font-medium text-blue-800">普通用户权限</p>
                  <p class="text-xs text-blue-600 mt-1">您当前只能访问仪表盘。如需更多权限，请联系管理员。</p>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </aside>

      <!-- 主内容区域 -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- 顶部导航栏 -->
        <header class="bg-white shadow-sm border-b border-admin-200 px-6 py-4">
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-semibold text-admin-900">
              {{ getPageTitle() }}
            </h1>

            <div class="flex items-center space-x-4">
              <!-- 用户菜单 -->
              <div class="relative user-menu-container">
                <button
                  @click="showUserMenu = !showUserMenu"
                  class="flex items-center space-x-2 text-admin-700 hover:text-admin-900"
                >
                  <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-medium">
                      {{ currentUser?.username?.charAt(0).toUpperCase() || 'A' }}
                    </span>
                  </div>
                  <span class="text-sm font-medium">
                    {{ currentUser?.username || '管理员' }}
                  </span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <!-- 下拉菜单 -->
                <div
                  v-if="showUserMenu"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-admin-200 z-10"
                >
                  <div class="py-1">
                    <button
                      @click="showChangePasswordModal = true; showUserMenu = false"
                      class="flex items-center w-full px-4 py-2 text-sm text-admin-700 hover:bg-admin-100"
                    >
                      <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-6 6c-3 0-5.5-1.5-5.5-4a3.5 3.5 0 117 0A6 6 0 0115 7z" />
                      </svg>
                      修改密码
                    </button>
                    <div class="border-t border-admin-200"></div>
                    <button
                      @click="handleLogout"
                      class="flex items-center w-full px-4 py-2 text-sm text-admin-700 hover:bg-admin-100"
                    >
                      <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      退出登录
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- 页面内容 -->
        <main class="flex-1 overflow-y-auto p-6">
          <router-view />
        </main>
      </div>
    </div>

    <!-- 全局通知 -->
    <div
      v-if="error"
      class="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50"
    >
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <span>{{ error }}</span>
        <button @click="clearError" class="ml-2 text-red-500 hover:text-red-700">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 修改密码模态框 -->
    <ChangePasswordModal
      v-if="showChangePasswordModal"
      @close="showChangePasswordModal = false"
      @success="showChangePasswordModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from './stores/admin'
import ChangePasswordModal from './components/ChangePasswordModal.vue'

const router = useRouter()
const store = useAdminStore()

const showUserMenu = ref(false)
const showChangePasswordModal = ref(false)

const error = computed(() => store.error)
const currentUser = computed(() => store.currentUser)

function getPageTitle() {
  const titles = {
    Dashboard: '仪表板',
    Users: '用户管理',
    Prompts: '提示词管理',
    Categories: '分类管理',
    Announcements: '公告管理',
    AIAssistant: 'AI 助手',
    Logs: '操作日志',
    Settings: '系统设置'
  }
  return titles[router.currentRoute.value.name] || '管理后台'
}

async function handleLogout() {
  await store.logout()
  router.push('/login')
}

function clearError() {
  store.clearError()
}

// 点击外部关闭菜单
function handleClickOutside(event) {
  const userMenuElement = document.querySelector('.user-menu-container')
  if (userMenuElement && !userMenuElement.contains(event.target)) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)

  // 从localStorage恢复用户信息
  const userDataStr = localStorage.getItem('admin_user')
  if (userDataStr) {
    try {
      const userData = JSON.parse(userDataStr)
      store.user = userData
    } catch (error) {
      console.error('Failed to parse user data:', error)
      localStorage.removeItem('admin_user')
    }
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
