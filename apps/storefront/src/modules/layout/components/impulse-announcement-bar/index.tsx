"use client"

type ImpulseAnnouncementBarProps = {
  message: string
}

export default function ImpulseAnnouncementBar({
  message,
}: ImpulseAnnouncementBarProps) {
  const items = Array.from({ length: 8 }, (_, index) => `${message} · ${index + 1}`)

  return (
    <div
      className="relative overflow-hidden border-b py-2"
      style={{
        borderColor: "var(--pi-border)",
        background: "var(--pi-primary)",
        color: "var(--pi-button-text, #fff)",
      }}
    >
      <div className="impulse-marquee-track flex min-w-max items-center gap-8 px-4 text-[11px] font-semibold uppercase tracking-[0.2em]">
        {items.map((item) => (
          <span key={item} className="shrink-0">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
