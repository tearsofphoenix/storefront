<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# 整理一個完整的 markdown 開發計劃給我

可以，下面是一份可直接复制的 **Markdown 开发计划**，我按你当前的技术前提来写：你现在使用的是 Medusa v2，已有 OpenRouter key，而且目标优先是 storefront 里的 FAQ / 客服型 chatbot，而不是先做真人即时聊天。
这个计划默认不直接复用 `medusa-ai-assistant` 旧项目，因为它是基于旧版 Medusa 架构思路的参考实现，更适合借鉴交互与流程，而不是在 Medusa v2 中直接安装运行。[^1][^2]

## 项目开发计划

### 1. 项目目标

- 项目名称：Medusa v2 FAQ / Customer Support Chatbot。
- 项目目标：在 Medusa storefront 中提供一个 AI 客服入口，用于回答常见问题、商品相关问题、配送与退换货说明，并在无法回答时引导用户转人工或留下联系方式。
- 第一阶段不做真人即时聊天系统，因为这类需求更适合知识问答型 bot；ConnectyCube 这类插件更偏实时消息通道，而不是 FAQ 知识型客服主场景。[^3]
- 模型层使用 OpenRouter，因为它提供 OpenAI SDK 兼容接入，也支持和 Vercel AI SDK / OpenAI SDK 生态组合使用，便于后续切换模型与控制成本。[^4][^5][^6]


### 2. 范围定义

- 本期范围包括：聊天浮窗 UI、FAQ 问答、政策问答、商品基础信息问答、简单售前导购、失败兜底、日志记录与后台可配置知识源。
- 本期不包括：真人坐席系统、复杂 CRM、工单流转、语音客服、多语言自动翻译、订单敏感操作自动执行。[^3]
- 如果后续需要人工客服，再在第二阶段补接实时聊天通道；当前阶段优先验证“AI 是否能有效分担 FAQ 与售前咨询”。[^3]


### 3. 目标用户

- 目标用户一：进入商品页或首页后，希望快速了解商品差异、配送时间、付款方式、退换货政策的访客。
- 目标用户二：已经准备下单，但对规格、适用场景、售后政策还有疑问的准买家。
- 目标用户三：站点运营人员，他们需要低成本维护 FAQ、常见回复模板和知识库内容，而不是每次都改代码。[^7][^8]


### 4. 技术原则

- 核心原则一：Medusa 继续负责商品、价格、variant、库存等电商数据，chatbot 只读取必要信息，不直接承担核心交易逻辑。[^9]
- 核心原则二：知识问答内容与动态商品数据分层处理，避免把所有客服语料都硬塞进 prompt，便于维护和扩展。[^9]
- 核心原则三：前端聊天体验与后端 AI 能力解耦，后端更换模型时不影响 storefront UI。[^5][^4]
- 核心原则四：先做“能回答 80% 常见问题”的稳定版，再考虑推荐、转化优化和自动化操作。


## 系统架构

### 5. 架构总览

- 前端层：Next.js storefront 内嵌一个聊天浮窗组件，支持消息流式输出、预设问题、商品页上下文注入和失败重试。[^6][^5]
- API 层：自建 `/api/chat` 或等效后端接口，负责接收用户问题、整理上下文、检索知识、调用 OpenRouter、返回答案。[^10][^4]
- 数据层：一部分来自 Medusa v2 商品与店铺数据，一部分来自 FAQ / policy / shipping / returns 等知识内容源。[^9]
- 管理层：Medusa v2 Admin 可通过 widget 或自定义后台页增加“客服知识配置”入口，因为 v2 支持基于 routes 和 widgets 的 Admin 扩展。[^8][^7]


### 6. 模块拆分

- `storefront-chat-widget`：负责聊天按钮、弹窗、消息列表、输入框、预设问题、状态提示。[^5]
- `chat-api`：负责系统 prompt、模型选择、知识检索、回答生成、失败兜底。[^4][^6]
- `knowledge-base`：负责 FAQ、政策、配送、退货、支付说明、品牌故事与高频商品知识。
- `medusa-context-adapter`：负责按商品 handle / id 拉取商品标题、价格区间、variant、库存状态等动态信息。[^9]
- `admin-config`：负责维护 FAQ 数据源、启用状态、欢迎语、转人工提示和模型参数。[^7][^8]


### 7. 推荐技术栈

- 前端：Next.js storefront + React 聊天组件。
- AI 调用：优先使用 OpenAI SDK 或 Vercel AI SDK 接 OpenRouter，因为 OpenRouter 官方支持 OpenAI SDK 兼容接入，也有 AI SDK 生态说明。[^6][^4][^5]
- 后端：优先放在 storefront 的 server route 或独立 Node 服务中，避免把 chatbot 逻辑直接耦合进 Medusa 核心业务层。[^9]
- 配置面板：使用 Medusa v2 Admin customization，通过 routes 或 widgets 注入管理入口。[^8][^7]


## 数据与知识库

### 8. 知识源设计

