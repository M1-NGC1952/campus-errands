# AGENTS.md

## 项目概览
校园跑腿互助平台 - 面向大学生的任务发布与接单平台。

## 技术栈
- Next.js 16 (App Router) + React 19 + TypeScript 5
- shadcn/ui + Tailwind CSS 4
- localStorage 模拟数据持久化

## 目录结构
```
src/
├── app/
│   ├── page.tsx              # 任务广场首页（列表+筛选）
│   ├── layout.tsx            # 根布局（AuthProvider + BottomNav）
│   ├── login/page.tsx        # 登录/注册页
│   ├── publish/page.tsx      # 发布任务页
│   ├── my-tasks/page.tsx     # 我的任务（我发布的/我接的）
│   ├── profile/page.tsx      # 个人中心（信用分+信息）
│   └── task/[id]/page.tsx    # 任务详情（接单/确认/取消）
├── components/
│   ├── auth-provider.tsx     # 认证上下文 Provider
│   ├── bottom-nav.tsx        # 底部导航栏
│   ├── task-card.tsx         # 任务卡片组件
│   └── ui/                   # shadcn/ui 组件库
├── lib/
│   ├── types.ts              # 类型定义（User, Task, 枚举映射）
│   ├── store.ts              # 数据层（localStorage CRUD + 信用分逻辑）
│   └── utils.ts              # cn() 工具函数
```

## 核心功能
1. **用户系统**：注册/登录（用户名+密码），信用分机制（初始100，完成+5，取消-10）
2. **任务广场**：按类别（代取快递/代买/代占座/代送/其他）和状态筛选，支持搜索
3. **任务流程**：发布 → 接单 → 确认完成/取消
4. **个人中心**：信用分展示、我发布的/我接的任务列表

## 开发命令
- `pnpm dev` - 启动开发服务器
- `pnpm build` - 构建生产版本
- `pnpm ts-check` - TypeScript 类型检查
- `pnpm lint` - ESLint 检查

## 注意事项
- 纯前端应用，数据存储在 localStorage
- 首次加载会生成 6 条示例任务数据
- 移动端优先设计，max-width 480px
- React 组件中禁止直接使用 Date.now()，需通过 useEffect + useState 获取
