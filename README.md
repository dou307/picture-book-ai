
# 📖 AI 梦幻绘本馆 (AI Picture Book Creator)

这是一个基于 **阿里云百炼平台 (Model Studio)** 搭建的智能化绘本生成系统。用户只需输入一个简单的创意故事点子，系统即可自动生成包含多页精美插画和背景配乐的有声绘本。

## ✨ 功能特点

- **多角色定制**：支持以“宝贝”或“家长”的不同视角生成内容。
- **风格切换**：可选择“动物主角”或“人类主角”的故事风格。
- **模拟翻页交互**：精美的绘本阅读界面，支持单页翻转。
- **有声朗读/配乐**：集成音频播放功能（需百炼工作流支持分段音频输出）。
- **极速生成**：基于 Next.js 框架，提供流畅的用户交互体验。

## 🛠️ 技术栈

- **前端/后端框架**: [Next.js](https://nextjs.org/) (App Router)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **图标**: [Lucide React](https://lucide.dev/)
- **AI 大模型**: 阿里云百炼 (DashScope) 工作流 API

## 🚀 快速开始

1. **克隆项目**:
   ```bash
   git clone [你的仓库链接]
   ```

2. **安装依赖**:
   ```bash
   npm install
   ```

3. **配置环境变量**:
   在根目录创建 `.env.local` 文件并填写你的 API 信息：
   ```env
   DASHSCOPE_API_KEY=你的API_KEY
   BAILIAN_APP_ID=你的APP_ID
   ```

4. **运行项目**:
   ```bash
   npm run dev
   ```
   打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可使用。

## 📝 待办事项 (TODO)
- [ ] 支持语音直接输入创意
- [ ] 实现绘本导出为 PDF 功能
- [ ] 增加更多艺术画风选择
