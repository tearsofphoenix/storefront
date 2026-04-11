import { deleteLineItem } from "@lib/data/cart"
import { Spinner, Trash } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { useState } from "react"

const DeleteButton = ({
  id,
  children,
  className,
  onDelete,
  ...buttonProps
}: {
  id: string
  children?: ReactNode
  className?: string
  onDelete?: (id: string) => Promise<void>
} & ComponentPropsWithoutRef<"button">) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    await (onDelete ? onDelete(id) : deleteLineItem(id)).catch(() => {
      setIsDeleting(false)
    })
  }

  return (
    <div
      className={clx(
        "flex items-center justify-between text-small-regular",
        className
      )}
    >
      <button
        type="button"
        className="flex gap-x-1 text-ui-fg-subtle hover:text-ui-fg-base cursor-pointer"
        onClick={() => handleDelete(id)}
        {...buttonProps}
      >
        {isDeleting ? <Spinner className="animate-spin" /> : <Trash />}
        <span>{children}</span>
      </button>
    </div>
  )
}

export default DeleteButton
