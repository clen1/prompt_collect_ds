const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// 简单的密码哈希函数（临时替代bcrypt）
function hashPassword(password) {
  return Buffer.from(password).toString('base64');
}

function verifyPassword(password, hash) {
  return Buffer.from(password).toString('base64') === hash;
}

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 数据文件路径
const DATA_DIR = path.join(__dirname, 'data');
const PROMPTS_FILE = path.join(DATA_DIR, 'prompts.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const ANNOUNCEMENTS_FILE = path.join(DATA_DIR, 'announcements.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// 确保数据目录和文件存在
async function initializeData() {
  await fs.ensureDir(DATA_DIR);

  if (!await fs.pathExists(PROMPTS_FILE)) {
    await fs.writeJson(PROMPTS_FILE, []);
  }

  if (!await fs.pathExists(CATEGORIES_FILE)) {
    const defaultCategories = [
      { id: uuidv4(), name: '通用', color: '#3B82F6' },
      { id: uuidv4(), name: '写作', color: '#10B981' },
      { id: uuidv4(), name: '编程', color: '#8B5CF6' },
      { id: uuidv4(), name: '分析', color: '#F59E0B' },
      { id: uuidv4(), name: '创意', color: '#EF4444' }
    ];
    await fs.writeJson(CATEGORIES_FILE, defaultCategories);
  }

  if (!await fs.pathExists(ANNOUNCEMENTS_FILE)) {
    await fs.writeJson(ANNOUNCEMENTS_FILE, []);
  }

  if (!await fs.pathExists(USERS_FILE)) {
    // 创建默认管理员用户
    const defaultAdmin = {
      id: uuidv4(),
      username: 'admin',
      email: 'admin@example.com',
      password: hashPassword('admin123'),
      role: 'admin',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: null
    };
    await fs.writeJson(USERS_FILE, [defaultAdmin]);
  }
}

// 读取数据
async function readPrompts() {
  return await fs.readJson(PROMPTS_FILE);
}

async function readCategories() {
  return await fs.readJson(CATEGORIES_FILE);
}

async function readAnnouncements() {
  return await fs.readJson(ANNOUNCEMENTS_FILE);
}

async function readUsers() {
  return await fs.readJson(USERS_FILE);
}

async function readSettings() {
  try {
    return await fs.readJson(SETTINGS_FILE);
  } catch (error) {
    // 如果文件不存在，返回默认设置
    return {
      deepseekApiKey: '',
      deepseekApiUrl: 'https://api.deepseek.com/v1/chat/completions',
      deepseekModel: 'deepseek-chat'
    };
  }
}

// 写入数据
async function writePrompts(prompts) {
  await fs.writeJson(PROMPTS_FILE, prompts, { spaces: 2 });
}

async function writeCategories(categories) {
  await fs.writeJson(CATEGORIES_FILE, categories, { spaces: 2 });
}

async function writeAnnouncements(announcements) {
  await fs.writeJson(ANNOUNCEMENTS_FILE, announcements, { spaces: 2 });
}

async function writeUsers(users) {
  await fs.writeJson(USERS_FILE, users, { spaces: 2 });
}

async function writeSettings(settings) {
  await fs.writeJson(SETTINGS_FILE, settings, { spaces: 2 });
}

// API 路由

// 获取所有提示词
app.get('/api/prompts', async (req, res) => {
  try {
    const prompts = await readPrompts();
    const { category, search } = req.query;

    let filteredPrompts = prompts;

    if (category) {
      filteredPrompts = filteredPrompts.filter(prompt => prompt.categoryId === category);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredPrompts = filteredPrompts.filter(prompt =>
        prompt.title.toLowerCase().includes(searchLower) ||
        prompt.content.toLowerCase().includes(searchLower) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    res.json(filteredPrompts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取单个提示词
app.get('/api/prompts/:id', async (req, res) => {
  try {
    const prompts = await readPrompts();
    const prompt = prompts.find(p => p.id === req.params.id);

    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    res.json(prompt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建新提示词
app.post('/api/prompts', async (req, res) => {
  try {
    const { title, content, categoryId, tags = [], description = '' } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const prompts = await readPrompts();
    const newPrompt = {
      id: uuidv4(),
      title,
      content,
      description,
      categoryId,
      tags,
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0
    };

    prompts.push(newPrompt);
    await writePrompts(prompts);

    // 添加操作日志
    await addOperationLog({
      action: 'CREATE_PROMPT',
      details: `创建提示词: "${title}"`,
      metadata: {
        promptId: newPrompt.id,
        categoryId: categoryId || '未分类',
        tagsCount: tags.length
      }
    });

    res.status(201).json(newPrompt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新提示词
app.put('/api/prompts/:id', async (req, res) => {
  try {
    const prompts = await readPrompts();
    const index = prompts.findIndex(p => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    const updatedPrompt = {
      ...prompts[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    prompts[index] = updatedPrompt;
    await writePrompts(prompts);

    // 添加操作日志
    await addOperationLog({
      action: 'UPDATE_PROMPT',
      details: `更新提示词: "${updatedPrompt.title}"`,
      metadata: {
        promptId: updatedPrompt.id,
        changes: Object.keys(req.body)
      }
    });

    res.json(updatedPrompt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除提示词
app.delete('/api/prompts/:id', async (req, res) => {
  try {
    const prompts = await readPrompts();
    const index = prompts.findIndex(p => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    const deletedPrompt = prompts[index];
    prompts.splice(index, 1);
    await writePrompts(prompts);

    // 添加操作日志
    await addOperationLog({
      action: 'DELETE_PROMPT',
      details: `删除提示词: "${deletedPrompt.title}"`,
      metadata: {
        promptId: deletedPrompt.id,
        category: deletedPrompt.categoryId
      }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 增加使用次数
app.post('/api/prompts/:id/use', async (req, res) => {
  try {
    const prompts = await readPrompts();
    const index = prompts.findIndex(p => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    prompts[index].usageCount = (prompts[index].usageCount || 0) + 1;
    await writePrompts(prompts);

    // 添加操作日志
    await addOperationLog({
      action: 'USE_PROMPT',
      details: `使用提示词: "${prompts[index].title}"`,
      metadata: {
        promptId: prompts[index].id,
        usageCount: prompts[index].usageCount
      }
    });

    res.json(prompts[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 管理员认证API
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: '用户名和密码不能为空' });
    }

    // 从数据库中查找用户
    const users = await readUsers();
    const user = users.find(u => u.username === username);

    if (!user) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 验证密码
    const isPasswordValid = verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 检查用户状态
    if (user.status !== 'active') {
      return res.status(401).json({ message: '账户已被禁用' });
    }

    // 更新最后登录时间
    const userIndex = users.findIndex(u => u.id === user.id);
    users[userIndex].lastLoginAt = new Date().toISOString();
    await writeUsers(users);

    // 生成token
    const token = 'token-' + user.id + '-' + Date.now();

    // 返回用户信息（不包含密码）
    const { password: _, ...safeUser } = users[userIndex];

    res.json({
      token,
      user: safeUser
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/logout', async (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// 管理员统计API
app.get('/api/admin/stats', async (req, res) => {
  try {
    const prompts = await readPrompts();
    const categories = await readCategories();

    const stats = {
      totalUsers: 156, // 模拟数据
      totalPrompts: prompts.length,
      totalCategories: categories.length,
      totalUsage: prompts.reduce((sum, prompt) => sum + (prompt.usageCount || 0), 0)
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 管理员创建提示词（支持自动创建分类）
app.post('/api/admin/prompts', async (req, res) => {
  try {
    const { title, content, description, categoryName, tags = [], isPublished = true } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    let categoryId = null;

    // 如果提供了分类名称，查找或创建分类
    if (categoryName && categoryName.trim()) {
      const categories = await readCategories();
      let category = categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());

      if (!category) {
        // 创建新分类
        category = {
          id: uuidv4(),
          name: categoryName.trim(),
          color: '#3B82F6', // 默认颜色
          description: `由AI助手自动创建的分类`
        };
        categories.push(category);
        await writeCategories(categories);
        console.log(`自动创建新分类: ${categoryName}`);
      }

      categoryId = category.id;
    }

    const prompts = await readPrompts();
    const newPrompt = {
      id: uuidv4(),
      title,
      content,
      description: description || '',
      categoryId,
      tags: Array.isArray(tags) ? tags : [],
      isPublished,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    prompts.push(newPrompt);
    await writePrompts(prompts);

    // 添加操作日志
    await addOperationLog({
      action: 'CREATE_PROMPT',
      details: `创建提示词: "${title}"`,
      metadata: {
        promptId: newPrompt.id,
        category: categoryName || '未分类',
        tagsCount: tags.length
      }
    });

    res.status(201).json({
      success: true,
      prompt: newPrompt,
      message: categoryName && !categoryId ? `已创建新分类"${categoryName}"` : '提示词创建成功'
    });
  } catch (error) {
    console.error('创建提示词失败:', error);
    res.status(500).json({ error: error.message });
  }
});

// 批量删除提示词
app.post('/api/admin/prompts/batch-delete', async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: 'Invalid ids array' });
    }

    const prompts = await readPrompts();
    const deletedPrompts = prompts.filter(prompt => ids.includes(prompt.id));
    const filteredPrompts = prompts.filter(prompt => !ids.includes(prompt.id));

    await writePrompts(filteredPrompts);

    // 添加操作日志
    await addOperationLog({
      action: 'BATCH_DELETE_PROMPTS',
      details: `批量删除 ${deletedPrompts.length} 个提示词`,
      metadata: {
        deletedCount: deletedPrompts.length,
        deletedTitles: deletedPrompts.map(p => p.title).slice(0, 5) // 只记录前5个标题
      }
    });

    res.json({
      message: `Successfully deleted ${prompts.length - filteredPrompts.length} prompts`,
      deletedCount: prompts.length - filteredPrompts.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 数据导出API
app.get('/api/admin/export/:type', async (req, res) => {
  try {
    const { type } = req.params;
    let data;
    let filename;

    switch (type) {
      case 'prompts':
        data = await readPrompts();
        filename = `prompts_export_${new Date().toISOString().split('T')[0]}.json`;
        break;
      case 'categories':
        data = await readCategories();
        filename = `categories_export_${new Date().toISOString().split('T')[0]}.json`;
        break;
      case 'all':
        const prompts = await readPrompts();
        const categories = await readCategories();
        data = { prompts, categories, exportDate: new Date().toISOString() };
        filename = `full_export_${new Date().toISOString().split('T')[0]}.json`;
        break;
      default:
        return res.status(400).json({ error: 'Invalid export type' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 分类相关API

// 获取所有分类
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await readCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建新分类
app.post('/api/categories', async (req, res) => {
  try {
    const { name, color = '#3B82F6' } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const categories = await readCategories();
    const newCategory = {
      id: uuidv4(),
      name,
      color
    };

    categories.push(newCategory);
    await writeCategories(categories);

    // 添加操作日志
    await addOperationLog({
      action: 'CREATE_CATEGORY',
      details: `创建分类: "${name}"`,
      metadata: {
        categoryId: newCategory.id,
        color: color
      }
    });

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新分类
app.put('/api/categories/:id', async (req, res) => {
  try {
    const categories = await readCategories();
    const index = categories.findIndex(c => c.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const oldCategory = { ...categories[index] };
    categories[index] = { ...categories[index], ...req.body };
    await writeCategories(categories);

    // 添加操作日志
    await addOperationLog({
      action: 'UPDATE_CATEGORY',
      details: `更新分类: "${categories[index].name}"`,
      metadata: {
        categoryId: categories[index].id,
        changes: Object.keys(req.body),
        oldName: oldCategory.name
      }
    });

    res.json(categories[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除分类
app.delete('/api/categories/:id', async (req, res) => {
  try {
    const categories = await readCategories();
    const index = categories.findIndex(c => c.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const deletedCategory = categories[index];
    categories.splice(index, 1);
    await writeCategories(categories);

    // 添加操作日志
    await addOperationLog({
      action: 'DELETE_CATEGORY',
      details: `删除分类: "${deletedCategory.name}"`,
      metadata: {
        categoryId: deletedCategory.id,
        color: deletedCategory.color
      }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 公告相关API

// 获取所有公告（用户端）
app.get('/api/announcements', async (req, res) => {
  try {
    const announcements = await readAnnouncements();
    // 只返回已发布的公告，按创建时间倒序
    const publishedAnnouncements = announcements
      .filter(announcement => announcement.isPublished)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(publishedAnnouncements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 管理员获取所有公告
app.get('/api/admin/announcements', async (req, res) => {
  try {
    const announcements = await readAnnouncements();
    // 按创建时间倒序
    const sortedAnnouncements = announcements
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(sortedAnnouncements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建新公告
app.post('/api/admin/announcements', async (req, res) => {
  try {
    const { title, content, type = 'info', isPublished = false } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const announcements = await readAnnouncements();
    const newAnnouncement = {
      id: uuidv4(),
      title,
      content,
      type, // info, warning, success, error
      isPublished,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    announcements.push(newAnnouncement);
    await writeAnnouncements(announcements);

    // 添加操作日志
    await addOperationLog({
      action: 'CREATE_ANNOUNCEMENT',
      details: `创建公告: "${title}"`,
      metadata: {
        announcementId: newAnnouncement.id,
        type: type,
        isPublished: isPublished
      }
    });

    res.status(201).json(newAnnouncement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新公告
app.put('/api/admin/announcements/:id', async (req, res) => {
  try {
    const announcements = await readAnnouncements();
    const index = announcements.findIndex(a => a.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    const updatedAnnouncement = {
      ...announcements[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    announcements[index] = updatedAnnouncement;
    await writeAnnouncements(announcements);

    // 添加操作日志
    await addOperationLog({
      action: 'UPDATE_ANNOUNCEMENT',
      details: `更新公告: "${updatedAnnouncement.title}"`,
      metadata: {
        announcementId: updatedAnnouncement.id,
        changes: Object.keys(req.body),
        isPublished: updatedAnnouncement.isPublished
      }
    });

    res.json(updatedAnnouncement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除公告
app.delete('/api/admin/announcements/:id', async (req, res) => {
  try {
    const announcements = await readAnnouncements();
    const index = announcements.findIndex(a => a.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    const deletedAnnouncement = announcements[index];
    announcements.splice(index, 1);
    await writeAnnouncements(announcements);

    // 添加操作日志
    await addOperationLog({
      action: 'DELETE_ANNOUNCEMENT',
      details: `删除公告: "${deletedAnnouncement.title}"`,
      metadata: {
        announcementId: deletedAnnouncement.id,
        type: deletedAnnouncement.type,
        wasPublished: deletedAnnouncement.isPublished
      }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 批量删除公告
app.post('/api/admin/announcements/batch-delete', async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: 'Invalid ids array' });
    }

    const announcements = await readAnnouncements();
    const deletedAnnouncements = announcements.filter(announcement => ids.includes(announcement.id));
    const filteredAnnouncements = announcements.filter(announcement => !ids.includes(announcement.id));

    await writeAnnouncements(filteredAnnouncements);

    // 添加操作日志
    await addOperationLog({
      action: 'BATCH_DELETE_ANNOUNCEMENTS',
      details: `批量删除 ${deletedAnnouncements.length} 个公告`,
      metadata: {
        deletedCount: deletedAnnouncements.length,
        deletedTitles: deletedAnnouncements.map(a => a.title).slice(0, 5) // 只记录前5个标题
      }
    });

    res.json({
      message: `Successfully deleted ${announcements.length - filteredAnnouncements.length} announcements`,
      deletedCount: announcements.length - filteredAnnouncements.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 初始化演示数据
async function initializeDemoData() {
  try {
    const prompts = await readPrompts();
    const categories = await readCategories();

    // 如果没有数据，则加载演示数据
    if (prompts.length === 0 && categories.length === 0) {
      console.log('Loading demo data...');
      const demoData = JSON.parse(await fs.readFile(path.join(__dirname, 'data', 'demo-data.json'), 'utf8'));

      await writeCategories(demoData.categories);
      await writePrompts(demoData.prompts);

      if (demoData.announcements) {
        await writeAnnouncements(demoData.announcements);
      }

      // 添加一些使用记录到操作日志
      const usageLogs = [];
      for (let i = 0; i < 25; i++) {
        const randomPrompt = demoData.prompts[Math.floor(Math.random() * demoData.prompts.length)];
        usageLogs.push({
          id: `usage-${i}`,
          action: 'USE_PROMPT',
          details: `使用提示词: "${randomPrompt.title}"`,
          timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          user: 'user',
          metadata: {
            promptId: randomPrompt.id,
            promptTitle: randomPrompt.title
          }
        });
      }

      const existingLogs = await readOperationLogs();
      await writeOperationLogs([...existingLogs, ...usageLogs]);

      console.log('Demo data loaded successfully!');
    }
  } catch (error) {
    console.log('Demo data file not found, starting with empty data');
  }
}

// AI辅助写提示词 - DeepSeek API
app.post('/api/ai/generate-prompt', async (req, res) => {
  try {
    const { description, model = 'deepseek-chat' } = req.body

    if (!description) {
      return res.status(400).json({ error: '请提供提示词描述' })
    }

    const apiKey = process.env.DEEPSEEK_API_KEY || 'sk-1b28a812a9634f9bac812c590128d35d'

    const requestData = {
      messages: [
        {
          content: `你是一个专业的提示词工程师。用户会给你一个需求描述，你需要根据描述生成一个完整的提示词模板。

请按照以下JSON格式返回，不要添加任何其他文字：
{
  "title": "提示词标题",
  "description": "提示词描述",
  "category": "建议的分类名称",
  "content": "完整的提示词内容",
  "tags": ["标签1", "标签2", "标签3"]
}

要求：
1. title: 简洁明了的标题，不超过20字
2. description: 详细描述提示词的用途和特点，50-100字
3. category: 根据用途建议合适的分类
4. content: 完整的提示词内容，包含角色设定、任务描述、输出要求等
5. tags: 3-5个相关标签`,
          role: "system"
        },
        {
          content: `请根据以下需求生成一个提示词模板：${description}`,
          role: "user"
        }
      ],
      model: model,
      max_tokens: 2048,
      temperature: 0.7,
      top_p: 1,
      stream: false
    }

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey
      },
      body: JSON.stringify(requestData)
    })

    const data = await response.json()

    if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      try {
        // 尝试解析JSON格式的返回
        const aiContent = data.choices[0].message.content.trim()
        let promptTemplate

        // 检查是否是JSON格式
        if (aiContent.startsWith('{') && aiContent.endsWith('}')) {
          promptTemplate = JSON.parse(aiContent)
        } else {
          // 如果不是JSON格式，创建默认结构
          promptTemplate = {
            title: "AI生成的提示词",
            description: "由AI助手生成的提示词",
            category: "通用",
            content: aiContent,
            tags: ["AI生成"]
          }
        }

        // 保存到历史记录
        await addAIHistoryRecord({
          type: 'generate',
          input: description,
          output: promptTemplate,
          model: model
        })

        // 添加操作日志
        await addOperationLog({
          action: 'AI_GENERATE_PROMPT',
          details: `使用 ${model} 生成提示词: ${promptTemplate.title}`,
          metadata: {
            model: model,
            inputLength: description.length,
            outputTitle: promptTemplate.title
          }
        })

        res.json({
          success: true,
          template: promptTemplate,
          model: model,
          rawContent: aiContent
        })
      } catch (parseError) {
        // JSON解析失败，返回原始内容
        res.json({
          success: true,
          template: {
            title: "AI生成的提示词",
            description: "由AI助手生成的提示词",
            category: "通用",
            content: data.choices[0].message.content,
            tags: ["AI生成"]
          },
          model: model,
          rawContent: data.choices[0].message.content
        })
      }
    } else {
      res.status(500).json({
        error: 'AI生成失败',
        details: data
      })
    }
  } catch (error) {
    console.error('AI生成提示词失败:', error)
    res.status(500).json({ error: 'AI生成失败: ' + error.message })
  }
})

// 优化提示词
app.post('/api/ai/optimize-prompt', async (req, res) => {
  try {
    const { prompt, requirements, model = 'deepseek-chat' } = req.body

    if (!prompt) {
      return res.status(400).json({ error: '请提供要优化的提示词' })
    }

    const apiKey = process.env.DEEPSEEK_API_KEY || 'sk-1b28a812a9634f9bac812c590128d35d'

    const systemPrompt = `你是一个专业的提示词优化专家。用户会给你一个提示词和优化要求，你需要对提示词进行优化改进。
优化原则：
1. 保持原意不变
2. 使语言更加清晰准确
3. 增强可操作性
4. 提高效果
请直接返回优化后的提示词，不要添加额外的解释。`

    const userPrompt = requirements
      ? `请优化以下提示词，优化要求：${requirements}\n\n原提示词：${prompt}`
      : `请优化以下提示词：${prompt}`

    const requestData = {
      messages: [
        { content: systemPrompt, role: "system" },
        { content: userPrompt, role: "user" }
      ],
      model: model,
      max_tokens: 2048,
      temperature: 0.7,
      top_p: 1,
      stream: false
    }

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey
      },
      body: JSON.stringify(requestData)
    })

    const data = await response.json()

    if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      // 添加操作日志
      await addOperationLog({
        action: 'AI_OPTIMIZE_PROMPT',
        details: `使用 ${model} 优化提示词`,
        metadata: {
          model: model,
          inputLength: prompt.length,
          hasRequirements: !!requirements
        }
      })

      res.json({
        success: true,
        content: data.choices[0].message.content,
        model: model
      })
    } else {
      res.status(500).json({
        error: 'AI优化失败',
        details: data
      })
    }
  } catch (error) {
    console.error('AI优化提示词失败:', error)
    res.status(500).json({ error: 'AI优化失败: ' + error.message })
  }
})

// 操作日志管理
const OPERATION_LOGS_FILE = path.join(__dirname, 'data', 'operation_logs.json')

async function readOperationLogs() {
  try {
    const data = await fs.readFile(OPERATION_LOGS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

async function writeOperationLogs(logs) {
  await fs.ensureDir(path.dirname(OPERATION_LOGS_FILE))
  await fs.writeFile(OPERATION_LOGS_FILE, JSON.stringify(logs, null, 2))
}

async function addOperationLog(logData) {
  const logs = await readOperationLogs()
  const newLog = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    user: 'admin', // 可以后续添加用户识别
    ...logData
  }
  logs.unshift(newLog) // 添加到开头

  // 只保留最近1000条日志
  if (logs.length > 1000) {
    logs.splice(1000)
  }

  await writeOperationLogs(logs)
  return newLog
}

// AI生成历史记录管理
const AI_HISTORY_FILE = path.join(__dirname, 'data', 'ai_history.json')

async function readAIHistory() {
  try {
    const data = await fs.readFile(AI_HISTORY_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

async function writeAIHistory(history) {
  await fs.ensureDir(path.dirname(AI_HISTORY_FILE))
  await fs.writeFile(AI_HISTORY_FILE, JSON.stringify(history, null, 2))
}

async function addAIHistoryRecord(record) {
  const history = await readAIHistory()
  const newRecord = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    ...record
  }
  history.unshift(newRecord) // 添加到开头

  // 只保留最近100条记录
  if (history.length > 100) {
    history.splice(100)
  }

  await writeAIHistory(history)
  return newRecord
}

// 获取AI生成历史
app.get('/api/ai/history', async (req, res) => {
  try {
    const history = await readAIHistory()
    res.json(history)
  } catch (error) {
    console.error('获取AI历史失败:', error)
    res.status(500).json({ error: '获取历史记录失败' })
  }
})

// 删除AI历史记录
app.delete('/api/ai/history/:id', async (req, res) => {
  try {
    const { id } = req.params
    const history = await readAIHistory()
    const filteredHistory = history.filter(record => record.id !== id)
    await writeAIHistory(filteredHistory)
    res.json({ success: true })
  } catch (error) {
    console.error('删除AI历史失败:', error)
    res.status(500).json({ error: '删除历史记录失败' })
  }
})

// 清空AI历史记录
app.delete('/api/ai/history', async (req, res) => {
  try {
    await writeAIHistory([])
    res.json({ success: true })
  } catch (error) {
    console.error('清空AI历史失败:', error)
    res.status(500).json({ error: '清空历史记录失败' })
  }
})

// 操作日志API
app.get('/api/admin/logs', async (req, res) => {
  try {
    const logs = await readOperationLogs()
    res.json(logs)
  } catch (error) {
    console.error('获取操作日志失败:', error)
    res.status(500).json({ error: '获取操作日志失败' })
  }
})

// 清空操作日志
app.delete('/api/admin/logs', async (req, res) => {
  try {
    await writeOperationLogs([])
    res.json({ success: true })
  } catch (error) {
    console.error('清空操作日志失败:', error)
    res.status(500).json({ error: '清空操作日志失败' })
  }
})

// 用户管理相关API (管理员专用)

// 获取所有用户
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await readUsers();
    // 不返回密码字段
    const safeUsers = users.map(user => {
      const { password, ...safeUser } = user;
      return safeUser;
    });
    res.json(safeUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建用户
app.post('/api/admin/users', async (req, res) => {
  try {
    const { username, email, password, role = 'user', status = 'active' } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email and password are required' });
    }

    const users = await readUsers();

    // 检查用户名是否已存在
    if (users.find(u => u.username === username)) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // 检查邮箱是否已存在
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = hashPassword(password);
    const newUser = {
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      role,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: null
    };

    users.push(newUser);
    await writeUsers(users);

    // 添加操作日志
    await addOperationLog({
      action: 'CREATE_USER',
      details: `创建用户: "${username}"`,
      metadata: {
        userId: newUser.id,
        username: username,
        email: email,
        role: role
      }
    });

    // 返回用户信息（不包含密码）
    const { password: _, ...safeUser } = newUser;
    res.status(201).json(safeUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新用户
app.put('/api/admin/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role, status } = req.body;

    const users = await readUsers();
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[userIndex];

    // 防止普通用户修改管理员或自己的角色
    if (role && role !== user.role) {
      // 检查是否试图修改管理员角色
      if (user.role === 'admin' || role === 'admin') {
        return res.status(403).json({ error: 'Cannot modify admin role' });
      }
    }

    // 防止禁用最后一个管理员
    if (status === 'inactive' && user.role === 'admin') {
      const activeAdmins = users.filter(u => u.role === 'admin' && u.status === 'active' && u.id !== id);
      if (activeAdmins.length === 0) {
        return res.status(400).json({ error: 'Cannot disable the last admin user' });
      }
    }

    // 检查邮箱是否被其他用户使用
    if (email && email !== user.email) {
      if (users.find(u => u.email === email && u.id !== id)) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    // 更新用户信息
    const updatedUser = {
      ...user,
      email: email || user.email,
      role: role || user.role,
      status: status || user.status,
      updatedAt: new Date().toISOString()
    };

    users[userIndex] = updatedUser;
    await writeUsers(users);

    // 添加操作日志
    await addOperationLog({
      action: 'UPDATE_USER',
      details: `更新用户: "${user.username}"`,
      metadata: {
        userId: id,
        username: user.username,
        changes: Object.keys(req.body)
      }
    });

    // 返回用户信息（不包含密码）
    const { password: _, ...safeUser } = updatedUser;
    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除用户
app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const users = await readUsers();
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[userIndex];

    // 防止删除最后一个管理员
    const adminUsers = users.filter(u => u.role === 'admin' && u.id !== id);
    if (user.role === 'admin' && adminUsers.length === 0) {
      return res.status(400).json({ error: 'Cannot delete the last admin user' });
    }

    users.splice(userIndex, 1);
    await writeUsers(users);

    // 添加操作日志
    await addOperationLog({
      action: 'DELETE_USER',
      details: `删除用户: "${user.username}"`,
      metadata: {
        userId: id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 修改密码
app.put('/api/admin/users/:id/password', async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const users = await readUsers();
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const hashedPassword = hashPassword(newPassword);
    users[userIndex].password = hashedPassword;
    users[userIndex].updatedAt = new Date().toISOString();

    await writeUsers(users);

    // 添加操作日志
    await addOperationLog({
      action: 'CHANGE_PASSWORD',
      details: `修改用户密码: "${users[userIndex].username}"`,
      metadata: {
        userId: id,
        username: users[userIndex].username
      }
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取仪表盘统计数据
app.get('/api/admin/dashboard/stats', async (req, res) => {
  try {
    const [users, prompts, categories, logs] = await Promise.all([
      readUsers(),
      readPrompts(),
      readCategories(),
      readOperationLogs()
    ]);

    // 计算统计数据
    const stats = {
      totalUsers: users.length,
      totalPrompts: prompts.length,
      totalCategories: categories.length,
      totalUsage: logs.filter(log => log.action === 'USE_PROMPT').length,
      activeUsers: users.filter(user => user.status === 'active').length,
      adminUsers: users.filter(user => user.role === 'admin').length,
      recentPrompts: prompts
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
      recentUsers: users
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(user => {
          const { password, ...safeUser } = user;
          return safeUser;
        })
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取使用趋势数据
app.get('/api/admin/dashboard/usage-trends', async (req, res) => {
  try {
    const logs = await readOperationLogs();
    const usageLogs = logs.filter(log => log.action === 'USE_PROMPT');

    // 按日期分组统计使用次数
    const dailyUsage = {};
    const now = new Date();

    // 初始化最近30天的数据
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyUsage[dateStr] = 0;
    }

    // 统计实际使用数据
    usageLogs.forEach(log => {
      const date = new Date(log.timestamp).toISOString().split('T')[0];
      if (dailyUsage.hasOwnProperty(date)) {
        dailyUsage[date]++;
      }
    });

    // 转换为图表数据格式
    const trendData = Object.entries(dailyUsage).map(([date, count]) => ({
      date,
      count,
      label: new Date(date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
    }));

    res.json(trendData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取分类分布数据
app.get('/api/admin/dashboard/category-distribution', async (req, res) => {
  try {
    const [prompts, categories] = await Promise.all([
      readPrompts(),
      readCategories()
    ]);

    // 预定义颜色数组
    const colors = [
      '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444',
      '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
    ];

    // 创建分类映射
    const categoryMap = {};
    categories.forEach((cat, index) => {
      categoryMap[cat.id] = {
        name: cat.name,
        color: cat.color || colors[index % colors.length],
        count: 0
      };
    });

    // 添加未分类选项
    categoryMap['uncategorized'] = {
      name: '未分类',
      color: '#6B7280',
      count: 0
    };

    // 统计每个分类的提示词数量
    prompts.forEach(prompt => {
      const categoryId = prompt.categoryId || 'uncategorized';
      if (categoryMap[categoryId]) {
        categoryMap[categoryId].count++;
      }
    });

    // 转换为图表数据格式，只包含有数据的分类
    const distributionData = Object.entries(categoryMap)
      .filter(([_, data]) => data.count > 0)
      .map(([id, data]) => ({
        id,
        name: data.name,
        value: data.count,
        color: data.color,
        percentage: ((data.count / prompts.length) * 100).toFixed(1)
      }))
      .sort((a, b) => b.value - a.value);

    res.json(distributionData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI对话API
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { prompt, promptId, promptTitle } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // 获取系统设置中的DeepSeek配置
    const settings = await readSettings();
    const deepseekApiKey = settings.deepseekApiKey;
    const deepseekApiUrl = settings.deepseekApiUrl || 'https://api.deepseek.com/v1/chat/completions';

    if (!deepseekApiKey) {
      return res.status(400).json({ error: 'DeepSeek API Key not configured' });
    }

    // 调用DeepSeek API
    const response = await fetch(deepseekApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deepseekApiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('DeepSeek API Error:', errorData);
      return res.status(500).json({ error: 'AI service error' });
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'No response from AI';

    // 记录AI对话到操作日志
    await addOperationLog({
      action: 'AI_CHAT',
      details: `AI对话 - 使用提示词: "${promptTitle || 'Unknown'}"`,
      metadata: {
        promptId,
        promptTitle,
        userPrompt: prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''),
        responseLength: aiResponse.length
      }
    });

    res.json({
      response: aiResponse,
      model: 'deepseek-chat'
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 系统设置管理API
app.get('/api/admin/settings', async (req, res) => {
  try {
    const settings = await readSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/settings', async (req, res) => {
  try {
    const settings = await readSettings();
    const updatedSettings = { ...settings, ...req.body };
    await writeSettings(updatedSettings);

    // 添加操作日志
    await addOperationLog({
      action: 'UPDATE_SETTINGS',
      details: '更新系统设置',
      metadata: {
        updatedFields: Object.keys(req.body)
      }
    });

    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 测试AI连接
app.post('/api/admin/settings/test-ai', async (req, res) => {
  try {
    const { deepseekApiKey, deepseekApiUrl } = req.body;

    if (!deepseekApiKey) {
      return res.status(400).json({ error: 'API Key is required' });
    }

    const testUrl = deepseekApiUrl || 'https://api.deepseek.com/v1/chat/completions';

    // 发送测试请求
    const response = await fetch(testUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deepseekApiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: 'Hello, this is a test message.'
          }
        ],
        max_tokens: 10
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(400).json({ error: 'API connection failed: ' + errorData });
    }

    const data = await response.json();
    res.json({
      success: true,
      message: 'AI connection test successful',
      response: data.choices?.[0]?.message?.content || 'Test successful'
    });

  } catch (error) {
    console.error('AI connection test error:', error);
    res.status(500).json({ error: 'Connection test failed: ' + error.message });
  }
});

// 启动服务器
initializeData().then(async () => {
  await initializeDemoData();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Failed to initialize data:', error);
});
