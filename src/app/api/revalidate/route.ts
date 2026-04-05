import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

type RevalidateRequestBody = {
  secret?: string
  tag?: string
  tags?: string[]
}

const normalizeTags = (
  request: NextRequest,
  body: RevalidateRequestBody
): string[] => {
  const tags = new Set<string>()
  const queryTags = request.nextUrl.searchParams.getAll("tag")

  for (const value of queryTags) {
    const normalized = value.trim()

    if (normalized) {
      tags.add(normalized)
    }
  }

  if (typeof body.tag === "string" && body.tag.trim()) {
    tags.add(body.tag.trim())
  }

  if (Array.isArray(body.tags)) {
    for (const value of body.tags) {
      const normalized = value?.trim()

      if (normalized) {
        tags.add(normalized)
      }
    }
  }

  return Array.from(tags)
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as RevalidateRequestBody
  const secretFromQuery = request.nextUrl.searchParams.get("secret")
  const secretFromHeader = request.headers.get("x-revalidate-secret")
  const secret = body.secret ?? secretFromHeader ?? secretFromQuery

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const tags = normalizeTags(request, body)

  if (tags.length === 0) {
    return NextResponse.json({ error: "Missing tag" }, { status: 400 })
  }

  for (const tag of tags) {
    revalidateTag(tag)
  }

  return NextResponse.json({
    now: Date.now(),
    revalidated: true,
    tags,
  })
}
