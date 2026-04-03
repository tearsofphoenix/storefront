import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Customer Service",
  description: "Customer Service",
}

export default function CustomerServicePage() {
  return (
    <div className="py-12 flex flex-col items-start justify-start min-h-[calc(100vh-64px)] content-container max-w-3xl mx-auto">
      <h1 className="text-3xl-semi text-ui-fg-base mb-8">Customer Service</h1>
      <div className="text-base-regular text-ui-fg-subtle text-left w-full space-y-4">
        <p>This is a placeholder for Customer Service.</p>
        <p>Please update this page with your actual customer service content and FAQs.</p>
      </div>
    </div>
  )
}
