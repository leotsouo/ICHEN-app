# ⚡ 快速修复 404 错误

## 🔍 问题原因

出现 404 错误的主要原因：

1. **Root Directory 未设置** ⚠️ 最常见
2. **Framework 设置为 "Other" 而不是 "Next.js"** ⚠️ 很常见
3. **Build Command 不正确**

## ✅ 立即修复步骤

### 步骤 1: 在 Vercel Dashboard 设置 Root Directory（最重要！）

1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 点击 **Settings** → **General**
4. 找到 **Root Directory**
5. 点击 **Edit**
6. **设置为**：`apps/home`
7. 点击 **Save**

### 步骤 2: 确认 Framework Preset

1. 在同一个页面，找到 **Framework Preset**
2. 确认设置为：**`Next.js`**
3. 如果是 "Other" 或其他值，点击 **Edit** → 选择 **Next.js** → **Save**

### 步骤 3: 检查 Build Command

在 **Settings** → **General** 中：

1. 找到 **Build Command**
2. 设置为以下之一：
   - **选项 1（推荐）**：`pnpm build`（如果 Root Directory 已设置为 `apps/home`）
   - **选项 2**：`cd ../.. && pnpm build --filter=home`
3. 点击 **Save**

### 步骤 4: 确认 Install Command

1. 找到 **Install Command**
2. 确认设置为：`cd ../.. && pnpm install`
3. 点击 **Save**

### 步骤 5: 重新部署

1. 前往 **Deployments** 标签
2. 点击最新部署右侧的 **⋯** → **Redeploy**
3. **取消勾选** "Use existing Build Cache"（清除缓存）
4. 点击 **Redeploy**
5. 等待建置完成（约 2-3 分钟）

## 📋 完整设置检查清单

在 Vercel Dashboard → Settings → General：

- [ ] **Root Directory**: `apps/home` ⚠️ 必须设置
- [ ] **Framework Preset**: `Next.js` ⚠️ 必须是 Next.js
- [ ] **Build Command**: `pnpm build` 或 `cd ../.. && pnpm build --filter=home`
- [ ] **Output Directory**: `.next` 或留空
- [ ] **Install Command**: `cd ../.. && pnpm install`
- [ ] **Development Command**: `cd ../.. && pnpm dev --filter=home`（可选）

## 🎯 验证

重新部署后：

1. 访问你的 Vercel URL（例如：`https://your-project.vercel.app/`）
2. 应该看到首页，而不是 404 错误
3. 如果还是 404，检查部署日志中是否有错误

## 🔗 相关文档

- [详细修复指南](./docs/deployment/FIX_404_ERROR.md)
- [Framework 设置修复](./docs/deployment/FIX_FRAMEWORK_SETTING.md)

