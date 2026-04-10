"use client"

import { CheckCircle } from "@medusajs/icons"
import { clx, Heading } from "@medusajs/ui"
import { useRouter } from "next/navigation"

type StepCardProps = {
  title: string
  isActive: boolean
  isDone: boolean
  path: string
  children: React.ReactNode
}

export const StepCard = ({
  title,
  isActive,
  isDone,
  path,
  children
}: StepCardProps) => {
  const router = useRouter()

  return (
    <div
      className={clx(
        "bg-white rounded-lg py-4 px-6 w-full",
        "flex gap-4 flex-col shadow-sm border border-gray-200",
        !isActive && "cursor-pointer hover:shadow-md transition-shadow"
      )}
      onClick={() => {
        if (isActive) return
        router.push(path)
      }}
    >
      <Heading level="h2" className="flex justify-between items-center">
        <span>{title}</span>
        {isDone && <CheckCircle className="text-ui-tag-green-icon" />}
      </Heading>
      {isActive && children}
    </div>
  )
}
