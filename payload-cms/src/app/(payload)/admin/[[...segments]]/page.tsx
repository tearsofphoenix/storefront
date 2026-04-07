/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
import type { Metadata } from 'next'
import React from 'react'

import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const formatError = (error: unknown) => {
  if (error instanceof Error) {
    return {
      message: error.message,
      name: error.name,
      stack: error.stack,
      digest: (error as Error & { digest?: string }).digest,
      cause:
        error.cause instanceof Error
          ? {
              message: error.cause.message,
              name: error.cause.name,
              stack: error.cause.stack,
            }
          : error.cause,
    }
  }

  return {
    error,
  }
}

const Page = async ({ params, searchParams }: Args) => {
  try {
    return await RootPage({ config, params, searchParams, importMap })
  } catch (error) {
    const formattedError = formatError(error)

    console.error('[payload-cms] admin route render failed', formattedError)

    return (
      <html lang="en">
        <body
          style={{
            background: '#111',
            color: '#f5f5f5',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            margin: 0,
            padding: '24px',
          }}
        >
          <h1>Payload Admin Render Error</h1>
          <pre
            style={{
              background: '#1f1f1f',
              borderRadius: '8px',
              overflowX: 'auto',
              padding: '16px',
              whiteSpace: 'pre-wrap',
            }}
          >
            {JSON.stringify(formattedError, null, 2)}
          </pre>
        </body>
      </html>
    )
  }
}

export default Page