- 第一批知识源建议只放 5 类：FAQ、配送说明、退换货政策、付款方式、核心商品卖点。
- 这些内容应由运营可编辑，避免把答案硬编码在 prompt 中，否则后续更新成本会非常高。[^7]
- 商品动态数据只取最必要字段，例如标题、价格、是否有货、variant 名称和缩略图，避免把整个 product payload 原样塞给模型。[^9]


### 9. 数据结构建议

- `faq_items`：问题、标准答案、分类、关键词、启用状态、优先级。
- `support_policies`：配送、退款、发票、付款等长文档内容。
- `chatbot_settings`：欢迎语、兜底语、是否显示推荐问题、默认模型、温度、最大上下文长度。[^8][^7]
- `product_support_summary`：针对重点商品维护“客服摘要”，让模型优先读取结构化卖点，而不是直接啃完整商品详情页内容。


### 10. 检索策略

- 第一阶段可以不用复杂向量数据库，先用“分类 + 关键词 + 人工精选 FAQ”完成首版，尽快上线验证。
- 第二阶段再补轻量 RAG，把 FAQ、政策与商品摘要做 embedding 检索，提高长尾问题召回率。[^5]
- 对高风险问题采用“命中知识源才回答，否则保守兜底”的策略，避免模型胡说。[^10][^4]


## 对话与产品逻辑

### 11. 对话能力边界

- 能回答：FAQ、配送时效、退款条件、付款方式、商品差异、适用场景、基础规格解释。
- 慎重回答：库存实时性、物流承诺、价格优惠、订单异常，因为这些信息具有时效性或业务风险。[^9]
- 不自动执行：取消订单、修改地址、退款审批、补发等操作；这些动作后续若要做，也应通过明确工具调用和权限校验实现。[^9]


### 12. 商品页上下文注入

- 当用户在 product detail 页打开聊天框时，自动注入当前商品的 `title`、`handle`、`price`、选中的 variant 等上下文，减少用户重复描述成本。
- 如果页面是首页或分类页，则仅注入店铺级 FAQ 与政策，不强塞商品上下文。
- 这样既能让回答更像“懂当前页面的客服”，又能避免无关信息污染 prompt。


### 13. Prompt 设计

- 系统 prompt 应明确角色是“客服与 FAQ 助手”，而不是泛用聊天机器人。
- Prompt 中必须写清三条规则：只依据提供的知识源回答、无法确认时要明确说明、涉及政策与价格时优先引用后台数据而不是猜测。[^4][^10]
- 还应加上回答风格约束，例如简洁、友好、优先给行动建议、不要编造不存在的优惠或库存。


## 开发阶段

### 14. Phase 0：需求与内容梳理（1–2 天）

- 盘点当前站点最常见的 20–50 个客服问题，并按“下单前 / 下单后 / 商品咨询 / 政策问题”分类。
- 确认第一阶段必须回答的范围，冻结 MVP 边界，避免一开始就把 bot 做成万能客服。
- 同时准备一版知识素材初稿，保证开发阶段有真实内容可以测试。


### 15. Phase 1：MVP 后端（2–4 天）

- 建立 `/api/chat`，接收 `messages + pageContext + productContext`，再转发到 OpenRouter。[^10][^4]
- 使用 OpenAI SDK 兼容方式对接 OpenRouter，这样后续切换模型或 provider 时改动最小。[^6][^4]
- 先实现最基础的“FAQ 命中 + prompt 拼接 + 回答返回 + 失败兜底”。


### 16. Phase 2：Storefront 聊天 UI（2–4 天）

- 在 storefront 中加入浮动聊天按钮、弹窗、消息列表、加载状态、错误状态与预设提问按钮。[^5]
- 商品页需要支持自动识别当前商品，并在首轮对话中带上商品上下文。
- 首版先追求稳定与清晰，不必一开始就做复杂动画和高度拟人化体验。


### 17. Phase 3：知识配置后台（3–5 天）

- 在 Medusa v2 Admin 中添加自定义 route 或 widget，用来维护 FAQ、政策文案、欢迎语与模型设置，因为 v2 支持通过 routes 和 widgets 扩展管理后台。[^7][^8]
- 第一版后台只做简单表单与开关即可，不必立即做复杂表格、版本控制和审批流。[^7]
- 如果不想把所有内容都放 Medusa Admin，也可以先把知识内容放外部 CMS，再在后台只保留配置入口。[^9]


### 18. Phase 4：质量优化（3–7 天）

- 增加日志：记录用户问题、命中知识源、模型返回、失败率和转人工次数，用于后续优化。
- 增加安全兜底：敏感问题黑名单、长度限制、速率限制、异常 fallback。[^4][^10]
- 增加答案模板：对“退款 / 配送 / 无法判断”这类高风险场景统一口径，降低胡说概率。


### 19. Phase 5：第二阶段增强（后续）

- 引入轻量 RAG 或向量检索，提高长尾问题命中率。[^5]
- 引入商品推荐与对比能力，让 bot 能回答“这两个型号有什么区别”。
- 若业务真的需要真人接管，再接入 ConnectyCube 这类实时聊天方案，把 AI 作为前置分流层。[^3]


