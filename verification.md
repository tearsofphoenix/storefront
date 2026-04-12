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

## 2026-04-12 Expo storefront account profile completion

- `cd apps/expo-storefront && bun run lint`: passed，新增 `profile` 页面、账户概览入口、customer profile 更新逻辑以及地址编辑缺失态后，Expo lint 仍保持通过。
- `cd apps/expo-storefront && bunx tsc --noEmit`: passed，TypeScript 已确认：
  - `customer-context` 新增的 `updateCustomer` 接口与 `sdk.store.customer.update` 类型兼容。
  - `account/profile` 路由与 `_layout.tsx` 的注册一致。
  - `messages.ts` 新增的 `profile` / `profileDescription` / `profileSaved` / `addressNotFound` 等键在三种语言下结构一致。
- 功能结论：
  - 账户页现在具备登录注册、订单列表/详情、地址簿/编辑，以及资料页中的姓名/电话更新能力。
  - 电子邮件在资料页中展示为只读，这与当前 web storefront 对账户邮箱更新的处理范围保持一致。
  - 地址编辑在目标地址缺失时不再静默回退为“新增地址”，而是给出明确返回入口。

## 2026-04-12 Expo checkout saved-address completion

- `cd apps/expo-storefront && bun run lint`: passed，checkout delivery step 新增 saved-address 选择与 billing 同步逻辑后，Expo lint 仍保持通过。
- `cd apps/expo-storefront && bunx tsc --noEmit`: passed，TypeScript 已确认：
  - `DeliveryStep` 新增的 saved-address props 与 `checkout.tsx` 中的状态处理函数类型一致。
  - 当前区域地址过滤、saved-address 选中回填，以及 `useSameForBilling` 的同步逻辑均可通过编译。
- 功能结论：
  - 已登录用户在 delivery step 中可以直接选择当前区域内的已保存地址，不再只能依赖默认预填或手工输入。
  - 选择 saved shipping address 时，如果 billing 与 shipping 共用，同步会立即反映到 billing 状态。
  - 重新打开 `Use same address for billing` 时，billing 会回到当前 shipping 值，避免隐藏状态滞后。

## 2026-04-12 Expo quantity-limit completion

- `cd apps/expo-storefront && bun run lint`: passed，商品详情与购物车数量上限逻辑接入后，Expo lint 仍保持通过。
- `cd apps/expo-storefront && bunx tsc --noEmit`: passed，TypeScript 已确认：
  - `lib/inventory.ts` 的共享数量上限 helper 能同时服务商品详情与购物车项。
  - `allow_backorder`、`manage_inventory` 与 `inventory_quantity` 的组合逻辑可正常通过编译。
- 功能结论：
  - 商品详情页不会再无限增加数量；当选定变体到达前端允许上限时，加号会禁用，并在变体切换后自动回落到合法数量。
  - 购物车项的数量增加也遵守同一套库存上限逻辑，避免用户在前端把数量点到明显超库存的区间。
  - 对不追踪库存或允许 backorder 的变体，仍保留 storefront 风格的上限兜底，而不是错误地锁死加购。

## 2026-04-12 Expo home live-branding completion

- `cd apps/expo-storefront && bun run lint`: passed，首页站点名与 featured banner 改动未引入新的 Expo lint 错误。
- `cd apps/expo-storefront && bunx tsc --noEmit`: passed，TypeScript 已确认：
  - `getStorefrontSiteName` 的 Expo config / manifest 读取逻辑可被 home stack 与 tabs 复用。
  - 首页 `homepage-featured` 集合与 banner 商品图加载逻辑可通过编译。
- 功能结论：
  - 首页顶部的商店名称不再使用硬编码文案，而是优先读取 Expo 环境与 manifest 中的真实站点名。
  - 首页顶部图片不再使用硬编码外链，而是优先取 `homepage-featured` 集合中的真实商品图片，并在缺失时回退到首个集合或首页首个商品。
  - Home tab 与 home stack 标题现在与实际 storefront branding 保持一致。

## 2026-04-12 Expo chatbot tab completion

- `cd apps/expo-storefront && bun run lint`: passed，新增 chatbot tab、消息渲染组件、product-aware 入口与 i18n 文案后，Expo lint 仍保持通过。
- `cd apps/expo-storefront && bunx tsc --noEmit`: passed，TypeScript 已确认：
  - `sdk.client.fetch("/store/chatbot/settings")` 与 `sdk.client.fetchStream("/store/chatbot/message")` 的聊天状态流在 Expo 页面中可正常通过编译。
  - chatbot tab 路由、商品详情页跳转入口、消息 parts 渲染组件与新增 i18n 键的类型关系一致。
