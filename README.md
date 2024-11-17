# 狗狗工具箱 (Dog Toolbox)

一款致力于让陈晓雨不累的软件。基于 Tauri + React + TypeScript 开发的桌面工具集合。

## 界面展示

### 主界面
![主界面](./screenshots/light.png)

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

## 开发环境配置

### 系统要求

- [Node.js](https://nodejs.org/) (v18+)
- [Rust](https://www.rust-lang.org/) (最新稳定版)
- [pnpm](https://pnpm.io/) - 包管理器

### 平台特定依赖

#### Windows
- Windows SDK
- Visual Studio Build Tools

#### macOS
- Xcode Command Line Tools
- 如需支持 Apple Silicon (M1/M2)，需要安装 `aarch64-apple-darwin` 目标
- 如需支持 Intel Mac，需要安装 `x86_64-apple-darwin` 目标

#### Linux (Ubuntu/Debian)
``` bash
sudo apt-get update
sudo apt-get install -y libwebkit2gtk-4.1-dev \
libappindicator3-dev \
librsvg2-dev \
patchelf
```

### 开发步骤

1. 克隆仓库
``` bash
git clone https://github.com/cyicz123/Dog-Toolbox.git
```
2. 安装依赖
``` bash
pnpm install
```
3. 运行开发环境
``` bash
pnpm tauri dev
```
4. 构建
``` bash
pnpm tauri build
```

## 最新版本 (v0.2.1)

### 新增功能
- ✨ 新增自动更新功能
  - 支持自动检查更新
  - 支持一键更新安装
  - 添加更新进度提示

### 优化
- 🔧 完善 CI/CD 流程
  - 添加自动构建和发布流程
  - 支持跨平台构建
  - 添加代码签名
- 🐛 修复桌面布局下首页工具卡片点击区域异常的问题
- 🖼️ 优化了logo细节

### 下一版本计划
- [ ] 重构 output-panel 组件，消除冗余代码
- [ ] 优化平时成绩计算工具，使成绩计算方式可配置

## 版本历史
请查看 [CHANGELOG.md](./CHANGELOG.md) 了解详细更新内容。

## 许可证

本项目基于 [MIT 许可证](./LICENSE) 开源。
