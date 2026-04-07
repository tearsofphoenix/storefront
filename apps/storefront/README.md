# Storefront

这个目录包含面向用户的 Medusa Storefront，技术栈为 Next.js 15、TypeScript、Tailwind CSS 与 Bun。

## 本地开发

```bash
cp .env.template .env
bun install
bun run dev
```

默认运行在 `http://localhost:8000`。

## 常用命令

```bash
bun run dev
bun run build
bun run start
bun run lint
```

## 关键环境变量

- `MEDUSA_BACKEND_URL`
- `NEXT_PUBLIC_MEDUSA_BACKEND_URL`
- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_BASE_URL`
- `PAYLOAD_CMS_URL`
- `REVALIDATE_SECRET`

更多变量说明见 [`.env.template`](./.env.template)。
