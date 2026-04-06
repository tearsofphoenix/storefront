# Verification

- 日期：2026-04-04 21:42:54 +0800
- 执行者：Codex

## 已完成验证

1. `bun run lint` 通过。
2. `bun run build` 通过。
3. `rg -n 'DEBUG:' src` 无结果，确认临时调试日志已清理。
4. 线上 `https://estore-admin.pandacat.ai/store/regions`、`/store/collections`、`/store/products` 已返回有效数据。

## 功能性结论

- `src/lib/data/regions.ts` 现在会每次基于最新的 `/store/regions` 结果重建国家码映射，不再持有 `force-cache` 造成的旧 Region 列表。
- `src/middleware.ts` 现在使用 `no-store` 拉取地区数据，并将进程内缓存窗口缩短到 60 秒，同时在重建映射前清空旧数据。
- 若后台 Region 仍未关联 `Taiwan`，服务端日志会输出明确警告，帮助继续定位到 Medusa Admin 配置。
- storefront 的本地环境变量现已改为线上 Medusa backend `https://estore-admin.pandacat.ai` 和新的 publishable key；该 backend 已验证能返回 `tw` region、collection 与商品数据。
- 商品图片 URL 现在会在渲染前被统一规范化为合法的绝对地址，`estore-cf.pandacat.ai` 也已加入 Next 图片域名白名单。

## 残余风险

- 首页与部分页面在 `region` 为空时仍保持既有的 `return null` 行为；这不是本次回归问题，但若需要更好的故障体验，可后续改为显式错误页或引导页。
- 若本地 `bun run dev` 已经在运行，需要重启开发服务器使新的 `.env` 生效。
- 若本地 `bun run dev` 已经在运行，也需要重启一次使新的 `next.config.js` 图片域名配置生效。

## 2026-04-04 Theme 改造验证

1. `bun run lint` 通过。
2. `bun run build` 通过。
3. 首页已收敛为双栏 hero + featured products 主结构。
4. 导航、页脚、商品列表页、产品卡与 PDP 已切换为更接近 `my-nuxt-storefront` 的白底、细边框、轻阴影与传统双栏布局。
5. 商品图库与缩略图已接入图片 URL 规范化逻辑，并与 `next.config.js` 的新增图片域名配置一起通过构建。

## Theme 改造结论

- 全局视觉基线已从原有玻璃拟态与大圆角风格收敛为更简洁的参考主题外观。
- 首页、列表页与 PDP 的信息结构已经贴近参考项目，而现有 Medusa 数据流、购物车逻辑和动态路由保持不变。
- 本地工作区仍存在其他未提交业务改动：`src/lib/data/cart.ts`、`src/lib/data/fulfillment.ts`、`src/lib/i18n/messages.ts`、`src/modules/checkout/components/shipping/index.tsx`。本次 theme 提交未包含这些文件。

## 2026-04-05 多 sales channel 库存报错修复验证

- 日期：2026-04-05 11:37:00 +0800
- 执行者：Codex

### 已完成验证

1. `bun run lint` 通过。
2. `bun run build` 通过。
3. 直接请求远端 `/store/products` 验证到：
   - 不带 `sales_channel_id` 且请求 `+variants.inventory_quantity` 时返回 400。
   - 带合法 `sales_channel_id` 后，同一路径返回 200。
4. 在隔离 dev server `http://localhost:8001` 上请求 `/tw`，返回 200。
5. 在隔离 dev server `http://localhost:8001/tw/products/remarkable-paper-pro` 上请求商品页，返回 200。
6. dev 日志确认 storefront 发往远端的商品请求已自动附带 `sales_channel_id`。
7. 对远端 `/store/carts` 做 payload 矩阵测试，确认缺少 `sales_channel_id` 时返回 400，携带 `region_id + sales_channel_id` 时创建 cart 返回 200。
8. 直接调用远端 `/store/carts/{id}/line-items` 添加 `variant_01KNA62JAV1RCYRS52KES947JM` 返回 200，购物车主链路可用。

### 功能性结论

