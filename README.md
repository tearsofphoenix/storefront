# Panda Commerce Monorepo

这个仓库现在拆分为三个独立应用，便于分别管理 Web storefront、Expo 移动端与 Payload CMS，并在部署平台上按 `Root Directory` 做独立构建。

## 目录结构

```text
apps/
  storefront/    Medusa Storefront（Next.js + Bun）
  expo-storefront/ Expo Mobile Storefront（React Native + Expo + Bun）
  payload-cms/   Payload CMS（Next.js + Payload + pnpm）
```

## 依赖安装

```bash
bun install
```

这条命令会安装 Bun 管理的工作区应用：

- `apps/storefront`
- `apps/expo-storefront`

`apps/payload-cms` 仍然使用 `pnpm install` 独立安装。

## 本地开发

### Storefront

```bash
bun run dev
```

默认运行在 `http://localhost:8000`。

### Expo Storefront

```bash
cp apps/expo-storefront/.env.template apps/expo-storefront/.env
bun run dev:expo
```

Expo CLI 启动后，可继续使用：

```bash
bun run ios:expo
bun run android:expo
bun run web:expo
```

移动设备联调时，`EXPO_PUBLIC_MEDUSA_URL` 必须指向宿主机的局域网 IP，例如 `http://192.168.1.100:9000`，不能直接使用设备无法访问的 `localhost`。

### Payload CMS

```bash
cd apps/payload-cms
pnpm install
pnpm dev
```

## 构建命令

### Storefront

```bash
bun run build
```

### Expo Storefront

```bash
bun run lint:expo
```

### Payload CMS

```bash
cd apps/payload-cms
pnpm build
```

## Vercel 配置

- `storefront` 项目的 `Root Directory` 设为 `apps/storefront`
- `expo-storefront` 为移动应用目录，默认不走 Vercel Web 项目部署流程
- `payload-cms` 项目的 `Root Directory` 设为 `apps/payload-cms`

`apps/payload-cms/vercel.json` 已配置为在 Vercel 构建时先执行 migration，再执行 build。
