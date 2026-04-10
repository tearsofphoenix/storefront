"use client"

import { sdk } from "@lib/config"
import { useI18n } from "@lib/i18n/use-i18n"
import { getBaseURL } from "@lib/util/env"
import ErrorMessage from "@modules/checkout/components/error-message"
import { Button } from "@medusajs/ui"
import { useParams, useSearchParams } from "next/navigation"
import { useState } from "react"

const GoogleLogo = () => {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.805 12.23c0-.77-.069-1.508-.197-2.215H12v4.19h5.49a4.694 4.694 0 0 1-2.036 3.08v2.56h3.292c1.926-1.774 3.059-4.39 3.059-7.615Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.76 0 5.073-.915 6.764-2.475l-3.292-2.56c-.915.615-2.083.98-3.472.98-2.67 0-4.93-1.803-5.738-4.225H2.86v2.642A10 10 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.262 13.72A5.996 5.996 0 0 1 5.94 12c0-.597.103-1.176.287-1.72V7.638H2.86A10 10 0 0 0 2 12c0 1.612.386 3.14 1.07 4.462l3.192-2.742Z"
        fill="#FBBC05"
      />
      <path
        d="M12 6.055c1.5 0 2.846.516 3.907 1.528l2.93-2.93C17.07 2.99 14.756 2 12 2A10 10 0 0 0 2.86 7.638l3.367 2.642C7.07 7.858 9.33 6.055 12 6.055Z"
        fill="#EA4335"
      />
    </svg>
  )
}

const getGoogleCallbackUrl = (countryCode: string) => {
  const baseUrl = getBaseURL().replace(/\/$/, "")

  return `${baseUrl}/${countryCode}/account/google`
}

const GoogleAuthButton = () => {
  const { messages } = useI18n()
  const params = useParams()
  const searchParams = useSearchParams()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const countryCode = params.countryCode as string

  const callbackError =
    searchParams.get("auth_error") === "google"
      ? messages.account.googleAuthError
      : null

  const handleGoogleLogin = async () => {
    setError(null)
    setIsPending(true)

    try {
      const result = await sdk.auth.login("customer", "google", {
        callback_url: getGoogleCallbackUrl(countryCode),
      })

      if (typeof result === "string") {
        window.location.assign(`/${countryCode}/account`)
        return
      }

      window.location.assign(result.location)
    } catch {
      setError(messages.account.googleAuthUnavailable)
      setIsPending(false)
    }
  }

  return (
    <div className="mt-4 w-full">
      <Button
        type="button"
        variant="secondary"
        className="h-11 w-full !rounded-none !border-[var(--rm-border)] !bg-white"
        isLoading={isPending}
        onClick={handleGoogleLogin}
        data-testid="google-auth-button"
      >
        <span className="inline-flex items-center gap-2">
          <GoogleLogo />
          <span>
            {isPending
              ? messages.account.googleAuthRedirecting
              : messages.account.continueWithGoogle}
          </span>
        </span>
      </Button>
      <ErrorMessage
        error={error ?? callbackError}
        data-testid="google-auth-error-message"
      />
    </div>
  )
}

export default GoogleAuthButton