- `src/lib/data/sales-channels.ts` 现在会为 storefront 统一解析单一 sales channel，优先读取 `MEDUSA_STOREFRONT_SALES_CHANNEL_ID`，未配置时自动从当前 publishable key 可见商品中探测可用 channel。
- `src/lib/data/products.ts` 现在会在请求库存字段时自动补充 `sales_channel_id`，消除 seed 后多 sales channel 上下文导致的 inventory availability 400。
- `src/lib/data/cart.ts` 现在会在创建/同步购物车时带上相同的 `sales_channel_id`，避免商品展示与购物车上下文继续分叉。
- `.env.template` 已补充 `MEDUSA_STOREFRONT_SALES_CHANNEL_ID` 说明，便于后续显式锁定 storefront sales channel。
- 远端 `cart create` 与 `line item add` 都已验证成功，说明本次 storefront 修复覆盖了实际加购所需的关键上下文。

### 残余风险

- 当前自动探测策略基于 storefront 可见商品聚合 sales channels；如果未来同一个 publishable key 同时暴露多个互不等价的 channel 组合，建议在线上环境显式设置 `MEDUSA_STOREFRONT_SALES_CHANNEL_ID`，避免回退策略选错 channel。
- 隔离 dev server 启动时存在 `EMFILE: too many open files, watch` 文件监听告警；本次 smoke test 仍然成功返回 200，但本地长期开发建议提升文件句柄上限或减少并行 watcher。

## 2026-04-05 线上部署差异排查

- 日期：2026-04-05 12:01:00 +0800
- 执行者：Codex

### 线上现象

1. `https://estore.pandacat.ai/tw/store` 返回 200，但商品列表为空。
2. `https://estore.pandacat.ai/tw/products/remarkable-paper-pro` 在线上直接返回 404。
3. 线上页脚中的 categories / collections 也为空，说明不是单一商品组件渲染问题，而是整组 storefront 数据都没有拿到。

### 代码层对照

- `src/app/[countryCode]/(main)/products/[handle]/page.tsx` 中，`getRegion(countryCode)` 返回空时会直接 `notFound()`，这正好解释了线上商品页 404。
- `src/modules/store/templates/paginated-products.tsx` 中，`getRegion(countryCode)` 返回空时会 `return null`，这正好解释了线上列表页标题还在、商品区却为空。
- `src/lib/data/categories.ts` 与 `src/lib/data/collections.ts` 都会在请求失败时吞掉异常并返回空数组，这正好解释了线上 footer 的 categories / collections 同时为空。

### 对照实验

- 使用当前同一份代码，本地以错误环境启动：
  - `MEDUSA_BACKEND_URL=http://127.0.0.1:9999`
  - `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_bad`
- 结果与线上高度一致：
  - `/tw/store` 返回 200 且列表为空
  - `/tw/products/remarkable-paper-pro` 返回 404

### 结论

- 根因不是“线上跑的代码和本地不同”，而是“线上运行时环境变量和本地不同”，导致 storefront 的服务端请求无法正常拿到 Medusa store 数据。
- 最可能缺失或错误的变量：
  1. `MEDUSA_BACKEND_URL`
  2. `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` 或 `MEDUSA_STOREFRONT_PUBLISHABLE_KEY`
  3. 在多 sales channel 场景下，建议同时补上 `MEDUSA_STOREFRONT_SALES_CHANNEL_ID`

### 额外证据

- `../store-pandacat-ai/DEPLOY_RAILWAY_VERCEL.md` 明确要求在 Vercel 设置 `MEDUSA_BACKEND_URL`，但没有清晰列出 `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`。
- `../store-pandacat-ai/DEPLOY_1PANEL.md` 中又使用了 `MEDUSA_PUBLISHABLE_KEY` 这个不同名字，存在把变量配错到生产环境的实际风险。

## 2026-04-05 Vercel 按需重验证改造验证

- 日期：2026-04-05 16:02:00 +0800
- 执行者：Codex

### 已完成验证

1. storefront `bun run lint` 通过。
2. storefront `bun run build` 通过。
3. backend `pnpm build` 通过。
4. `src/lib/data/cookies.ts` 的 `getCacheOptions` 已改为同时输出全局 tag 与 scoped tag。
5. `src/app/api/revalidate/route.ts` 已新增受 `REVALIDATE_SECRET` 保护的 POST webhook，并支持一次重验证一个或多个 tags。
6. `../store-pandacat-ai/backend/src/subscribers/revalidate-storefront-products.ts` 已监听 `product.created`、`product.updated`、`product.deleted` 并回调 storefront 的 revalidate 接口。

### 功能性结论

- 现有 storefront 数据请求不需要改调用点，只要继续使用 `getCacheOptions(tag)`，就会自动同时带上：
  - 全局业务 tag，例如 `products`
  - 既有 scoped tag，例如 `products-${_medusa_cache_id}`
