# Verification

- theme-08-woodmart: `bun run lint` passed with existing repository warnings; `bun run build` passed.
- theme-09-porto: `bun run lint` passed with existing repository warnings; `bun run build` passed.
- theme-10-symmetry: `bun run lint` passed with existing repository warnings; `bun run build` passed.
- push status: `theme-07-flatsome`, `theme-08-woodmart`, `theme-09-porto`, `theme-10-symmetry` all failed to push due SSH connection resets/closes outside the repo codebase.

## 2026-04-12 Expo Storefront Integration

- `bun install`: passed，根目录已能识别 `apps/storefront` 与 `apps/expo-storefront` 两个 Bun workspaces，并生成 `bun.lock`。
- `bun run lint:expo`: passed，Expo app 静态检查通过。
- `MEDUSA_STOREFRONT_PUBLISHABLE_KEY=test_key bun run lint:storefront`: passed，现有 Next storefront 未因 workspace 接入发生 lint 回归。
- 注意事项：`bun install` 过程中出现 React / React DOM peer dependency warning，来源于 Web storefront 与 Expo app 依赖版本并存，但不影响当前安装与 lint。

## 2026-04-12 Expo iOS Simulator Test

- `bun run ios:expo`: 首次在沙箱内执行失败，原因是 Expo 需要写入 `~/.expo/native-modules-cache`。
- 提权后再次执行：Metro 与 iOS Simulator 成功启动，Expo Go 54 也已安装到 `iPhone 16e` 模拟器。
- 运行时错误：模拟器红屏显示 React 版本不匹配，报错为 `react 19.2.3` vs `react-native-renderer 19.1.0`。
- 已修复代码侧依赖：`apps/expo-storefront/package.json` 中已将 `react` / `react-dom` 调整为 `19.1.0`，`@types/react` 调整为 `~19.1.10`，并重新执行 `bun install`。
- 进一步处理：卸载模拟器中的 `Expo Go` 后重新执行 `bunx expo start --ios -c`，问题消失。
- 最终结果：iOS Simulator 成功加载首页，Metro 日志显示 `GET /store/regions`、`GET /store/products`、`POST /store/carts` 均返回 `200`，说明移动端页面与 Medusa 后端连通正常。

## 2026-04-12 Expo storefront i18n / account / checkout follow-up

- `bun run lint:expo`: passed，新增 i18n、customer context、account/login/register、checkout/order confirmation 改动未引入新的 lint 错误。
- `bun run ios:expo`: passed，Expo Go 在 `iPhone 16e` 模拟器成功打开首页；截图确认首页商品列表正常渲染。
- `xcrun simctl openurl booted 'exp://172.20.10.5:8081/--/checkout'`: passed，iOS 模拟器可直接打开 checkout 路由；截图确认 delivery step 已渲染，包含 contact information / shipping address 表单。
- iOS deep link 限制：`/login` 在 Expo Go dev 容器中落到 `Unmatched Route`，因此未使用该路径作为账户页最终验证依据。
- `http://localhost:8081` Expo web smoke test:
  - 首页快照确认底部 tabs 已包含 `Medusa Store`、`Cart`、`Account` 三项，说明 account tab 经过 `IconSymbol` 映射修复后已正确注册。
  - 点击 `Account` tab 后成功进入游客态账户页，显示 `Sign In` / `Create Account` CTA。
  - 点击 `Sign In` 后成功进入 `/login`，显示登录表单。
  - 在登录页切换语言到 `Français` 后，国家选择、账户标题、登录文案、tab 标签均切换为法语。
  - 直接打开 `/checkout` 时，法语状态下可见 `Paiement` 与 `Aucun panier trouvé...` 文案，说明 checkout 也接入了同一套 i18n 上下文。
