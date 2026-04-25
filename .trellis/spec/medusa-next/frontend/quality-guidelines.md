# Quality Guidelines

> Code quality standards for frontend development.

---

## Overview

<!--
Document your project's quality standards here.

Questions to answer:
- What patterns are forbidden?
- What linting rules do you enforce?
- What are your testing requirements?
- What code review standards apply?
-->

(To be filled by the team)

---

## Forbidden Patterns

<!-- Patterns that should never be used and why -->

(To be filled by the team)

---

## Required Patterns

<!-- Patterns that must always be used -->

### Root Metadata And Static Routes

**What**: Root App Router metadata/static resources such as `src/app/robots.ts`
must be allowed to resolve as root resources and must not fall through to the
country-aware `[countryCode]` route.

**Why**: Dotted paths like `/robots.txt` are not country routes. If middleware
does region work before static-resource bypass logic, these requests can still
perform unnecessary region lookups or trigger country-route behavior.

**Required checks**:
- Use a standard Next.js App Router root resource for metadata routes, for
  example `src/app/robots.ts` for `/robots.txt`.
- Keep middleware static-asset bypasses before region map fetching, country
  detection, cookie writes, or redirects.
- Do not silence `getRegion` warnings to fix root metadata/static route issues;
  fix route ownership or middleware ordering instead.

---

## Testing Requirements

<!-- What level of testing is expected -->

(To be filled by the team)

---

## Code Review Checklist

<!-- What reviewers should check -->

(To be filled by the team)
