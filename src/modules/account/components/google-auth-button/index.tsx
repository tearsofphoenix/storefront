"use client"

import { sdk } from "@lib/config"
import { useI18n } from "@lib/i18n/use-i18n"
import { getBaseURL } from "@lib/util/env"
import ErrorMessage from "@modules/checkout/components/error-message"
import { Button } from "@medusajs/ui"
import { useParams, useSearchParams } from "next/navigation"
import { useState } from "react"

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
        className="h-11 w-full rounded-md"
        isLoading={isPending}
        onClick={handleGoogleLogin}
        data-testid="google-auth-button"
      >
        {isPending
          ? messages.account.googleAuthRedirecting
          : messages.account.continueWithGoogle}
      </Button>
      <ErrorMessage
        error={error ?? callbackError}
        data-testid="google-auth-error-message"
      />
    </div>
  )
}

export default GoogleAuthButton
