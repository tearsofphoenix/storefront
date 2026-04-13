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

## Google OAuth 生产配置

当前仓库中的 Google 登录已统一改为固定 callback，不再使用 `/{countryCode}/account/google` 这类动态路径。

- Medusa 后端 `GOOGLE_CALLBACK_URL` 必须配置为 `https://estore.pandacat.ai/api/auth/google`
- storefront `NEXT_PUBLIC_BASE_URL` 必须配置为 `https://estore.pandacat.ai`
- Expo `EXPO_PUBLIC_STOREFRONT_URL` 必须配置为 `https://estore.pandacat.ai`
- Google Cloud Console 中，当前实际使用的 OAuth Client 必须包含以下 Authorized redirect URIs：
  - `https://estore.pandacat.ai/api/auth/google`
  - `https://estore.pandacat.ai/api/auth/mobile/google`

排障时请以浏览器真实发出的 `client_id` 为准，确认你修改的是同一个 Google OAuth Client，而不是只在另一个 client 上补了 redirect URI。
