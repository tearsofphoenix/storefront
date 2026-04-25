# Fix Robots Route Warning

**Date**: 2026-04-25  
**Owner**: Codex  
**Package**: medusa-next (`apps/storefront`)  

## Problem

Production Vercel logs show this warning when `/robots.txt` is requested:

```text
[regions] 未找到国家代码 "robots.txt" 对应的 Region，请检查 Medusa Admin 中该 Region 的 Countries 配置。
```

Code evidence:

- `apps/storefront/src/middleware.ts` returns `NextResponse.next()` for paths containing `.`, so `/robots.txt` is not redirected to a country-prefixed URL.
- `apps/storefront/src/app` has no root `robots.ts`, `robots.txt`, or equivalent route resource.
- `apps/storefront/public` has no `robots.txt`.
- `apps/storefront/src/lib/data/regions.ts` warns when `getRegion(countryCode)` receives a value not present in the Medusa region map.

The likely route path is: `/robots.txt` is not served as a root metadata/static resource, then the App Router dynamic `[countryCode]` route treats `robots.txt` as `countryCode`, which reaches `getRegion("robots.txt")`.

## Goal

Serve `/robots.txt` as a real root robots resource so it never reaches the country-aware storefront route or `getRegion`.

## Non-Goals

- Do not silence or remove the `getRegion` warning as the primary fix.
- Do not change Medusa Region/Countries configuration.
- Do not redesign sitemap generation unless code evidence proves it is required for this bug.
- Do not make unrelated SEO, navigation, or route changes.

## Requirements

- Use a standard Next.js App Router-compatible approach for root robots handling.
- Keep the robots policy aligned with the existing `apps/storefront/next-sitemap.js` intent:
  - allow `/`
  - disallow `/checkout`
  - disallow `/account/*`
- Keep the fix scoped to `apps/storefront`.
- Preserve existing TypeScript/Next.js style.

## Acceptance Criteria

- Requesting `/robots.txt` is handled by a root robots resource, not by `[countryCode]`.
- The region warning for country code `robots.txt` is no longer expected for `/robots.txt` requests.
- `bun run lint` completes or any blocker is documented with exact output.
- `bun run build` completes or any blocker is documented with exact output.

## Verification Notes

If feasible, run the storefront locally and request `/robots.txt` to confirm it returns robots content rather than the localized home page.