- 这样可以兼顾两类失效场景：
  - 前端用户动作继续按 scoped tag 做局部刷新
  - Railway 后端 webhook 按固定业务 tag 做全站按需重验证
- backend subscriber 默认会重验证 `products`、`categories`、`collections`，覆盖商品详情、商品列表以及分类/集合挂载关系的典型变动面。

### 残余风险

- 当前仅完成构建级验证，尚未在线上实际触发一次商品更新事件来观察 Vercel 缓存失效链路。
- 如果后续希望缩小失效范围，可以在 backend 使用 `STOREFRONT_REVALIDATE_TAGS` 调整发送的 tags 集合。

## 2026-04-05 Stripe Apple Pay / Google Pay / Link 支持验证

- 日期：2026-04-05 16:27:00 +0800
- 执行者：Codex

### 已完成验证

1. `bun run lint` 通过。
2. `./node_modules/.bin/tsc --noEmit` 通过。
3. `bun run build` 通过。
4. backend `pnpm build` 通过，确认 `automatic_payment_methods` 配置未破坏 Medusa 构建。
5. `src/modules/checkout/components/payment-container/index.tsx` 已修复 JSX 结构，并切换为 `LinkAuthenticationElement` + `PaymentElement`。
6. `src/modules/checkout/components/payment/index.tsx` 已恢复 Stripe 支付方式列表渲染，并正确传递 `paymentComplete` 与 `paymentType` 状态。
7. `src/modules/checkout/components/payment-button/index.tsx` 已使用 `elements.submit()` + `stripe.confirmPayment()` 完成最终确认流程。

### 功能性结论

- 当前 storefront 的 Stripe 卡支付入口已经升级为 `PaymentElement`，因此可在同一支付区块内承载 Card、Apple Pay、Google Pay 与 Link。
- checkout 仍保持原有的 `payment -> review -> place order` 流程，未引入 `ExpressCheckoutElement` 或额外的快捷跳转分支。
- 支付详情摘要会优先展示用户在 Stripe Element 中选择的支付类型，无法识别时回退为通用的 `Card, Apple Pay, Google Pay, or Link` 文案。

### 残余风险

- Apple Pay、Google Pay、Link 是否在真实页面展示，仍取决于 Stripe Dashboard 的域名注册、浏览器能力、设备能力以及 HTTPS 环境。
- backend 的 `automatic_payment_methods` 配置需要在 Medusa 服务重启或重新部署后才会在线上真正生效；本次已完成本地构建验证，但尚未在线上设备环境中逐项回归 Apple Pay、Google Pay、Link 的真实展示条件。

## 2026-04-05 PDP variant 图片抖动修复验证

- 日期：2026-04-05 17:18:00 +0800
- 执行者：Codex

### 已完成验证

1. `bun run lint` 通过。
2. `./node_modules/.bin/tsc --noEmit` 通过。
3. `bun run build` 通过。
4. storefront 的 `ProductActions` 已修复 `options -> URL -> options` 双向竞争更新，消除 variant 选择状态来回切换。
5. storefront 的 PDP 图片解析已同时兼容：
   - Medusa 原生 `variant.images`
   - `@meduline/medusa-plugin-variant-images` 风格的 `variant.metadata.images` / `variant.metadata.thumbnail`
6. 直接请求线上 `https://estore-admin.pandacat.ai/store/products` 并带上 `sales_channel_id=sc_01KNA3VMRMV0VXMS4087DNSAAE` 与 `fields=*variants.calculated_price,+variants.inventory_quantity,*variants.images,+variants.metadata,+metadata,+tags,` 返回 200，确认新增 `+variants.metadata` 查询未破坏接口。

### 功能性结论

- 当前 backend `package.json` 为 Medusa `2.13.1`，且未安装 `medusa-variant-images` / `@meduline/medusa-plugin-variant-images`；结合真实接口返回 `variant.images` 非空、`variant.metadata` 为 `null`，可确认现网现在使用的是 Medusa 原生 variant images。
- 因此本次没有强行安装旧插件，而是让 storefront 兼容原生与插件两种字段结构，既解决当前抖动 bug，也保留未来切换到 metadata 结构的兼容性。

### 残余风险

- 当前线上商品样本返回的 `variant.metadata` 仍为空，说明插件路径尚未被真实数据覆盖；相关兼容逻辑已通过类型和构建验证，但还未在带 metadata 图片的真实商品上做浏览器级回归。
