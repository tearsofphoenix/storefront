# Panda Commerce Monorepo

这个仓库现在拆分为两个独立应用，便于在 Vercel 中分别设置 `Root Directory`，避免一次提交触发两个项目同时构建。

## 目录结构

```text
apps/
  storefront/    Medusa Storefront（Next.js + Bun）
  payload-cms/   Payload CMS（Next.js + Payload + pnpm）
```

## 本地开发

### Storefront

```bash
cd apps/storefront
bun install
bun run dev
```

或在仓库根目录直接执行：

```bash
bun run dev
```

### Payload CMS

```bash
cd apps/payload-cms
pnpm install
pnpm dev
```

## 构建命令

### Storefront

```bash
cd apps/storefront
bun run build
```

### Payload CMS

```bash
cd apps/payload-cms
pnpm build
```

## Vercel 配置

- `storefront` 项目的 `Root Directory` 设为 `apps/storefront`
- `payload-cms` 项目的 `Root Directory` 设为 `apps/payload-cms`

`apps/payload-cms/vercel.json` 已配置为在 Vercel 构建时先执行 migration，再执行 build。
