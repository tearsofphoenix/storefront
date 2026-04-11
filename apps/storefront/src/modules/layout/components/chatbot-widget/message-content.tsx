"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Fragment, ReactNode } from "react"

type ChatbotMessageContentProps = {
  content: string
}

type MarkdownBlock =
  | {
      type: "heading"
      level: number
      content: string
    }
  | {
      type: "paragraph"
      lines: string[]
    }
  | {
      type: "unordered-list"
      items: string[]
    }
  | {
      type: "ordered-list"
      items: string[]
    }
  | {
      type: "blockquote"
      lines: string[]
    }
  | {
      type: "table"
      headers: string[]
      rows: string[][]
    }
  | {
      type: "divider"
    }
  | {
      type: "code"
      language?: string
      content: string
    }

const INLINE_TOKEN_PATTERN =
  /(\[([^\]]+)\]\(((?:https?:\/\/|mailto:|\/)[^)\s]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*|https?:\/\/[^\s<]+)/g

const isBlankLine = (line: string) => line.trim().length === 0

const isHeadingLine = (line: string) => /^#{1,3}\s+/.test(line.trim())

const isDividerLine = (line: string) =>
  /^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())

const isUnorderedListLine = (line: string) => /^[-*]\s+/.test(line.trim())

const isOrderedListLine = (line: string) => /^\d+\.\s+/.test(line.trim())

const isBlockquoteLine = (line: string) => /^>\s?/.test(line.trim())

const isFenceLine = (line: string) => /^```/.test(line.trim())

const isTableSeparatorLine = (line: string) =>
  /^\|?[\s:-]+\|[\s|:-]*$/.test(line.trim())

const splitTableRow = (line: string) => {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim())
}

const isTableStart = (lines: string[], index: number) => {
  if (index + 1 >= lines.length) {
    return false
  }

  return lines[index].includes("|") && isTableSeparatorLine(lines[index + 1])
}

const isSafeHref = (href: string) => {
  if (href.startsWith("/")) {
    return true
  }

  if (href.startsWith("mailto:")) {
    return true
  }

  try {
    const parsedUrl = new URL(href)
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:"
  } catch {
    return false
  }
}

const isBlockStart = (lines: string[], index: number) => {
  const line = lines[index]

  return (
    isHeadingLine(line) ||
    isDividerLine(line) ||
    isUnorderedListLine(line) ||
    isOrderedListLine(line) ||
    isBlockquoteLine(line) ||
    isFenceLine(line) ||
    isTableStart(lines, index)
  )
}

const parseMarkdownBlocks = (content: string): MarkdownBlock[] => {
  const normalizedContent = content.replace(/\r\n/g, "\n")
  const lines = normalizedContent.split("\n")
  const blocks: MarkdownBlock[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]

    if (isBlankLine(line)) {
      index += 1
      continue
    }

    const fenceMatch = line.trim().match(/^```([\w-]+)?\s*$/)

    if (fenceMatch) {
      const codeLines: string[] = []
      const language = fenceMatch[1]
      index += 1

      while (index < lines.length && !isFenceLine(lines[index])) {
        codeLines.push(lines[index])
        index += 1
      }

      if (index < lines.length && isFenceLine(lines[index])) {
        index += 1
      }

      blocks.push({
        type: "code",
        language,
        content: codeLines.join("\n").replace(/\n+$/, ""),
      })
      continue
    }

    const headingMatch = line.trim().match(/^(#{1,3})\s+(.*)$/)

    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        content: headingMatch[2].trim(),
      })
      index += 1
      continue
    }

    if (isDividerLine(line)) {
      blocks.push({ type: "divider" })
      index += 1
      continue
    }

    if (isTableStart(lines, index)) {
      const tableLines = [lines[index]]
      index += 2

      while (
        index < lines.length &&
        !isBlankLine(lines[index]) &&
        lines[index].includes("|")
      ) {
        tableLines.push(lines[index])
        index += 1
      }

      const headers = splitTableRow(tableLines[0])
      const rows = tableLines.slice(1).map(splitTableRow)

      blocks.push({
        type: "table",
        headers,
        rows,
      })
      continue
    }

    if (isUnorderedListLine(line)) {
      const items: string[] = []

      while (index < lines.length && isUnorderedListLine(lines[index])) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ""))
        index += 1
      }

      blocks.push({
        type: "unordered-list",
        items,
      })
      continue
    }

    if (isOrderedListLine(line)) {
      const items: string[] = []

      while (index < lines.length && isOrderedListLine(lines[index])) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ""))
        index += 1
      }

      blocks.push({
        type: "ordered-list",
        items,
      })
      continue
    }

    if (isBlockquoteLine(line)) {
      const quoteLines: string[] = []

      while (index < lines.length && isBlockquoteLine(lines[index])) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ""))
        index += 1
      }

      blocks.push({
        type: "blockquote",
        lines: quoteLines,
      })
      continue
    }

    const paragraphLines: string[] = []

    while (index < lines.length && !isBlankLine(lines[index])) {
      if (paragraphLines.length > 0 && isBlockStart(lines, index)) {
        break
      }

      paragraphLines.push(lines[index].trimEnd())
      index += 1
    }

    blocks.push({
      type: "paragraph",
      lines: paragraphLines,
    })
  }

  return blocks
}

const renderLinkNode = (
  href: string,
  children: ReactNode,
  key: string
) => {
  if (!isSafeHref(href)) {
    return <Fragment key={key}>{children}</Fragment>
  }

  const sharedClassName =
    "font-medium text-grey-80 underline decoration-grey-30 underline-offset-4 transition-colors hover:text-grey-90 hover:decoration-grey-50"

  if (href.startsWith("/")) {
    return (
      <LocalizedClientLink key={key} href={href} className={sharedClassName}>
        {children}
      </LocalizedClientLink>
    )
  }

  return (
    <a
      key={key}
      href={href}
      target="_blank"
      rel="noreferrer"
      className={sharedClassName}
    >
      {children}
    </a>
  )
}

