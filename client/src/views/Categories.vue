<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 页面标题和操作按钮 -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">分类浏览</h1>
        <p class="text-gray-600 mt-2">浏览所有提示词分类，点击分类查看相关提示词</p>
      </div>
      <router-link to="/" class="btn btn-secondary flex items-center space-x-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>返回首页</span>
      </router-link>
    </div>

    <!-- 分类统计 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">总分类数</p>
            <p class="text-2xl font-semibold text-gray-900">{{ allCategories.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">我的收藏</p>
            <p class="text-2xl font-semibold text-gray-900">{{ localPromptsCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">模板库</p>
            <p class="text-2xl font-semibold text-gray-900">{{ templatePromptsCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">未分类</p>
            <p class="text-2xl font-semibold text-gray-900">{{ uncategorizedCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 分类列表 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">分类列表</h2>
        <p class="text-sm text-gray-500 mt-1">点击分类查看相关提示词</p>
      </div>

      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p class="mt-2 text-gray-500">加载中...</p>
      </div>

      <div v-else-if="allCategories.length === 0" class="p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">暂无分类</h3>
        <p class="mt-1 text-sm text-gray-500">还没有任何分类数据</p>
      </div>

      <div v-else class="divide-y divide-gray-200">
        <!-- 全部分类 -->
        <div class="p-6 hover:bg-gray-50 transition-colors cursor-pointer" @click="viewCategory('')">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-4 h-4 rounded-full bg-gray-400"></div>
              <div>
                <h3 class="text-lg font-medium text-gray-900">全部分类</h3>
                <p class="text-sm text-gray-500 mt-1">查看所有提示词</p>
              </div>
            </div>
            <div class="flex items-center space-x-6">
              <div class="text-right">
                <div class="text-sm text-gray-500">我的收藏: {{ localPromptsCount }}</div>
                <div class="text-sm text-gray-500">模板库: {{ templatePromptsCount }}</div>
              </div>
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        <!-- 具体分类 -->
        <div
          v-for="category in allCategories"
          :key="category.id"
          class="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
          @click="viewCategory(category.id)"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div
                class="w-4 h-4 rounded-full"
                :style="{ backgroundColor: category.color }"
              ></div>
              <div>
                <h3 class="text-lg font-medium text-gray-900">{{ category.name }}</h3>
                <p v-if="category.description" class="text-sm text-gray-500 mt-1">
                  {{ category.description }}
                </p>
              </div>
            </div>

            <div class="flex items-center space-x-6">
              <div class="text-right">
                <div class="text-sm text-gray-500">我的收藏: {{ getCategoryLocalCount(category.id) }}</div>
                <div class="text-sm text-gray-500">模板库: {{ getCategoryTemplateCount(category.id) }}</div>
              </div>
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        <!-- 未分类 -->
        <div
          v-if="uncategorizedCount > 0"
          class="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
          @click="viewCategory('uncategorized')"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-4 h-4 rounded-full bg-gray-300"></div>
              <div>
                <h3 class="text-lg font-medium text-gray-900">未分类</h3>
                <p class="text-sm text-gray-500 mt-1">没有设置分类的提示词</p>
              </div>
            </div>
            <div class="flex items-center space-x-6">
              <div class="text-right">
                <div class="text-sm text-gray-500">我的收藏: {{ getUncategorizedLocalCount() }}</div>
                <div class="text-sm text-gray-500">模板库: {{ getUncategorizedTemplateCount() }}</div>
              </div>
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLocalPromptsStore } from '../stores/localPrompts'

const router = useRouter()
const localStore = useLocalPromptsStore()

// 计算属性
const loading = computed(() => localStore.loading)
const categories = computed(() => localStore.categories)
const localPrompts = computed(() => localStore.localPrompts)
const templatePrompts = computed(() => localStore.templatePrompts)

// 合并所有分类（去重）
const allCategories = computed(() => {
  const categoryMap = new Map()

  // 添加本地分类
  categories.value.forEach(cat => {
    categoryMap.set(cat.id, cat)
  })

  return Array.from(categoryMap.values())
})

// 统计数据
const localPromptsCount = computed(() => localPrompts.value.length)
const templatePromptsCount = computed(() => templatePrompts.value.length)
const uncategorizedCount = computed(() => {
  const localUncategorized = localPrompts.value.filter(p => !p.categoryId).length
  const templateUncategorized = templatePrompts.value.filter(p => !p.categoryId).length
  return localUncategorized + templateUncategorized
})

// 方法
function getCategoryLocalCount(categoryId) {
  return localPrompts.value.filter(prompt => prompt.categoryId === categoryId).length
}

function getCategoryTemplateCount(categoryId) {
  return templatePrompts.value.filter(prompt => prompt.categoryId === categoryId).length
}

function getUncategorizedLocalCount() {
  return localPrompts.value.filter(prompt => !prompt.categoryId).length
}

function getUncategorizedTemplateCount() {
  return templatePrompts.value.filter(prompt => !prompt.categoryId).length
}

function viewCategory(categoryId) {
  // 跳转到首页并设置分类筛选
  router.push({
    name: 'Home',
    query: { category: categoryId }
  })
}

// 生命周期
onMounted(async () => {
  await localStore.loadData()
})
</script>