- 功能结论：
  - Expo tabs 现在新增了一个 AI chatbot 页面，使用与 web storefront 相同的 settings / message store routes 与流式协议。
  - 聊天页支持 welcome message、suggested questions、reset、status/chunk/done/error 处理，以及 `text` / `product-list` / `product-detail` 三类消息 part 展示。
  - 商品详情页新增“Ask AI about this product”入口，进入 chatbot tab 时会携带当前商品上下文，向现有 chatbot route 发送 `product_context` 以对齐 storefront 的 product-aware 支持。

## 2026-04-12 Expo chatbot native-send fix

- `cd apps/expo-storefront && bun run lint`: passed，chatbot native 发送策略调整后未引入新的 Expo lint 错误。
- `cd apps/expo-storefront && bunx tsc --noEmit`: passed，TypeScript 已确认 native/web 分支下的消息返回结构与现有聊天状态更新逻辑兼容。
- 调试结论：
  - `GET /store/chatbot/settings` 在线返回正常。
  - 使用同一套 Medusa JS SDK 在本地脚本中调用 `sdk.client.fetchStream("/store/chatbot/message")` 时，可收到 `status` / `chunk` / `done` 事件，说明后端协议本身正常。
  - 因此本次回归收敛到 Expo 原生运行时的流式消费差异，而不是 chatbot 路由或请求体整体错误。
- 修复结论：
  - Expo chatbot 在原生端现在改为使用 `sdk.client.fetch("/store/chatbot/message")` 发送普通 POST，请求成功后直接复用返回的 `message` / `parts` / `sources` / `handoff_message` 更新会话。
  - Web 端仍保留 `sdk.client.fetchStream(...)` 的流式体验，因此不会回退既有浏览器行为。

## 2026-04-12 Expo account Google login completion

- `cd apps/expo-storefront && bun run lint`: passed，Google 登录的 context、callback route、登录页状态与 i18n 接入后未引入新的 Expo lint 错误。
- `cd apps/expo-storefront && bunx tsc --noEmit`: passed，TypeScript 已确认：
  - `customer-context` 新增的 `loginWithGoogle` / `completeGoogleLogin` 与 Medusa SDK `auth.login` / `auth.callback` / `auth.refresh` 的调用签名兼容。
  - 新增的 `app/oauth/google.tsx` callback route 与 `app/_layout.tsx` 的路由注册一致。
  - 登录页 `auth_error=google` 的错误映射，以及 `messages.ts` 中新增的 Google 登录文案在 `en-US`、`fr-FR`、`zh-Hant` 下结构一致。
- 实现结论：
  - Expo 账户登录页现在支持 Google 登录，并复用 web storefront 的 Medusa OAuth 完成逻辑：回调后解析 JWT、缺失 `actor_id` 时创建 customer、必要时刷新 token，然后刷新 customer 状态并迁移 cart。
  - Google OAuth callback 现在落到真实的 Expo Router 路由 `/oauth/google`，避免深链回调命中不存在页面；Expo Go 下回调 URL 使用 `Constants.linkingUri`，development build / standalone 则继续使用 app scheme。
  - 登录页新增 Google 登录按钮、重定向中状态、错误提示，以及 `GOOGLE_AUTH_*` 错误码到 i18n 文案的映射。
- 未完成的自动化验证：
  - 本地未执行完整 Google OAuth 端到端登录，因为这一步依赖外部 Google 授权页面与实际登录会话，不适合在当前无人工交互的本地自动化流程中伪造。

## 2026-04-12 Expo account Google register-entry completion

- `cd apps/expo-storefront && bun run lint`: passed，register 页补齐 Google 登录入口后未引入新的 Expo lint 错误。
- `cd apps/expo-storefront && bunx tsc --noEmit`: passed，TypeScript 已确认：
  - register 页对 `loginWithGoogle` 的调用与现有 customer-context 类型兼容。
  - register 页新增的 Google loading/error 映射与现有 account i18n 结构兼容。
- 实现结论：
  - Expo register 页现在与 web storefront 一样，在 email/password 注册表单下方提供 Google 登录入口。
  - register 页复用了 login 页相同的 redirect URL 生成策略与 `GOOGLE_AUTH_*` 错误映射，没有新增底层鉴权实现。