const renderInlineNodes = (content: string, keyPrefix: string): ReactNode[] => {
  const nodes: ReactNode[] = []
  let currentIndex = 0
  let tokenIndex = 0
  let match: RegExpExecArray | null

  const pattern = new RegExp(INLINE_TOKEN_PATTERN.source, "g")

  while ((match = pattern.exec(content)) !== null) {
    if (match.index > currentIndex) {
      nodes.push(content.slice(currentIndex, match.index))
    }

    const tokenKey = `${keyPrefix}-${tokenIndex}`

    if (match[2] && match[3]) {
      nodes.push(
        renderLinkNode(
          match[3],
          renderInlineNodes(match[2], `${tokenKey}-label`),
          tokenKey
        )
      )
    } else if (match[4]) {
      nodes.push(
        <code
          key={tokenKey}
          className="border border-[var(--pi-border)] bg-white/80 px-1.5 py-0.5 font-mono text-[12px] text-grey-80"
        >
          {match[4]}
        </code>
      )
    } else if (match[5]) {
      nodes.push(
        <strong key={tokenKey} className="font-semibold text-grey-90">
          {renderInlineNodes(match[5], `${tokenKey}-strong`)}
        </strong>
      )
    } else if (match[6]) {
      nodes.push(
        <em key={tokenKey} className="italic text-grey-80">
          {renderInlineNodes(match[6], `${tokenKey}-em`)}
        </em>
      )
    } else {
      nodes.push(renderLinkNode(match[0], match[0], tokenKey))
    }

    currentIndex = match.index + match[0].length
    tokenIndex += 1
  }

  if (currentIndex < content.length) {
    nodes.push(content.slice(currentIndex))
  }

  return nodes
}

const renderLines = (lines: string[], keyPrefix: string) => {
  return lines.map((line, index) => (
    <Fragment key={`${keyPrefix}-${index}`}>
      {index > 0 && <br />}
      {renderInlineNodes(line, `${keyPrefix}-line-${index}`)}
    </Fragment>
  ))
}

const ChatbotMessageContent = ({ content }: ChatbotMessageContentProps) => {
  const blocks = parseMarkdownBlocks(content)

  return (
    <div className="space-y-3 text-sm leading-6 text-grey-80">
      {blocks.map((block, index) => {
        const key = `block-${index}`

        switch (block.type) {
          case "heading": {
            const headingClassName =
              block.level === 1
                ? "text-base font-semibold text-grey-90"
                : "text-sm font-semibold text-grey-90"

            return (
              <h3 key={key} className={headingClassName}>
                {renderInlineNodes(block.content, `${key}-heading`)}
              </h3>
            )
          }
          case "paragraph":
            return (
              <p key={key} className="text-sm leading-6 text-grey-80">
                {renderLines(block.lines, `${key}-paragraph`)}
              </p>
            )
          case "unordered-list":
            return (
              <ul
                key={key}
                className="list-disc space-y-1 pl-5 text-sm leading-6 text-grey-80 marker:text-grey-50"
              >
                {block.items.map((item, itemIndex) => (
                  <li key={`${key}-item-${itemIndex}`}>
                    {renderInlineNodes(item, `${key}-item-${itemIndex}`)}
                  </li>
                ))}
              </ul>
            )
          case "ordered-list":
            return (
              <ol
                key={key}
                className="list-decimal space-y-1 pl-5 text-sm leading-6 text-grey-80 marker:text-grey-50"
              >
                {block.items.map((item, itemIndex) => (
                  <li key={`${key}-item-${itemIndex}`}>
                    {renderInlineNodes(item, `${key}-item-${itemIndex}`)}
                  </li>
                ))}
              </ol>
            )
          case "blockquote":
            return (
              <blockquote
                key={key}
                className="border-l-2 border-grey-30 pl-3 text-sm italic leading-6 text-grey-60"
              >
                {renderLines(block.lines, `${key}-quote`)}
              </blockquote>
            )
          case "table":
            return (
              <div
                key={key}
                className="overflow-x-auto border border-[var(--pi-border)] bg-white"
              >
                <table className="min-w-full border-collapse text-left text-[13px] leading-5 text-grey-70">
                  <thead className="bg-grey-5 text-grey-90">
                    <tr>
                      {block.headers.map((header, headerIndex) => (
                        <th
                          key={`${key}-header-${headerIndex}`}
                          className="border-b border-grey-20 px-3 py-2 font-semibold"
                        >
                          {renderInlineNodes(header, `${key}-header-${headerIndex}`)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rowIndex) => (
                      <tr
                        key={`${key}-row-${rowIndex}`}
                        className="border-t border-grey-20 align-top"
                      >
                        {row.map((cell, cellIndex) => (
                          <td
                            key={`${key}-row-${rowIndex}-cell-${cellIndex}`}
                            className="px-3 py-2"
                          >
                            {renderInlineNodes(
                              cell,
                              `${key}-row-${rowIndex}-cell-${cellIndex}`
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          case "divider":
            return <hr key={key} className="border-grey-20" />
          case "code":
            return (
              <div
                key={key}
                className="overflow-hidden border border-grey-20 bg-grey-90 text-white"
              >
                {block.language && (
                  <div className="border-b border-white/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/60">
                    {block.language}
                  </div>
                )}
                <pre className="overflow-x-auto px-3 py-3 text-[12px] leading-5">
                  <code>{block.content}</code>
                </pre>
              </div>
            )
        }
      })}
    </div>
  )
}

export default ChatbotMessageContent
