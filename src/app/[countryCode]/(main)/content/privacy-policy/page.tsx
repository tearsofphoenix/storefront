import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 flex flex-col items-start justify-start min-h-[calc(100vh-64px)] content-container max-w-3xl mx-auto">
      <h1 className="text-3xl-semi text-ui-fg-base mb-8">Privacy Policy</h1>
      <div className="text-base-regular text-ui-fg-subtle text-left w-full space-y-4">
        <p>This is a placeholder for the Privacy Policy.</p>
        <p>Please update this page with your actual privacy policy content.</p>
      </div>
    </div>
  )
}
