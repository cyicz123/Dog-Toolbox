# 狗狗工具箱 (Dog Toolbox)

一款致力于让陈晓雨不累的软件。基于 Tauri + React + TypeScript 开发的桌面工具集合。

## 界面展示

### 主界面
![主界面](./screenshots/light.png)
![主界面](./screenshots/dark.png)

### 平时成绩计算
![平时成绩计算](./screenshots/process.png)

## 功能特性

- 📊 平时成绩计算
  - 支持批量处理多个班级的签到和作业数据
  - 自动计算平时成绩
  - 导出成绩表格

- 📋 点名册生成
  - 根据学习通签到记录生成点名册
  - 自动匹配教学周与签到时间
  - 支持批量处理多个班级
  - 导出压缩包格式

## 技术栈

- [Tauri](https://tauri.app/) - 跨平台桌面应用开发框架
- [React](https://reactjs.org/) - 用户界面库
- [TypeScript](https://www.typescriptlang.org/) - 类型安全的 JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - 原子化 CSS 框架
- [shadcn/ui](https://ui.shadcn.com/) - 可重用的UI组件库

## 开发环境要求

- [Node.js](https://nodejs.org/) (v18+)
- [Rust](https://www.rust-lang.org/) (最新稳定版)
- [pnpm](https://pnpm.io/) - 包管理器

## 更新日志

### v0.2.0 (2024-11-10)
- ✨ 新增点名册生成功能
  - 支持从学习通签到记录生成点名册
  - 自动匹配教学周与签到时间
  - 支持批量处理多个班级
- 🎨 优化移动端布局
- 💄 美化日志输出样式
- 🐛 修复已知问题

### v0.1.0 (2024-11-09)
- 🎉 首次发布
- ✨ 平时成绩计算功能