## 交付物

### 20. 第一阶段交付物

- 一个可在 storefront 使用的聊天浮窗。
- 一个可工作的 `/api/chat` 服务，已接 OpenRouter，并支持至少一个模型配置。[^6][^4]
- 一套基础知识库，包括 FAQ、配送、退换货、付款方式、重点商品卖点。
- 一个简单后台入口，用于维护欢迎语、常见问题和启用状态。[^8][^7]


### 21. 第二阶段交付物

- 商品页上下文增强回答。
- 检索增强与日志面板。
- 更完整的运营配置，包括分类管理、优先级和回复模板。[^7]


## 验收标准

### 22. MVP 验收标准

- 用户能在 storefront 任意页面打开聊天框并成功发送问题。
- bot 能正确回答至少 80% 的高频 FAQ，并在无法确认时明确表示不确定而不是编造答案。
- 商品页提问时，bot 能感知当前商品上下文并给出更相关的回答。
- 后台可修改欢迎语、FAQ 与基础配置，而不需要重新部署前端代码。[^8][^7]


### 23. 运营验收标准

- 运营人员能在 10 分钟内新增一条 FAQ 并验证前台生效。[^7]
- 站点管理员能快速切换默认模型或停用 bot。[^4][^6]
- 日志中能够看出“哪些问题命中知识库、哪些问题失败、哪些需要补充内容”。


## 风险与应对

### 24. 主要风险

- 风险一：模型幻觉，尤其在物流承诺、优惠信息、库存状态这类高风险问题上。[^10][^4]
- 风险二：知识库不完整，导致 bot 明明模型能力足够，但回答质量仍然差。
- 风险三：把过多业务逻辑放进 prompt，而不是做清晰的数据分层，后续会越来越难维护。[^9]


### 25. 应对策略

- 对高风险问题采用“保守回答 + 引导人工”的策略。
- 先做人审过的 FAQ 与政策答案，再逐步扩充自动能力。
- 所有动态业务数据都通过明确接口读取，不依赖模型猜测。[^9]


## 推荐实施顺序

### 26. 建议排期

1. 第 1 周：整理 FAQ、完成 OpenRouter API 接入、跑通最小聊天接口。[^4]
2. 第 2 周：完成 storefront 聊天浮窗、商品页上下文、基础回答体验。
3. 第 3 周：补 Medusa Admin 配置页 / widget、日志、兜底策略。[^8][^7]
4. 第 4 周：灰度上线、收集问题、补知识库、再决定是否进入 RAG 或真人客服阶段。[^3]

## 实施备注

- 不建议直接迁移 `medusa-ai-assistant` 代码本体，因为它更适合作为思路参考，不是 Medusa v2 的现成兼容插件。[^2][^1]
- 当前最优策略是：**Medusa v2 + 自建 chatbot API + OpenRouter + 可配置知识库 + storefront 浮窗**。[^6][^4]
- 等第一阶段稳定后，再决定是否接 CMS、向量检索或真人客服系统。[^3][^5]

我可以下一条继续帮你把这份计划扩展成 **项目目录结构 + API 设计 + 数据表设计** 的开发文档。
<span style="display:none">[^11][^12][^13][^14][^15][^16][^17][^18][^19]</span>

<div align="center">⁂</div>

[^1]: https://github.com/VariableVic/medusa-ai-assistant

[^2]: https://docs.medusajs.com/learn/introduction/from-v1-to-v2

[^3]: https://connectycube.com/2025/05/08/connectycube-chat-widget-now-available-for-medusa-js-commerce-platform/

[^4]: https://openrouter.ai/docs/guides/community/openai-sdk

[^5]: https://openrouter.ai/docs/guides/community/frameworks-and-integrations-overview

[^6]: https://ai-sdk.dev/providers/community-providers/openrouter

[^7]: https://www.youtube.com/watch?v=cN00rKsV0Po

[^8]: https://docs.medusajs.com/resources/commerce-modules/inventory/admin-widget-zones

[^9]: https://docs.medusajs.com/learn/introduction/build-with-llms-ai

[^10]: https://openrouter.ai/docs/quickstart

[^11]: https://zread.ai/medusajs/medusa-starter-plugin/11-admin-customizations-and-widgets

[^12]: https://docs.medusajs.com/resources/commerce-modules/region/admin-widget-zones

[^13]: https://skills-rank.com/ko/skill/medusajs/medusa-agent-skills/building-admin-dashboard-customizations

[^14]: https://www.youtube.com/watch?v=4HcLQuI-tmg

[^15]: https://www.together.ai/blog/medusa

[^16]: https://www.youtube.com/watch?v=yOTCwokS0qY

[^17]: https://github.com/FasterDecoding/Medusa

[^18]: https://www.youtube.com/watch?v=HeL-beZ7aTM

[^19]: https://www.youtube.com/watch?v=6AVzVXGUH7E