- 未完成的自动化验证：
  - 本地未执行完整 Google OAuth 外部授权流，原因同上，仍依赖真实 Google 登录会话。

## 2026-04-12 Expo account guest Google entry completion

- `cd apps/expo-storefront && bun run lint`: passed，游客态 Google 登录入口与共享账户认证 helper 接入后未引入新的 Expo lint 错误。
- `cd apps/expo-storefront && bunx tsc --noEmit`: passed，TypeScript 已确认：
  - 新增的 `lib/account-auth.ts` 可同时被 `login.tsx`、`register.tsx` 与 `member-only-state.tsx` 复用。
  - `MemberOnlyState` 对 `loginWithGoogle` 的调用及错误文案解析与现有 i18n 结构兼容。
- 实现结论：
  - Expo 的游客态账户入口现在支持直接 Google 登录，不再必须先进入 login/register 页面；account、orders、addresses、profile 等所有复用 `MemberOnlyState` 的受限页面都会显示该入口。
  - Google redirect URL 生成与账户认证错误映射已抽成共享 helper，login/register 不再各自维护重复逻辑。
- 未完成的自动化验证：
  - 本地未执行完整 Google OAuth 外部授权流，原因同上，仍依赖真实 Google 登录会话。

## 2026-04-13 Expo app scheme rename to panda

- `cd apps/expo-storefront && bun run lint`: passed，Expo scheme 从 `pandacommercemobile` 改为 `panda` 后未引入新的 lint 错误。
- `cd apps/expo-storefront && bunx tsc --noEmit`: passed，TypeScript 已确认 scheme 变更未影响现有 Expo 代码编译。
- 实现结论：
  - Expo app scheme 已从 `pandacommercemobile` 改为 `panda`，因此移动端默认 Google OAuth fallback callback 也随之变为 `panda://oauth/google`。
  - `account-auth.ts` 仍通过 Expo runtime 动态生成 callback URL，不需要额外代码改动。
- 配置注意：
  - Medusa 后端中的 `GOOGLE_CALLBACK_URL` 和 Google Console 中涉及移动端的 callback / redirect 配置，都应同步改为新 scheme。

## 2026-04-13 Google OAuth fixed callback routing for storefront and Expo

- `cd apps/storefront && bun run lint`: passed，新增固定 Google OAuth callback route 与 mobile bridge route 后，storefront lint 通过。
- `cd apps/expo-storefront && bun run lint`: passed，Expo Google callback helper 改为优先使用 storefront HTTPS callback 后，Expo lint 通过。
- `cd apps/expo-storefront && bunx tsc --noEmit`: passed，TypeScript 已确认 Expo callback helper 拆分为 `callback_url` 与 app return URL 后编译正常。
- 实现结论：
  - Web storefront 的 Google 登录不再使用带国家代码的动态 callback，例如 `/hk/account/google`；现在统一改为固定 callback：`/api/auth/google`。
  - Web 登录按钮会在发起 OAuth 前写入 `_google_auth_country_code` cookie，Google 登录完成后固定 callback route 再按该 cookie 重定向回对应的 `/{countryCode}/account`。
  - Expo Google 登录的 `callback_url` 现在优先走 storefront 的固定 HTTPS mobile bridge：`{EXPO_PUBLIC_STOREFRONT_URL}/api/auth/mobile/google`，bridge 再 302 到 `panda://oauth/google`。
  - Expo `openAuthSessionAsync` 仍监听 app deep link `panda://oauth/google`，避免把 HTTPS callback 错当成原生 return URL。
- 最终需要注册到 Google Cloud Console 的 Authorized redirect URIs：
  - storefront web: `https://estore.pandacat.ai/api/auth/google`
  - Expo mobile bridge: `https://estore.pandacat.ai/api/auth/mobile/google`
- 最终需要配置的环境变量：
  - storefront `NEXT_PUBLIC_BASE_URL=https://estore.pandacat.ai`
  - Expo `EXPO_PUBLIC_STOREFRONT_URL=https://estore.pandacat.ai`
  - Medusa 后端 `GOOGLE_CALLBACK_URL=https://estore.pandacat.ai/api/auth/google`
- 配置注意：
  - 旧的 `https://estore.pandacat.ai/hk/account/google` 这类动态国家路径不应再注册到 Google Cloud Console，也不应再作为 Medusa Google callback 使用。
  - `panda://oauth/google` 不是 Google Cloud Console 的 redirect URI；它只作为 Expo app 内部 deep link，由 storefront mobile bridge 负责跳转过去。
