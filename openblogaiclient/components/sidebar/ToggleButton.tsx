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
      className={`pointer-events-auto p-2 border-none rounded-xl bg-slate-100 hover:bg-slate-200 cursor-pointer transition-all duration-300 text-slate-600 hover:text-slate-800 shadow-sm hover:shadow-md ${isOpen ? "" : "rotate-180"
        }`}
    >
      <Icon name="chevron-left" />
    </button>
  )
}

