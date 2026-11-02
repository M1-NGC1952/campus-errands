# 部署指南（作业提交用）

> ✅ **当前正式链接（作业提交用这个）：https://xiaoyuanpaotui.coze.site**
>
> 已验证公开可访问、HTTP 200、长期有效。后续代码更新后重新部署，域名不变。

## 方案一：平台一键部署（推荐，最快，域名形如 `xiaoyuanpaotui.coze.site`）

平台内置 `coze deploy`，部署后得到一个**正式、公开、长期稳定**的 `https://<前缀>.coze.site` 链接，之后每次更新代码域名都不变。

### 步骤

1. 在对话里让 AI 触发部署授权，会得到一个授权链接，形如：
   `https://www.coze.cn/oauth/device-activation?user_code=XXXX-XXXX`
2. 在浏览器打开该链接，登录扣子账号，点「同意授权」。
3. 回到对话，告诉 AI：「已授权，执行部署」。
4. AI 执行部署命令，完成后设置一个好记的域名前缀，例如 `xiaoyuanpaotui`。
5. 拿到正式链接 `https://xiaoyuanpaotui.coze.site`，提交这一个即可。
6. 以后代码有更新，重新执行部署，**域名保持不变**。

### 隐私 / 公开性

部署成功后默认就是公网可访问，任何人点链接都能打开，无需登录。

---

## 方案二：Vercel 部署（备选，域名形如 `your-app.vercel.app`）

如果你更希望用 Vercel，本项目也已验证可直接部署（`next build` 通过）。

1. 把代码推到 GitHub 仓库。
2. 打开 https://vercel.com ，用 GitHub 账号登录。
3. 点「Add New → Project」，导入该仓库。
4. 框架自动识别为 Next.js，直接点「Deploy」。
5. 得到 `https://xxx.vercel.app` 公开链接，提交即可；更新代码 push 后自动重新部署，域名不变。

---

## 关于「去掉 .coze.site」

- 无论是平台部署（`.coze.site`）还是 Vercel（`.vercel.app`），免费域名都带平台后缀，**无法去掉**。
- 想要完全自定义域名（如 `xiaoyuanpaotui.com`），需要自行购买域名并在部署平台绑定，作业一般不要求。

## 生产构建验证

已执行 `pnpm next build --webpack`，9 个页面全部构建成功：
- `/` 任务广场（静态）
- `/login` 登录注册（静态）
- `/publish` 发布任务（静态）
- `/my-tasks` 我的任务（静态）
- `/profile` 个人中心（静态）
- `/task/[id]` 任务详情（动态）
