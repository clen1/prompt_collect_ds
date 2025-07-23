<template>
  <div class="space-y-4">
    <!-- 分类筛选标题 -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900">分类筛选</h3>
      <button
        v-if="selectedCategory"
        @click="clearCategory"
        class="text-sm text-primary-600 hover:text-primary-700"
      >
        清除筛选
      </button>
    </div>

    <!-- 分类统计 -->
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div class="bg-blue-50 rounded-lg p-3">
        <div class="text-sm text-blue-600 font-medium">我的收藏</div>
        <div class="text-2xl font-bold text-blue-900">{{ localCategoriesStats.totalCount }}</div>
        <div class="text-xs text-blue-600">{{ localCategoriesStats.categoriesCount }} 个分类</div>
      </div>
      <div class="bg-green-50 rounded-lg p-3">
        <div class="text-sm text-green-600 font-medium">模板库</div>
        <div class="text-2xl font-bold text-green-900">{{ templateCategoriesStats.totalCount }}</div>
        <div class="text-xs text-green-600">{{ templateCategoriesStats.categoriesCount }} 个分类</div>
      </div>
    </div>

    <!-- 分类列表 -->
    <div class="space-y-2">
      <!-- 全部分类 -->
      <button
        @click="selectCategory('')"
        class="w-full flex items-center justify-between p-3 rounded-lg border transition-colors"
        :class="selectedCategory === '' 
          ? 'border-primary-300 bg-primary-50 text-primary-700' 
          : 'border-gray-200 hover:border-gray-300 text-gray-700'"
      >
        <div class="flex items-center space-x-3">
          <div class="w-4 h-4 rounded-full bg-gray-400"></div>
          <span class="font-medium">全部分类</span>
        </div>
        <span class="text-sm text-gray-500">
          {{ activeTab === 'local' ? localCategoriesStats.totalCount : templateCategoriesStats.totalCount }}
        </span>
      </button>

      <!-- 具体分类 -->
      <div v-for="category in currentCategories" :key="category.id">
        <button
          @click="selectCategory(category.id)"
          class="w-full flex items-center justify-between p-3 rounded-lg border transition-colors"
          :class="selectedCategory === category.id 
            ? 'border-primary-300 bg-primary-50 text-primary-700' 
            : 'border-gray-200 hover:border-gray-300 text-gray-700'"
        >
          <div class="flex items-center space-x-3">
            <div 
              class="w-4 h-4 rounded-full" 
              :style="{ backgroundColor: category.color }"
            ></div>
            <span class="font-medium">{{ category.name }}</span>
          </div>
          <span class="text-sm text-gray-500">{{ category.count }}</span>
        </button>
      </div>

      <!-- 无分类的提示词 -->
      <button
        v-if="uncategorizedCount > 0"
        @click="selectCategory('uncategorized')"
        class="w-full flex items-center justify-between p-3 rounded-lg border transition-colors"
        :class="selectedCategory === 'uncategorized' 
          ? 'border-primary-300 bg-primary-50 text-primary-700' 
          : 'border-gray-200 hover:border-gray-300 text-gray-700'"
      >
        <div class="flex items-center space-x-3">
          <div class="w-4 h-4 rounded-full bg-gray-300"></div>
          <span class="font-medium">未分类</span>
        </div>
        <span class="text-sm text-gray-500">{{ uncategorizedCount }}</span>
      </button>
    </div>

    <!-- 分类管理提示 -->
    <div class="mt-6 p-4 bg-gray-50 rounded-lg">
      <div class="flex items-start space-x-3">
        <svg class="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div class="text-sm text-gray-600">
          <p class="font-medium mb-1">分类说明</p>
          <ul class="space-y-1 text-xs">
            <li>• 我的收藏：您本地保存的提示词分类</li>
            <li>• 模板库：系统提供的模板分类</li>
            <li>• 从模板库收藏的提示词会保持原分类</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  localPrompts: {
    type: Array,
    default: () => []
  },
  templatePrompts: {
    type: Array,
    default: () => []
  },
  selectedCategory: {
    type: String,
    default: ''
  },
  activeTab: {
    type: String,
    default: 'local'
  }
})

const emit = defineEmits(['category-selected'])

// 计算当前显示的分类（根据activeTab）
const currentCategories = computed(() => {
  const prompts = props.activeTab === 'local' ? props.localPrompts : props.templatePrompts
  
  return props.categories.map(category => {
    const count = prompts.filter(prompt => prompt.categoryId === category.id).length
    return {
      ...category,
      count
    }
  }).filter(category => category.count > 0)
})

// 计算本地分类统计
const localCategoriesStats = computed(() => {
  const totalCount = props.localPrompts.length
  const categoriesCount = props.categories.filter(category => 
    props.localPrompts.some(prompt => prompt.categoryId === category.id)
  ).length
  
  return { totalCount, categoriesCount }
})

// 计算模板库分类统计
const templateCategoriesStats = computed(() => {
  const totalCount = props.templatePrompts.length
  const categoriesCount = props.categories.filter(category => 
    props.templatePrompts.some(prompt => prompt.categoryId === category.id)
  ).length
  
  return { totalCount, categoriesCount }
})

// 计算未分类的提示词数量
const uncategorizedCount = computed(() => {
  const prompts = props.activeTab === 'local' ? props.localPrompts : props.templatePrompts
  return prompts.filter(prompt => !prompt.categoryId).length
})

// 选择分类
function selectCategory(categoryId) {
  emit('category-selected', categoryId)
}

// 清除分类筛选
function clearCategory() {
  emit('category-selected', '')
}
</script>

<style scoped>
/* 自定义滚动条 */
.space-y-2 {
  max-height: 400px;
  overflow-y: auto;
}

.space-y-2::-webkit-scrollbar {
  width: 4px;
}

.space-y-2::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}

.space-y-2::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.space-y-2::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
