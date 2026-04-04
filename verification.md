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
