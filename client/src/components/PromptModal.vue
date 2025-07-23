<template>
  <!-- 模态框背景 -->
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="$emit('close')">
    <!-- 模态框内容 -->
    <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white" @click.stop>
      <!-- 模态框头部 -->
      <div class="flex items-center justify-between pb-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ isEditing ? '编辑提示词' : '添加提示词' }}
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
            标题 <span class="text-red-500">*</span>
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            placeholder="请输入提示词标题"
            class="input"
            :class="{ 'border-red-300': errors.title }"
          />
          <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
        </div>

        <!-- 描述 -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
            描述
          </label>
          <input
            id="description"
            v-model="form.description"
            type="text"
            placeholder="简短描述这个提示词的用途"
            class="input"
          />
        </div>

        <!-- 分类 -->
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
            分类
          </label>
          <select
            id="category"
            v-model="form.categoryId"
            class="input"
          >
            <option value="">选择分类</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- 提示词内容 -->
        <div>
          <label for="content" class="block text-sm font-medium text-gray-700 mb-2">
            提示词内容 <span class="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            v-model="form.content"
            required
            rows="8"
            placeholder="请输入提示词内容..."
            class="textarea"
            :class="{ 'border-red-300': errors.content }"
          ></textarea>
          <p v-if="errors.content" class="mt-1 text-sm text-red-600">{{ errors.content }}</p>
          <p class="mt-1 text-sm text-gray-500">{{ form.content.length }} 字符</p>
        </div>

        <!-- 标签 -->
        <div>
          <label for="tags" class="block text-sm font-medium text-gray-700 mb-2">
            标签
          </label>
          <div class="space-y-2">
            <!-- 标签输入 -->
            <div class="flex space-x-2">
              <input
                v-model="newTag"
                type="text"
                placeholder="输入标签后按回车添加"
                class="input flex-1"
                @keydown.enter.prevent="addTag"
                @keydown.comma.prevent="addTag"
              />
              <button
                type="button"
                @click="addTag"
                class="btn btn-secondary"
                :disabled="!newTag.trim()"
              >
                添加
              </button>
            </div>
            
            <!-- 已添加的标签 -->
            <div v-if="form.tags.length > 0" class="flex flex-wrap gap-2">
              <span
                v-for="(tag, index) in form.tags"
                :key="index"
                class="tag bg-primary-100 text-primary-800 flex items-center space-x-1"
              >
                <span>{{ tag }}</span>
                <button
                  type="button"
                  @click="removeTag(index)"
                  class="text-primary-600 hover:text-primary-800"
                >
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </span>
            </div>
          </div>
          <p class="mt-1 text-sm text-gray-500">用逗号或回车分隔多个标签</p>
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
  prompt: {
    type: Object,
    default: null
  },
  categories: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['save', 'close'])

// 响应式数据
const loading = ref(false)
const newTag = ref('')
const errors = ref({})

const form = ref({
  title: '',
  description: '',
  content: '',
  categoryId: '',
  tags: []
})

// 计算属性
const isEditing = computed(() => !!props.prompt)

const isFormValid = computed(() => {
  return form.value.title.trim() && form.value.content.trim()
})

// 监听props变化
watch(() => props.prompt, (newPrompt) => {
  if (newPrompt) {
    form.value = {
      title: newPrompt.title || '',
      description: newPrompt.description || '',
      content: newPrompt.content || '',
      categoryId: newPrompt.categoryId || '',
      tags: [...(newPrompt.tags || [])]
    }
  } else {
    resetForm()
  }
}, { immediate: true })

// 方法
function resetForm() {
  form.value = {
    title: '',
    description: '',
    content: '',
    categoryId: '',
    tags: []
  }
  errors.value = {}
  newTag.value = ''
}

function addTag() {
  const tag = newTag.value.trim()
  if (tag && !form.value.tags.includes(tag)) {
    form.value.tags.push(tag)
    newTag.value = ''
  }
}

function removeTag(index) {
  form.value.tags.splice(index, 1)
}

function validateForm() {
  errors.value = {}
  
  if (!form.value.title.trim()) {
    errors.value.title = '请输入标题'
  }
  
  if (!form.value.content.trim()) {
    errors.value.content = '请输入提示词内容'
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
      description: form.value.description.trim(),
      content: form.value.content.trim(),
      categoryId: form.value.categoryId || null,
      tags: form.value.tags
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
