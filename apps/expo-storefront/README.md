# Expo Storefront

这个目录基于 Medusa 官方指南与官方示例接入：

- 文档：`https://docs.medusajs.com/resources/storefront-development/guides/react-native-expo`
- 示例：`https://github.com/medusajs/examples/tree/main/react-native-expo`

当前仓库中的 Expo 应用保持官方 Expo Router 结构，并独立于 `apps/storefront` 的 Next.js 组件体系运行。

## 环境准备

1. 复制环境变量模板：

```bash
cp .env.template .env
```

2. 填写以下变量：

```bash
EXPO_PUBLIC_MEDUSA_PUBLISHABLE_API_KEY=
EXPO_PUBLIC_MEDUSA_URL=
```

说明：

- `EXPO_PUBLIC_MEDUSA_PUBLISHABLE_API_KEY`：Medusa Admin 中的 publishable key。
- `EXPO_PUBLIC_MEDUSA_URL`：Medusa 后端地址。真机或 Expo Go 调试时，必须使用宿主机局域网 IP，例如 `http://192.168.1.100:9000`。

## 启动方式

在仓库根目录执行：

```bash
bun install
bun run dev:expo
```

或在当前目录执行：

```bash
bun install
bun run start
```

常用命令：

```bash
bun run ios
bun run android
bun run web
bun run lint
```

## 联调说明

- Expo Web 默认运行在 `http://localhost:8081`，如需在浏览器调试，请把它加入 Medusa 后端的 `STORE_CORS` 与 `AUTH_CORS`。
- 当前移动端应用复用了官方示例中的 Medusa SDK 接入方式，使用 `AsyncStorage` 保存 JWT。
- 这个应用不会直接复用 `apps/storefront` 的 React 组件；Web 与 React Native 维持独立 UI 层，但都连接同一个 Medusa 后端。
