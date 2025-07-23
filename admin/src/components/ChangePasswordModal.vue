<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="relative w-full max-w-md bg-white rounded-lg shadow-xl">
      <!-- 头部 -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">修改密码</h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 表单 -->
      <form @submit.prevent="handleSubmit" class="px-6 py-4 space-y-4">
        <!-- 当前密码 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            当前密码 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.currentPassword"
            type="password"
            required
            class="input"
            placeholder="请输入当前密码"
          />
        </div>

        <!-- 新密码 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            新密码 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.newPassword"
            type="password"
            required
            class="input"
            placeholder="请输入新密码"
            minlength="6"
          />
          <p class="mt-1 text-xs text-gray-500">密码至少6位字符</p>
        </div>

        <!-- 确认新密码 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            确认新密码 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.confirmPassword"
            type="password"
            required
            class="input"
            placeholder="请再次输入新密码"
          />
          <p v-if="formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword" 
             class="mt-1 text-xs text-red-500">
            两次输入的密码不一致
          </p>
        </div>

        <!-- 错误信息 -->
        <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>

        <!-- 按钮 -->
        <div class="flex items-center justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="btn btn-secondary"
            :disabled="loading"
          >
            取消
          </button>
          <button
            type="submit"
            :disabled="!isFormValid || loading"
            class="btn btn-primary"
          >
            <span v-if="loading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
            {{ loading ? '修改中...' : '确认修改' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAdminStore } from '../stores/admin'

const emit = defineEmits(['close', 'success'])

const store = useAdminStore()

// 表单数据
const formData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')

// 表单验证
const isFormValid = computed(() => {
  return formData.value.currentPassword && 
         formData.value.newPassword && 
         formData.value.newPassword.length >= 6 &&
         formData.value.newPassword === formData.value.confirmPassword
})

// 提交表单
async function handleSubmit() {
  if (!isFormValid.value) return

  loading.value = true
  error.value = ''

  try {
    // 这里应该调用修改密码的API
    // 暂时模拟成功
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    emit('success')
    // 可以显示成功消息
    console.log('密码修改成功')
  } catch (err) {
    error.value = err.message || '修改密码失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>
