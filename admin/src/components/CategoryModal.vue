<template>
  <!-- 模态框背景 -->
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="$emit('close')">
    <!-- 模态框内容 -->
    <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white" @click.stop>
      <!-- 模态框头部 -->
      <div class="flex items-center justify-between pb-4 border-b border-admin-200">
        <h3 class="text-lg font-semibold text-admin-900">
          {{ isEditing ? '编辑分类' : '添加分类' }}
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
        <!-- 分类名称 -->
        <div>
          <label for="name" class="block text-sm font-medium text-admin-700 mb-2">
            分类名称 <span class="text-red-500">*</span>
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            placeholder="请输入分类名称"
            class="input"
            :class="{ 'border-red-300': errors.name }"
          />
          <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
        </div>

        <!-- 分类颜色 -->
        <div>
          <label class="block text-sm font-medium text-admin-700 mb-2">
            分类颜色
          </label>
          <div class="space-y-3">
            <!-- 预设颜色 -->
            <div class="grid grid-cols-8 gap-2">
              <button
                v-for="color in presetColors"
                :key="color"
                type="button"
                @click="form.color = color"
                class="w-8 h-8 rounded-full border-2 transition-all duration-200"
                :class="form.color === color ? 'border-admin-400 scale-110' : 'border-admin-200 hover:border-admin-300'"
                :style="{ backgroundColor: color }"
              >
                <svg
                  v-if="form.color === color"
                  class="w-4 h-4 text-white mx-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
            
            <!-- 自定义颜色 -->
            <div class="flex items-center space-x-3">
              <label for="custom-color" class="text-sm text-admin-600">自定义颜色：</label>
              <input
                id="custom-color"
                v-model="form.color"
                type="color"
                class="w-10 h-8 border border-admin-300 rounded cursor-pointer"
              />
              <span class="text-sm text-admin-500">{{ form.color }}</span>
            </div>
          </div>
        </div>

        <!-- 预览 -->
        <div>
          <label class="block text-sm font-medium text-admin-700 mb-2">
            预览
          </label>
          <div class="p-4 bg-admin-50 rounded-lg">
            <span
              v-if="form.name"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
              :style="{ backgroundColor: form.color }"
            >
              {{ form.name }}
            </span>
            <span v-else class="text-admin-400 text-sm">输入分类名称查看预览</span>
          </div>
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
  category: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['save', 'close'])

// 预设颜色
const presetColors = [
  '#3B82F6', // blue
  '#10B981', // emerald
  '#8B5CF6', // violet
  '#F59E0B', // amber
  '#EF4444', // red
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#84CC16', // lime
  '#6366F1', // indigo
  '#F97316', // orange
  '#14B8A6', // teal
  '#A855F7', // purple
  '#64748B', // slate
  '#DC2626', // red-600
  '#059669', // emerald-600
  '#7C3AED'  // violet-600
]

// 响应式数据
const loading = ref(false)
const errors = ref({})

const form = ref({
  name: '',
  color: '#3B82F6'
})

// 计算属性
const isEditing = computed(() => !!props.category)

const isFormValid = computed(() => {
  return form.value.name.trim() && form.value.color
})

// 监听props变化
watch(() => props.category, (newCategory) => {
  if (newCategory) {
    form.value = {
      name: newCategory.name || '',
      color: newCategory.color || '#3B82F6'
    }
  } else {
    resetForm()
  }
}, { immediate: true })

// 方法
function resetForm() {
  form.value = {
    name: '',
    color: '#3B82F6'
  }
  errors.value = {}
}

function validateForm() {
  errors.value = {}
  
  if (!form.value.name.trim()) {
    errors.value.name = '请输入分类名称'
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
      name: form.value.name.trim(),
      color: form.value.color
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
  // 聚焦到名称输入框
  const nameInput = document.getElementById('name')
  if (nameInput) {
    nameInput.focus()
  }
})
</script>
