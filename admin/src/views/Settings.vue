<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div>
      <h2 class="text-2xl font-bold text-admin-900">系统设置</h2>
      <p class="mt-1 text-sm text-admin-600">配置系统参数和功能选项</p>
    </div>

    <!-- 基本设置 -->
    <div class="card">
      <h3 class="text-lg font-medium text-admin-900 mb-4">基本设置</h3>
      <form @submit.prevent="saveBasicSettings" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-admin-700 mb-2">网站名称</label>
            <input
              v-model="basicSettings.siteName"
              type="text"
              class="input"
              placeholder="提示词收藏夹"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-admin-700 mb-2">网站描述</label>
            <input
              v-model="basicSettings.siteDescription"
              type="text"
              class="input"
              placeholder="管理和使用您的常用提示词"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-admin-700 mb-2">联系邮箱</label>
          <input
            v-model="basicSettings.contactEmail"
            type="email"
            class="input"
            placeholder="admin@example.com"
          />
        </div>
        <div class="flex justify-end">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
            保存基本设置
          </button>
        </div>
      </form>
    </div>

    <!-- 功能设置 -->
    <div class="card">
      <h3 class="text-lg font-medium text-admin-900 mb-4">功能设置</h3>
      <form @submit.prevent="saveFeatureSettings" class="space-y-4">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-admin-900">用户注册</label>
              <p class="text-sm text-admin-500">允许新用户注册账号</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="featureSettings.allowRegistration"
                type="checkbox"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-admin-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-admin-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-admin-900">邮箱验证</label>
              <p class="text-sm text-admin-500">新用户注册需要邮箱验证</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="featureSettings.requireEmailVerification"
                type="checkbox"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-admin-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-admin-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-admin-900">公开提示词</label>
              <p class="text-sm text-admin-500">允许用户查看其他用户的公开提示词</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="featureSettings.allowPublicPrompts"
                type="checkbox"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-admin-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-admin-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-admin-900">数据导出</label>
              <p class="text-sm text-admin-500">允许用户导出自己的数据</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="featureSettings.allowDataExport"
                type="checkbox"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-admin-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-admin-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-admin-700 mb-2">每用户最大提示词数</label>
            <input
              v-model.number="featureSettings.maxPromptsPerUser"
              type="number"
              min="1"
              class="input"
              placeholder="1000"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-admin-700 mb-2">提示词最大长度（字符）</label>
            <input
              v-model.number="featureSettings.maxPromptLength"
              type="number"
              min="100"
              class="input"
              placeholder="10000"
            />
          </div>
        </div>

        <div class="flex justify-end">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
            保存功能设置
          </button>
        </div>
      </form>
    </div>

    <!-- AI 配置设置 -->
    <div class="card">
      <h3 class="text-lg font-medium text-admin-900 mb-4">AI 配置</h3>
      <form @submit.prevent="saveAISettings" class="space-y-4">
        <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800">
                DeepSeek API 配置
              </h3>
              <div class="mt-2 text-sm text-blue-700">
                <p>配置 DeepSeek API 以启用 AI 对话功能。用户可以在前端使用提示词与 AI 进行对话。</p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="block text-sm font-medium text-admin-700 mb-2">
              DeepSeek API Key
              <span class="text-red-500">*</span>
            </label>
            <input
              v-model="aiSettings.deepseekApiKey"
              type="password"
              class="input"
              placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              required
            />
            <p class="mt-1 text-xs text-admin-500">
              请在 <a href="https://platform.deepseek.com" target="_blank" class="text-primary-600 hover:text-primary-700">DeepSeek 官网</a> 获取 API Key
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-admin-700 mb-2">API 地址</label>
            <input
              v-model="aiSettings.deepseekApiUrl"
              type="url"
              class="input"
              placeholder="https://api.deepseek.com/v1/chat/completions"
            />
            <p class="mt-1 text-xs text-admin-500">
              默认使用官方 API 地址，如有自定义需求可修改
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-admin-700 mb-2">默认模型</label>
            <select v-model="aiSettings.deepseekModel" class="input">
              <option value="deepseek-chat">deepseek-chat</option>
              <option value="deepseek-reasoner">deepseek-reasoner</option>
            </select>
            <p class="mt-1 text-xs text-admin-500">
              选择默认使用的 DeepSeek 模型
            </p>
          </div>
        </div>

        <div class="flex justify-between items-center">
          <button
            type="button"
            @click="testAIConnection"
            class="btn btn-secondary"
            :disabled="!aiSettings.deepseekApiKey || testingConnection"
          >
            <span v-if="testingConnection" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-admin-600 mr-2"></span>
            测试连接
          </button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
            保存 AI 配置
          </button>
        </div>
      </form>
    </div>

    <!-- 安全设置 -->
    <div class="card">
      <h3 class="text-lg font-medium text-admin-900 mb-4">安全设置</h3>
      <form @submit.prevent="saveSecuritySettings" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-admin-700 mb-2">密码最小长度</label>
            <input
              v-model.number="securitySettings.minPasswordLength"
              type="number"
              min="6"
              max="20"
              class="input"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-admin-700 mb-2">登录失败锁定次数</label>
            <input
              v-model.number="securitySettings.maxLoginAttempts"
              type="number"
              min="3"
              max="10"
              class="input"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-admin-700 mb-2">会话超时时间（分钟）</label>
            <input
              v-model.number="securitySettings.sessionTimeout"
              type="number"
              min="30"
              class="input"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-admin-700 mb-2">锁定时间（分钟）</label>
            <input
              v-model.number="securitySettings.lockoutDuration"
              type="number"
              min="5"
              class="input"
            />
          </div>
        </div>

        <div class="flex justify-end">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
            保存安全设置
          </button>
        </div>
      </form>
    </div>

    <!-- 系统维护 -->
    <div class="card">
      <h3 class="text-lg font-medium text-admin-900 mb-4">系统维护</h3>
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            @click="clearCache"
            class="btn btn-secondary flex items-center justify-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>清理缓存</span>
          </button>

          <button
            @click="backupData"
            class="btn btn-secondary flex items-center justify-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            <span>备份数据</span>
          </button>
        </div>

        <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-yellow-800">
                注意事项
              </h3>
              <div class="mt-2 text-sm text-yellow-700">
                <ul class="list-disc list-inside space-y-1">
                  <li>清理缓存会影响系统性能，建议在低峰期执行</li>
                  <li>数据备份会创建完整的系统快照，请确保有足够的存储空间</li>
                  <li>修改安全设置后，所有用户需要重新登录</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 成功提示 -->
    <div
      v-if="showSuccessMessage"
      class="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50"
    >
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span>{{ successMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '../stores/admin'
import api from '../services/api'

const store = useAdminStore()

// 响应式数据
const showSuccessMessage = ref(false)
const successMessage = ref('')
const testingConnection = ref(false)

const basicSettings = ref({
  siteName: '提示词收藏夹',
  siteDescription: '管理和使用您的常用提示词',
  contactEmail: 'admin@example.com'
})

const featureSettings = ref({
  allowRegistration: true,
  requireEmailVerification: false,
  allowPublicPrompts: true,
  allowDataExport: true,
  maxPromptsPerUser: 1000,
  maxPromptLength: 10000
})

const aiSettings = ref({
  deepseekApiKey: '',
  deepseekApiUrl: 'https://api.deepseek.com/v1/chat/completions',
  deepseekModel: 'deepseek-chat'
})

const securitySettings = ref({
  minPasswordLength: 6,
  maxLoginAttempts: 5,
  sessionTimeout: 120,
  lockoutDuration: 15
})

// 计算属性
const loading = computed(() => store.loading)

// 方法
async function saveBasicSettings() {
  try {
    // 这里应该调用API保存设置
    console.log('保存基本设置:', basicSettings.value)
    showMessage('基本设置已保存')
  } catch (error) {
    console.error('保存失败:', error)
  }
}

async function saveFeatureSettings() {
  try {
    // 这里应该调用API保存设置
    console.log('保存功能设置:', featureSettings.value)
    showMessage('功能设置已保存')
  } catch (error) {
    console.error('保存失败:', error)
  }
}

async function saveAISettings() {
  try {
    await api.saveSettings(aiSettings.value)
    showMessage('AI 配置已保存')
  } catch (error) {
    console.error('保存失败:', error)
    showMessage('保存失败: ' + (error.response?.data?.message || error.message))
  }
}

async function testAIConnection() {
  if (!aiSettings.value.deepseekApiKey) {
    showMessage('请先输入 API Key')
    return
  }

  testingConnection.value = true
  try {
    await api.testAIConnection(aiSettings.value)
    showMessage('AI 连接测试成功！')
  } catch (error) {
    console.error('测试失败:', error)
    showMessage('连接测试失败: ' + (error.response?.data?.message || error.message))
  } finally {
    testingConnection.value = false
  }
}

async function saveSecuritySettings() {
  try {
    // 这里应该调用API保存设置
    console.log('保存安全设置:', securitySettings.value)
    showMessage('安全设置已保存，用户需要重新登录')
  } catch (error) {
    console.error('保存失败:', error)
  }
}

async function clearCache() {
  if (confirm('确定要清理系统缓存吗？这可能会暂时影响系统性能。')) {
    try {
      // 这里应该调用API清理缓存
      console.log('清理缓存')
      showMessage('缓存已清理')
    } catch (error) {
      console.error('清理失败:', error)
    }
  }
}

async function backupData() {
  if (confirm('确定要备份系统数据吗？这可能需要一些时间。')) {
    try {
      // 这里应该调用API备份数据
      console.log('备份数据')
      showMessage('数据备份已开始，完成后会通知您')
    } catch (error) {
      console.error('备份失败:', error)
    }
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
  try {
    // 加载AI设置
    const settings = await api.getSettings()
    if (settings.data) {
      aiSettings.value = {
        deepseekApiKey: settings.data.deepseekApiKey || '',
        deepseekApiUrl: settings.data.deepseekApiUrl || 'https://api.deepseek.com/v1/chat/completions',
        deepseekModel: settings.data.deepseekModel || 'deepseek-chat'
      }
    }
  } catch (error) {
    console.error('加载设置失败:', error)
  }
})
</script>
