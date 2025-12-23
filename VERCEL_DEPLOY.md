# 🚀 Vercel 部署配置指南

## 📋 重要说明

这个项目是一个 **monorepo**，包含多个应用。当前配置用于部署 **`home`** 应用（已整合餐厅评分系统）。

## ⚙️ Vercel Dashboard 设置

### 必须配置（在 Vercel Dashboard 中）

访问你的项目 → **Settings** → **General**：

1. **Root Directory** ⚠️ **最重要！**
   ```
   apps/home
   ```

2. **Framework Preset**
   ```
   Next.js
   ```

3. **Build Command**
   ```
   cd ../.. && pnpm build --filter=home
   ```
   或（如果 Root Directory 已设置为 `apps/home`）：
   ```
   pnpm build
   ```

4. **Output Directory**
   ```
   .next
   ```

5. **Install Command**
   ```
   cd ../.. && pnpm install
   ```
   > ⚠️ **注意**：必须从根目录安装，因为需要安装 workspace 的所有依赖

6. **Development Command**（可选）
   ```
   cd ../.. && pnpm dev --filter=home
   ```

## 🔐 环境变量设置

在 **Settings** → **Environment Variables** 中添加：

### 必要变量

| 变量名称 | 说明 | 环境 |
|---------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | Production, Preview, Development |

### 可选变量

| 变量名称 | 说明 | 环境 |
|---------|------|------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API Key | Production, Preview, Development |

## 📝 vercel.json 说明

根目录的 `vercel.json` 包含了一些默认配置，但 **Vercel Dashboard 的设置会优先于 vercel.json**。

如果遇到问题，建议在 Vercel Dashboard 中明确设置所有字段。

## ✅ 部署检查清单

部署前确认：

- [ ] Root Directory 已设置为 `apps/home`
- [ ] Install Command 从根目录执行：`cd ../.. && pnpm install`
- [ ] Build Command 正确配置
- [ ] 所有环境变量已设置
- [ ] 环境变量已应用到所有环境（Production, Preview, Development）

## 🔗 相关文档

- [完整部署攻略](docs/deployment/VERCEL_DEPLOYMENT_GUIDE.md)
- [整合部署指南](docs/deployment/INTEGRATED_DEPLOY.md)
- [快速部署指南](docs/deployment/QUICK_VERCEL_DEPLOY.md)

## 🆘 常见问题

### 问题 1: 找不到 workspace 包

**解决方案**：
- 确认 Install Command 从根目录执行：`cd ../.. && pnpm install`
- 确认 Root Directory 设置为 `apps/home`

### 问题 2: 构建失败

**解决方案**：
- 检查 Build Command 是否正确
- 确认所有环境变量已设置
- 查看构建日志获取详细错误信息

### 问题 3: 环境变量未生效

**解决方案**：
- 确认环境变量已应用到所有环境
- 修改环境变量后需要重新部署
- 检查变量名称拼写（大小写敏感）

