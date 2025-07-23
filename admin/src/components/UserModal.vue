<template>
  <!-- 模态框背景 -->
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="$emit('close')">
    <!-- 模态框内容 -->
    <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white" @click.stop>
      <!-- 模态框头部 -->
      <div class="flex items-center justify-between pb-4 border-b border-admin-200">
        <h3 class="text-lg font-semibold text-admin-900">
          {{ isEditing ? '编辑用户' : '添加用户' }}
        </h3>
        <button
          @click="$emit('close')"
          class="text-admin-400 hover:text-admin-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- 表单内容 -->
      <form @submit.prevent="handleSubmit" class="mt-6 space-y-6">
        <!-- 用户名 -->
        <div>
          <label for="username" class="block text-sm font-medium text-admin-700 mb-2">
            用户名 <span class="text-red-500">*</span>
          </label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            required
            placeholder="请输入用户名"
            class="input"
            :class="{ 'border-red-300': errors.username }"
          />
          <p v-if="errors.username" class="mt-1 text-sm text-red-600">{{ errors.username }}</p>
        </div>

        <!-- 邮箱 -->
        <div>
          <label for="email" class="block text-sm font-medium text-admin-700 mb-2">
            邮箱 <span class="text-red-500">*</span>
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            placeholder="请输入邮箱地址"
            class="input"
            :class="{ 'border-red-300': errors.email }"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
        </div>

        <!-- 密码 -->
        <div v-if="!isEditing">
          <label for="password" class="block text-sm font-medium text-admin-700 mb-2">
            密码 <span class="text-red-500">*</span>
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            placeholder="请输入密码"
            class="input"
            :class="{ 'border-red-300': errors.password }"
          />
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
        </div>

        <!-- 确认密码 -->
        <div v-if="!isEditing">
          <label for="confirmPassword" class="block text-sm font-medium text-admin-700 mb-2">
            确认密码 <span class="text-red-500">*</span>
          </label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            required
            placeholder="请再次输入密码"
            class="input"
            :class="{ 'border-red-300': errors.confirmPassword }"
          />
          <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
        </div>

        <!-- 角色 -->
        <div>
          <label for="role" class="block text-sm font-medium text-admin-700 mb-2">
            角色
          </label>
          <select
            id="role"
            v-model="form.role"
            class="input"
          >
            <option value="user">普通用户</option>
            <option value="admin">管理员</option>
          </select>
        </div>

        <!-- 状态 -->
        <div>
          <label for="status" class="block text-sm font-medium text-admin-700 mb-2">
            状态
          </label>
          <select
            id="status"
            v-model="form.status"
            class="input"
          >
            <option value="active">活跃</option>
            <option value="inactive">禁用</option>
          </select>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-end space-x-3 pt-6 border-t border-admin-200">
          <button
            type="button"
            @click="$emit('close')"
            class="btn btn-secondary"
          >
            取消
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="!isFormValid || loading"
          >
            <span v-if="loading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
            {{ isEditing ? '更新' : '创建' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['save', 'close'])

// 响应式数据
const loading = ref(false)
const errors = ref({})

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'user',
  status: 'active'
})

// 计算属性
const isEditing = computed(() => !!props.user)

const isFormValid = computed(() => {
  if (isEditing.value) {
    return form.value.username.trim() && form.value.email.trim()
  } else {
    return form.value.username.trim() && 
           form.value.email.trim() && 
           form.value.password.trim() && 
           form.value.confirmPassword.trim()
  }
})

// 监听props变化
watch(() => props.user, (newUser) => {
  if (newUser) {
    form.value = {
      username: newUser.username || '',
      email: newUser.email || '',
      password: '',
      confirmPassword: '',
      role: newUser.role || 'user',
      status: newUser.status || 'active'
    }
  } else {
    resetForm()
  }
}, { immediate: true })

// 方法
function resetForm() {
  form.value = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    status: 'active'
  }
  errors.value = {}
}

function validateForm() {
  errors.value = {}
  
  if (!form.value.username.trim()) {
    errors.value.username = '请输入用户名'
  }
  
  if (!form.value.email.trim()) {
    errors.value.email = '请输入邮箱地址'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = '请输入有效的邮箱地址'
  }
  
  if (!isEditing.value) {
    if (!form.value.password.trim()) {
      errors.value.password = '请输入密码'
    } else if (form.value.password.length < 6) {
      errors.value.password = '密码长度至少6位'
    }
    
    if (!form.value.confirmPassword.trim()) {
      errors.value.confirmPassword = '请确认密码'
    } else if (form.value.password !== form.value.confirmPassword) {
      errors.value.confirmPassword = '两次输入的密码不一致'
    }
  }
  
  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validateForm()) {
    return
  }
  
  loading.value = true
  
  try {
    const formData = {
      username: form.value.username.trim(),
      email: form.value.email.trim(),
      role: form.value.role,
      status: form.value.status
    }
    
    if (!isEditing.value) {
      formData.password = form.value.password
    }
    
    await emit('save', formData)
  } catch (error) {
    console.error('保存失败:', error)
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  // 聚焦到用户名输入框
  const usernameInput = document.getElementById('username')
  if (usernameInput) {
    usernameInput.focus()
  }
})
</script>
