# Payload Blank Template

This template comes configured with the bare minimum to get started on anything you need.

## Quick start

This template can be deployed directly from our Cloud hosting and it will setup MongoDB and cloud S3 object storage for media.

## Quick Start - local setup

To spin up this template locally, follow these steps:

### Clone

After you click the `Deploy` button above, you'll want to have standalone copy of this repo on your machine. If you've already cloned this repo, skip to [Development](#development).

### Development

1. First [clone the repo](#clone) if you have not done so already
2. `cd my-project && cp .env.example .env` to copy the example environment variables. You'll need to add the `MONGODB_URL` from your Cloud project to your `.env` if you want to use S3 storage and the MongoDB database that was created for you.

3. `pnpm install && pnpm dev` to install dependencies and start the dev server
4. open `http://localhost:3000` to open the app in your browser

That's it! Changes made in `./src` will be reflected in your app. Follow the on-screen instructions to login and create your first admin user. Then check out [Production](#production) once you're ready to build and serve your app, and [Deployment](#deployment) when you're ready to go live.

#### Docker (Optional)

If you prefer to use Docker for local development instead of a local MongoDB instance, the provided docker-compose.yml file can be used.

To do so, follow these steps:

- Modify the `MONGODB_URL` in your `.env` file to `mongodb://127.0.0.1/<dbname>`
- Modify the `docker-compose.yml` file's `MONGODB_URL` to match the above `<dbname>`
- Run `docker-compose up` to start the database, optionally pass `-d` to run in the background.

## How it works

The Payload config is tailored specifically to the needs of most websites. It is pre-configured in the following ways:

### Collections

See the [Collections](https://payloadcms.com/docs/configuration/collections) docs for details on how to extend this functionality.

- #### Users (Authentication)

  Users are auth-enabled collections that have access to the admin panel.

  For additional help, see the official [Auth Example](https://github.com/payloadcms/payload/tree/main/examples/auth) or the [Authentication](https://payloadcms.com/docs/authentication/overview#authentication-overview) docs.

- #### Media

  This is the uploads enabled collection. It features pre-configured sizes, focal point and manual resizing to help you manage your pictures.

### Docker

Alternatively, you can use [Docker](https://www.docker.com) to spin up this template locally. To do so, follow these steps:

1. Follow [steps 1 and 2 from above](#development), the docker-compose file will automatically use the `.env` file in your project root
1. Next run `docker-compose up`
1. Follow [steps 4 and 5 from above](#development) to login and create your first admin user

That's it! The Docker instance will help you get up and running quickly while also standardizing the development environment across your teams.

## Questions

If you have any issues or questions, reach out to us on [Discord](https://discord.com/invite/payload) or start a [GitHub discussion](https://github.com/payloadcms/payload/discussions).

## Production migrations

This project uses PostgreSQL and keeps migrations in `src/migrations`.

Before opening `/admin` on a new environment, run the initial migration against the same database used by the deployed app:

```bash
cd apps/payload-cms
DATABASE_URL="postgres://..." PAYLOAD_SECRET="your-secret" pnpm migrate
```

Useful commands:

```bash
pnpm migrate:status
pnpm migrate:create <name>
pnpm sync:products
```

For Vercel deployments, use the production `DATABASE_URL` and `PAYLOAD_SECRET` from the project settings or run the command from a shell that has the same values exported.

This repo also includes `vercel.json`, which runs `pnpm run build:vercel` so Vercel deploys execute migrations before building the app.

当你新增了 Payload plugin（例如 `@payloadcms/storage-s3`）后，必须重新生成 `src/app/(payload)/admin/importMap.js`。现在 `pnpm build` 和 `pnpm dev` 已经自动先执行 `pnpm generate:importmap`，避免部署后出现 `PayloadComponent not found in importMap`。

## Media uploads with Cloudflare R2

线上部署在 Vercel 时，`media` 不能继续依赖本地 `staticDir` 持久化，所以这个项目现在通过 `@payloadcms/storage-s3` 接 Cloudflare R2。

需要在 `payload-cms` 这个 Vercel 项目中配置：

```bash
R2_BUCKET=your-bucket
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://media.your-domain.com
```

说明：

- `R2_ENDPOINT` 是 R2 的 S3 API endpoint，只用于上传
- `R2_PUBLIC_URL` 是前台与 Payload Admin 实际访问文件的公开域名
- 如果以上变量没有配齐，Payload 会退回本地存储；这在 Vercel 上通常不可持续，因此线上应视为未配置完成

## Medusa product sync

Payload product pages can be created from Medusa in two ways:

1. Push from Medusa backend to `/api/integrations/medusa/products`
2. Pull from Payload CMS by running:

```bash
cd apps/payload-cms
MEDUSA_BACKEND_URL="https://your-medusa" \
MEDUSA_STOREFRONT_PUBLISHABLE_KEY="pk_..." \
pnpm sync:products
```

同步行为说明：

- 首次同步会自动为每个 Medusa 商品创建一个 `product-pages` 文档。
- 新创建的文档默认就是 `published`，这样 storefront 能立即读取到它。
- 如果某个商品后来在 Medusa 中不存在了，下一次全量同步会把对应页面标记为 `syncStatus = deleted`，storefront 会自动忽略它。
- 在这个 monorepo 里，`pnpm sync:products` 会优先读取 `apps/payload-cms/.env`，如果缺少 Medusa 变量，会自动回退读取 `apps/storefront/.env`。

You can also trigger a protected manual sync over HTTP:

```bash
curl -X POST https://your-payload-domain/api/integrations/medusa/products/sync \
  -H "x-payload-sync-secret: your-secret" \
  -H "content-type: application/json" \
  --data '{"limit":100}'
```

## Building a marketing-style product page

`product-pages` 现在支持一套适合长页叙事型 PDP 的区块：

- `section-nav`
- `hero`
- `commerce-callout`
- `feature-grid`
- `media-story`
- `comparison-table`
- `quote-showcase`
- `spec-table`
- `faq`
- `cta`

推荐的编辑顺序：

1. 先运行 `pnpm sync:products` 导入 Medusa 商品
2. 在 Payload Admin 打开对应的 `product-pages`
3. 按顺序添加 `hero -> section-nav -> media-story / feature-grid -> comparison-table -> quote-showcase -> commerce-callout -> faq -> cta`
4. 如果页面中放了 `commerce-callout`，storefront 会自动切换到 CMS-first 的营销型产品页布局，并把购买区插入到你指定的位置
