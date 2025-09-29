import type React from "react"
import { Icon } from "./Icon"

interface ToggleButtonProps {
  onClick: () => void
  isOpen: boolean
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({ onClick, isOpen }) => {
  return (
    <button
      onClick={onClick}
      className={`ml-auto p-4 border-none rounded-lg bg-transparent cursor-pointer hover:bg-base-200 text-base-content ${isOpen ? "" : "rotate-180"}`}
    >
      <Icon name="chevron-left" />
    </button>
  )
}

