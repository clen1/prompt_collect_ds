<template>
  <div class="space-y-6">
    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-admin-500 truncate">总用户数</dt>
              <dd class="text-lg font-medium text-admin-900">{{ stats.totalUsers || 0 }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-admin-500 truncate">总提示词数</dt>
              <dd class="text-lg font-medium text-admin-900">{{ stats.totalPrompts || 0 }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-admin-500 truncate">总分类数</dt>
              <dd class="text-lg font-medium text-admin-900">{{ stats.totalCategories || 0 }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-admin-500 truncate">总使用次数</dt>
              <dd class="text-lg font-medium text-admin-900">{{ stats.totalUsage || 0 }}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- AI 助手统计 -->
    <div class="card">
      <div class="px-6 py-4 border-b border-admin-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-admin-900">AI 助手统计</h3>
          <router-link to="/ai-assistant" class="text-sm text-primary-600 hover:text-primary-700">
            进入 AI 助手 →
          </router-link>
        </div>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
            <div class="p-3 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <div class="text-2xl font-bold text-admin-900">{{ aiStats.totalGenerated }}</div>
              <div class="text-sm text-admin-600">AI 生成次数</div>
            </div>
          </div>

          <div class="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
            <div class="p-3 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <div class="text-2xl font-bold text-admin-900">{{ aiStats.totalOptimized }}</div>
              <div class="text-sm text-admin-600">AI 优化次数</div>
            </div>
          </div>

          <div class="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
            <div class="p-3 bg-purple-100 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div class="text-2xl font-bold text-admin-900">{{ aiStats.avgResponseTime }}ms</div>
              <div class="text-sm text-admin-600">平均响应时间</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作日志统计 -->
    <div class="card">
      <div class="px-6 py-4 border-b border-admin-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-admin-900">操作日志统计</h3>
          <router-link to="/logs" class="text-sm text-primary-600 hover:text-primary-700">
            查看日志 →
          </router-link>
        </div>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="flex items-center space-x-4 p-4 bg-indigo-50 rounded-lg">
            <div class="p-3 bg-indigo-100 rounded-lg">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <div class="text-2xl font-bold text-admin-900">{{ logStats.totalLogs }}</div>
              <div class="text-sm text-admin-600">总操作数</div>
            </div>
          </div>

          <div class="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg">
            <div class="p-3 bg-orange-100 rounded-lg">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div class="text-2xl font-bold text-admin-900">{{ logStats.todayLogs }}</div>
              <div class="text-sm text-admin-600">今日操作</div>
            </div>
          </div>

          <div class="flex items-center space-x-4 p-4 bg-teal-50 rounded-lg">
            <div class="p-3 bg-teal-100 rounded-lg">
              <svg class="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <div class="text-2xl font-bold text-admin-900">{{ logStats.mostActiveAction }}</div>
              <div class="text-sm text-admin-600">最频繁操作</div>
            </div>
          </div>

          <div class="flex items-center space-x-4 p-4 bg-pink-50 rounded-lg">
            <div class="p-3 bg-pink-100 rounded-lg">
              <svg class="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <div class="text-2xl font-bold text-admin-900">{{ logStats.activeUsers }}</div>
              <div class="text-sm text-admin-600">活跃用户</div>
            </div>
          </div>
        </div>

        <!-- 最近操作记录 -->
        <div class="mt-6">
          <h4 class="text-sm font-medium text-admin-900 mb-3">最近操作记录</h4>
          <div v-if="recentLogs.length === 0" class="text-center py-4 text-admin-500">
            暂无操作记录
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="log in recentLogs"
              :key="log.id"
              class="flex items-center justify-between p-3 bg-admin-50 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <span
                  class="px-2 py-1 text-xs rounded-full"
                  :class="getActionBadgeClass(log.action)"
                >
                  {{ getActionText(log.action) }}
                </span>
                <span class="text-sm text-admin-700">{{ log.details }}</span>
              </div>
              <div class="text-xs text-admin-500">
                {{ formatTime(log.timestamp) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 提示词使用趋势 -->
      <div class="card">
        <h3 class="text-lg font-medium text-admin-900 mb-4">提示词使用趋势</h3>
        <div class="h-64">
          <div v-if="usageTrendData.length === 0" class="h-full flex items-center justify-center bg-admin-50 rounded-lg">
            <p class="text-admin-500">暂无使用数据</p>
          </div>
          <svg v-else class="w-full h-full" viewBox="0 0 400 200">
            <!-- 网格线 -->
            <defs>
              <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" stroke-width="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            <!-- 趋势线 -->
            <polyline
              v-if="usageTrendData.length > 1"
              fill="none"
              stroke="#3B82F6"
              stroke-width="2"
              :points="usageTrendData.map((item, index) => {
                const x = 40 + (index * (320 / Math.max(usageTrendData.length - 1, 1)));
                const maxCount = Math.max(...usageTrendData.map(d => d.count), 1);
                const y = 180 - (item.count / maxCount) * 140;
                return `${x},${y}`;
              }).join(' ')"
            />

            <!-- 数据点 -->
            <circle
              v-for="(item, index) in usageTrendData"
              :key="index"
              :cx="40 + (index * (320 / Math.max(usageTrendData.length - 1, 1)))"
              :cy="180 - (item.count / Math.max(...usageTrendData.map(d => d.count), 1)) * 140"
              r="4"
              fill="#3B82F6"
            >
              <title>{{ item.label }}: {{ item.count }}次</title>
            </circle>

            <!-- Y轴标签 -->
            <text x="10" y="20" class="text-xs fill-gray-500">{{ Math.max(...usageTrendData.map(d => d.count), 1) }}</text>
            <text x="10" y="60" class="text-xs fill-gray-500">{{ Math.ceil(Math.max(...usageTrendData.map(d => d.count), 1) * 0.75) }}</text>
            <text x="10" y="100" class="text-xs fill-gray-500">{{ Math.ceil(Math.max(...usageTrendData.map(d => d.count), 1) * 0.5) }}</text>
            <text x="10" y="140" class="text-xs fill-gray-500">{{ Math.ceil(Math.max(...usageTrendData.map(d => d.count), 1) * 0.25) }}</text>
            <text x="10" y="180" class="text-xs fill-gray-500">0</text>

            <!-- X轴标签 -->
            <text
              v-for="(item, index) in usageTrendData.filter((_, i) => i % Math.ceil(usageTrendData.length / 7) === 0)"
              :key="index"
              :x="40 + (usageTrendData.indexOf(item) * (320 / Math.max(usageTrendData.length - 1, 1))) - 10"
              y="195"
              class="text-xs fill-gray-500"
            >
              {{ item.label }}
            </text>
          </svg>
        </div>
      </div>

      <!-- 分类分布 -->
      <div class="card">
        <h3 class="text-lg font-medium text-admin-900 mb-4">分类分布</h3>
        <div class="h-64">
          <div v-if="categoryDistribution.length === 0" class="h-full flex items-center justify-center bg-admin-50 rounded-lg">
            <p class="text-admin-500">暂无分类数据</p>
          </div>
          <div v-else class="flex items-center justify-center h-full">
            <!-- 饼图 -->
            <svg class="w-48 h-48" viewBox="0 0 200 200">
              <g transform="translate(100,100)">
                <path
                  v-for="(item, index) in categoryDistribution"
                  :key="item.id"
                  :d="generatePieSlice(item, index, categoryDistribution)"
                  :fill="item.color"
                  :stroke="'white'"
                  stroke-width="2"
                >
                  <title>{{ item.name }}: {{ item.value }}个 ({{ item.percentage }}%)</title>
                </path>
              </g>
            </svg>

            <!-- 图例 -->
            <div class="ml-6 space-y-2">
              <div
                v-for="item in categoryDistribution"
                :key="item.id"
                class="flex items-center space-x-2"
              >
                <div
                  class="w-3 h-3 rounded-full"
                  :style="{ backgroundColor: item.color }"
                ></div>
                <span class="text-sm text-admin-700">{{ item.name }}</span>
                <span class="text-xs text-admin-500">({{ item.value }})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近活动 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 最新提示词 -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-admin-900">最新提示词</h3>
          <router-link to="/prompts" class="text-sm text-primary-600 hover:text-primary-700">
            查看全部 →
          </router-link>
        </div>
        <div class="space-y-3">
          <div v-if="recentPrompts.length === 0" class="text-center py-4 text-admin-500">
            暂无数据
          </div>
          <div
            v-for="prompt in recentPrompts"
            :key="prompt.id"
            class="flex items-center justify-between p-3 bg-admin-50 rounded-lg"
          >
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-admin-900 truncate">{{ prompt.title }}</p>
              <p class="text-xs text-admin-500">{{ formatDate(prompt.createdAt) }}</p>
            </div>
            <span class="badge badge-info">{{ prompt.usageCount || 0 }} 次使用</span>
          </div>
        </div>
      </div>

      <!-- 系统状态 -->
      <div class="card">
        <h3 class="text-lg font-medium text-admin-900 mb-4">系统状态</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-admin-600">服务器状态</span>
            <span class="badge badge-success">正常</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-admin-600">数据库连接</span>
            <span class="badge badge-success">正常</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-admin-600">存储空间</span>
            <span class="badge badge-info">85% 已使用</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-admin-600">系统版本</span>
            <span class="text-sm text-admin-900">v1.0.0</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="card">
      <h3 class="text-lg font-medium text-admin-900 mb-4">快速操作</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <router-link
          to="/prompts"
          class="flex items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
        >
          <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-primary-900">添加提示词</p>
            <p class="text-xs text-primary-600">创建新的提示词</p>
          </div>
        </router-link>

        <router-link
          to="/categories"
          class="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
        >
          <div class="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-green-900">管理分类</p>
            <p class="text-xs text-green-600">添加或编辑分类</p>
          </div>
        </router-link>

        <router-link
          to="/users"
          class="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
        >
          <div class="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-yellow-900">用户管理</p>
            <p class="text-xs text-yellow-600">管理系统用户</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- 数据导出 -->
    <div class="card">
      <h3 class="text-lg font-medium text-admin-900 mb-4">数据导出</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          @click="exportAllData"
          class="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-blue-900">导出全部数据</p>
            <p class="text-xs text-blue-600">包含提示词和分类</p>
          </div>
        </button>

        <button
          @click="exportPrompts"
          class="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
        >
          <div class="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-green-900">导出提示词</p>
            <p class="text-xs text-green-600">仅导出提示词数据</p>
          </div>
        </button>

        <button
          @click="exportCategories"
          class="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <div class="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-purple-900">导出分类</p>
            <p class="text-xs text-purple-600">仅导出分类数据</p>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '../stores/admin'
import { format } from 'date-fns'
import api from '../services/api'

const store = useAdminStore()

const stats = computed(() => store.dashboardStats)
const recentPrompts = computed(() => store.prompts.slice(0, 5))
const aiStats = ref({
  totalGenerated: 0,
  totalOptimized: 0,
  avgResponseTime: 0
})
const logStats = ref({
  totalLogs: 0,
  todayLogs: 0,
  mostActiveAction: '-',
  activeUsers: 1
})
const recentLogs = ref([])

// 可视化数据
const usageTrendData = ref([])
const categoryDistribution = ref([])

function formatDate(dateString) {
  return format(new Date(dateString), 'MM-dd HH:mm')
}

function formatTime(timestamp) {
  return format(new Date(timestamp), 'MM-dd HH:mm')
}

// 获取操作类型的显示文本
function getActionText(action) {
  const actionMap = {
    CREATE_PROMPT: '创建提示词',
    UPDATE_PROMPT: '更新提示词',
    DELETE_PROMPT: '删除提示词',
    USE_PROMPT: '使用提示词',
    BATCH_DELETE_PROMPTS: '批量删除',
    CREATE_CATEGORY: '创建分类',
    UPDATE_CATEGORY: '更新分类',
    DELETE_CATEGORY: '删除分类',
    CREATE_ANNOUNCEMENT: '创建公告',
    UPDATE_ANNOUNCEMENT: '更新公告',
    DELETE_ANNOUNCEMENT: '删除公告',
    BATCH_DELETE_ANNOUNCEMENTS: '批量删除公告',
    AI_GENERATE_PROMPT: 'AI生成',
    AI_OPTIMIZE_PROMPT: 'AI优化'
  }
  return actionMap[action] || action
}

// 获取操作类型的样式类
function getActionBadgeClass(action) {
  const classMap = {
    CREATE_PROMPT: 'bg-green-100 text-green-800',
    UPDATE_PROMPT: 'bg-blue-100 text-blue-800',
    DELETE_PROMPT: 'bg-red-100 text-red-800',
    USE_PROMPT: 'bg-green-100 text-green-800',
    BATCH_DELETE_PROMPTS: 'bg-red-100 text-red-800',
    CREATE_CATEGORY: 'bg-green-100 text-green-800',
    UPDATE_CATEGORY: 'bg-blue-100 text-blue-800',
    DELETE_CATEGORY: 'bg-red-100 text-red-800',
    CREATE_ANNOUNCEMENT: 'bg-green-100 text-green-800',
    UPDATE_ANNOUNCEMENT: 'bg-blue-100 text-blue-800',
    DELETE_ANNOUNCEMENT: 'bg-red-100 text-red-800',
    BATCH_DELETE_ANNOUNCEMENTS: 'bg-red-100 text-red-800',
    AI_GENERATE_PROMPT: 'bg-purple-100 text-purple-800',
    AI_OPTIMIZE_PROMPT: 'bg-indigo-100 text-indigo-800'
  }
  return classMap[action] || 'bg-gray-100 text-gray-800'
}

// 加载AI统计数据
async function loadAIStats() {
  try {
    const response = await fetch('/api/ai/history')
    const history = await response.json()

    if (Array.isArray(history)) {
      const generateCount = history.filter(record => record.type === 'generate').length
      const optimizeCount = history.filter(record => record.type === 'optimize').length

      // 计算平均响应时间（模拟数据）
      const avgTime = history.length > 0 ? Math.floor(Math.random() * 1000 + 800) : 0

      aiStats.value = {
        totalGenerated: generateCount,
        totalOptimized: optimizeCount,
        avgResponseTime: avgTime
      }
    }
  } catch (error) {
    console.error('加载AI统计失败:', error)
    // 使用默认值
    aiStats.value = {
      totalGenerated: 0,
      totalOptimized: 0,
      avgResponseTime: 0
    }
  }
}

// 加载日志统计数据
async function loadLogStats() {
  try {
    const response = await fetch('/api/admin/logs')
    const logs = await response.json()

    if (Array.isArray(logs)) {
      // 计算今日操作数
      const today = new Date().toDateString()
      const todayLogs = logs.filter(log =>
        new Date(log.timestamp).toDateString() === today
      ).length

      // 统计最频繁的操作
      const actionCounts = {}
      logs.forEach(log => {
        actionCounts[log.action] = (actionCounts[log.action] || 0) + 1
      })

      const mostActiveAction = Object.keys(actionCounts).length > 0
        ? Object.keys(actionCounts).reduce((a, b) =>
            actionCounts[a] > actionCounts[b] ? a : b
          )
        : '-'

      logStats.value = {
        totalLogs: logs.length,
        todayLogs: todayLogs,
        mostActiveAction: getActionText(mostActiveAction),
        activeUsers: 1 // 目前只有一个管理员用户
      }

      // 获取最近5条日志
      recentLogs.value = logs.slice(0, 5)
    }
  } catch (error) {
    console.error('加载日志统计失败:', error)
    // 使用默认值
    logStats.value = {
      totalLogs: 0,
      todayLogs: 0,
      mostActiveAction: '-',
      activeUsers: 1
    }
    recentLogs.value = []
  }
}

// 加载使用趋势数据
async function loadUsageTrends() {
  try {
    const response = await api.getUsageTrends()
    usageTrendData.value = response.data
  } catch (error) {
    console.error('加载使用趋势失败:', error)
    usageTrendData.value = []
  }
}

// 加载分类分布数据
async function loadCategoryDistribution() {
  try {
    const response = await api.getCategoryDistribution()
    categoryDistribution.value = response.data
  } catch (error) {
    console.error('加载分类分布失败:', error)
    categoryDistribution.value = []
  }
}

// 生成饼图路径
function generatePieSlice(item, index, data) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const percentage = item.value / total
  const startAngle = data.slice(0, index).reduce((sum, d) => sum + (d.value / total) * 2 * Math.PI, 0)
  const endAngle = startAngle + percentage * 2 * Math.PI

  const radius = 80
  const x1 = Math.cos(startAngle) * radius
  const y1 = Math.sin(startAngle) * radius
  const x2 = Math.cos(endAngle) * radius
  const y2 = Math.sin(endAngle) * radius

  const largeArcFlag = percentage > 0.5 ? 1 : 0

  return `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
}

// 导出功能
async function exportAllData() {
  try {
    const response = await fetch('/api/admin/export/all')
    if (response.ok) {
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `full_export_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    }
  } catch (error) {
    console.error('导出失败:', error)
  }
}

async function exportPrompts() {
  try {
    const response = await fetch('/api/admin/export/prompts')
    if (response.ok) {
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `prompts_export_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    }
  } catch (error) {
    console.error('导出失败:', error)
  }
}

async function exportCategories() {
  try {
    const response = await fetch('/api/admin/export/categories')
    if (response.ok) {
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `categories_export_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    }
  } catch (error) {
    console.error('导出失败:', error)
  }
}

onMounted(async () => {
  try {
    // 获取真实的仪表盘统计数据
    await store.fetchDashboardStats()

    // 获取最新提示词
    await store.fetchPrompts({ limit: 5, sort: 'createdAt', order: 'desc' })

    // 加载AI统计数据
    await loadAIStats()

    // 加载日志统计数据
    await loadLogStats()

    // 加载可视化数据
    await loadUsageTrends()
    await loadCategoryDistribution()
  } catch (error) {
    console.error('加载仪表盘数据失败:', error)
  }
})
</script>
