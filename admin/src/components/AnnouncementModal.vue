<template>
  <!-- 模态框背景 -->
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4" @click="$emit('close')">
    <!-- 模态框内容 -->
    <div class="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden" @click.stop>
      <!-- 模态框滚动容器 -->
      <div class="overflow-y-auto max-h-[90vh]">
        <div class="p-6">
          <!-- 模态框头部 -->
          <div class="flex items-center justify-between pb-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ isEditing ? '编辑公告' : '发布公告' }}
            </h3>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- 表单内容 -->
          <form @submit.prevent="handleSubmit" class="mt-6 space-y-6">
            <!-- 标题 -->
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                公告标题 <span class="text-red-500">*</span>
              </label>
              <input
                id="title"
                v-model="form.title"
                type="text"
                required
                placeholder="请输入公告标题"
                class="input"
                :class="{ 'border-red-300': errors.title }"
              />
              <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
            </div>

            <!-- 公告类型 -->
            <div>
              <label for="type" class="block text-sm font-medium text-gray-700 mb-2">
                公告类型
              </label>
              <select
                id="type"
                v-model="form.type"
                class="input"
              >
                <option value="info">信息公告</option>
                <option value="warning">警告公告</option>
                <option value="success">成功公告</option>
                <option value="error">错误公告</option>
              </select>
              <p class="mt-1 text-sm text-gray-500">不同类型的公告会以不同颜色显示</p>
            </div>

            <!-- 公告内容 -->
            <div>
              <label for="content" class="block text-sm font-medium text-gray-700 mb-2">
                公告内容 <span class="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                v-model="form.content"
                required
                rows="8"
                placeholder="请输入公告内容..."
                class="textarea"
                :class="{ 'border-red-300': errors.content }"
              ></textarea>
              <p v-if="errors.content" class="mt-1 text-sm text-red-600">{{ errors.content }}</p>
              <p class="mt-1 text-sm text-gray-500">{{ form.content.length }} 字符</p>
            </div>

            <!-- 发布设置 -->
            <div class="border-t border-gray-200 pt-6">
              <h4 class="text-sm font-medium text-gray-900 mb-4">发布设置</h4>
              <div class="space-y-4">
                <div class="flex items-center">
                  <input
                    id="isPublished"
                    v-model="form.isPublished"
                    type="checkbox"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label for="isPublished" class="ml-2 block text-sm text-gray-900">
                    立即发布
                  </label>
                </div>
                <p class="text-sm text-gray-500">
                  {{ form.isPublished ? '公告将立即对用户可见' : '公告将保存为草稿，需要手动发布' }}
                </p>
              </div>
            </div>

            <!-- 预览区域 -->
            <div class="border-t border-gray-200 pt-6">
              <h4 class="text-sm font-medium text-gray-900 mb-4">预览效果</h4>
              <div
                class="p-4 rounded-lg border-l-4"
                :class="getPreviewClass(form.type)"
              >
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5" :class="getIconClass(form.type)" fill="currentColor" viewBox="0 0 20 20">
                      <path v-if="form.type === 'info'" fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                      <path v-else-if="form.type === 'warning'" fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                      <path v-else-if="form.type === 'success'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      <path v-else-if="form.type === 'error'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium" :class="getTitleClass(form.type)">
                      {{ form.title || '公告标题' }}
                    </h3>
                    <div class="mt-2 text-sm" :class="getContentClass(form.type)">
                      <p>{{ form.content || '公告内容将在这里显示...' }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
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
                {{ isEditing ? '更新公告' : '创建公告' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  announcement: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['save', 'close'])

// 响应式数据
const loading = ref(false)
const errors = ref({})

const form = ref({
  title: '',
  content: '',
  type: 'info',
  isPublished: false
})

// 计算属性
const isEditing = computed(() => !!props.announcement)

const isFormValid = computed(() => {
  return form.value.title.trim() && form.value.content.trim()
})

// 监听props变化
watch(() => props.announcement, (newAnnouncement) => {
  if (newAnnouncement) {
    form.value = {
      title: newAnnouncement.title || '',
      content: newAnnouncement.content || '',
      type: newAnnouncement.type || 'info',
      isPublished: newAnnouncement.isPublished || false
    }
  } else {
    resetForm()
  }
}, { immediate: true })

// 方法
function resetForm() {
  form.value = {
    title: '',
    content: '',
    type: 'info',
    isPublished: false
  }
  errors.value = {}
}

function getPreviewClass(type) {
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

function validateForm() {
  errors.value = {}
  
  if (!form.value.title.trim()) {
    errors.value.title = '请输入公告标题'
  }
  
  if (!form.value.content.trim()) {
    errors.value.content = '请输入公告内容'
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
      title: form.value.title.trim(),
      content: form.value.content.trim(),
      type: form.value.type,
      isPublished: form.value.isPublished
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
  // 聚焦到标题输入框
  const titleInput = document.getElementById('title')
  if (titleInput) {
    titleInput.focus()
  }
})
</script>
