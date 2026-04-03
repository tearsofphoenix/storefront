import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of Use",
}

export default function TermsOfUsePage() {
  return (
    <div className="py-12 flex flex-col items-start justify-start min-h-[calc(100vh-64px)] content-container max-w-3xl mx-auto">
      <h1 className="text-3xl-semi text-ui-fg-base mb-8">Terms of Use</h1>
      <div className="text-base-regular text-ui-fg-subtle text-left w-full space-y-4">
        <p>This is a placeholder for the Terms of Use.</p>
        <p>Please update this page with your actual terms of use content.</p>
      </div>
    </div>
  )
}
