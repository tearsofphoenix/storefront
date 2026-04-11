import React from "react"

type RewardIconProps = {
  className?: string
}

const RewardIcon: React.FC<RewardIconProps> = ({ className = "" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="9" r="5" />
      <path d="m9.5 20 2.5-2 2.5 2v-6.2" />
      <path d="m12 6 1.1 2.1 2.4.3-1.8 1.7.4 2.4-2.1-1.1-2.1 1.1.4-2.4-1.8-1.7 2.4-.3L12 6Z" />
    </svg>
  )
}

export default RewardIcon
