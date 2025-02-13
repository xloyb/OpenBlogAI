
"use client"
import type React from "react"
import { Icon } from "./Icon"

interface SidebarItemProps {
  href?: string
  icon: string
  text: string
  isSubmenu?: boolean
  isOpen?: boolean
  active?: boolean
  onClick?: () => void
  submenuItems?: Array<{ href: string; text: string }>
  collapsed?: boolean
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  href,
  icon,
  text,
  isSubmenu,
  isOpen,
  active,
  onClick,
  submenuItems,
  collapsed = false, // Default to false
}) => {
  return (
    <li className={`group ${active ? "text-[#5e63ff]" : "text-[#e6e6ef]"}`}>
      {isSubmenu ? (
        <>
          <button
            onClick={onClick}
            className={`w-full text-left bg-transparent border-none font-inherit cursor-pointer flex items-center gap-4 rounded-lg p-[0.85em] hover:bg-[#222533] md:w-full md:justify-start md:p-[0.85em] h-[60px] justify-center ${isOpen ? "rotate" : ""}`}
          >
            <Icon name={icon} /> {/* Icon is always visible */}
            <span className={`${collapsed ? "md:hidden" : "md:inline-block"}`}>{text}</span> {/* Text is hidden when collapsed */}
            <Icon
              name="chevron-down"
              className={`${collapsed ? "md:hidden" : "md:inline-block"} ml-auto`} // Chevron is hidden when collapsed
            />
          </button>
          <ul
            className={`list-none transition-all duration-300 ease-in-out md:grid ${isOpen ? "md:grid-rows-[1fr]" : "md:grid-rows-[0fr]"} md:static md:h-auto md:w-auto md:bg-transparent md:border-t-0 fixed bottom-[60px] left-0 box-border h-[60px] w-full bg-[#222533] border-t border-[#42434a] flex justify-center ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <div className="md:overflow-hidden md:pl-6 overflow-x-auto">
              {submenuItems?.map((item, index) => (
                <li key={index} className="md:block inline-flex">
                  <a
                    href={item.href}
                    className="md:rounded-lg md:p-[0.85em] md:justify-start box-border p-4 w-auto justify-center inline-flex items-center hover:bg-[#222533] text-[#e6e6ef] no-underline"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </div>
          </ul>
        </>
      ) : (
        // <a
        //   href={href}
        //   className={`flex items-center gap-4 rounded-lg p-[0.85em] hover:bg-[#222533] md:w-full md:justify-start md:p-[0.85em] w-[60px] h-[60px] justify-center ${active ? "text-[#5e63ff]" : "text-[#e6e6ef]"} no-underline`}
        // >
        //   <Icon name={icon} /> {/* Icon is always visible */}
        //   <span className={`${collapsed ? "md:hidden" : "md:inline-block"}`}>{text}</span> {/* Text is hidden when collapsed */}
        // </a>

        <>

          {href ? (
            <a
              href={href}
              onClick={onClick}
              className={`flex items-center gap-4 rounded-lg p-[0.85em] hover:bg-[#222533] md:w-full md:justify-start md:p-[0.85em] w-[60px] h-[60px] justify-center ${active ? "text-[#5e63ff]" : "text-[#e6e6ef]"} no-underline`}
            >
              <Icon name={icon} />
              <span className={`${collapsed ? "md:hidden" : "md:inline-block"}`}>{text}</span>
            </a>
          ) : (
            <button
              onClick={onClick}
              className={`flex items-center gap-4 rounded-lg p-[0.85em] hover:bg-[#222533] md:w-full md:justify-start md:p-[0.85em] w-[60px] h-[60px] justify-center ${active ? "text-[#5e63ff]" : "text-[#e6e6ef]"} no-underline border-none bg-transparent cursor-pointer`}
            >
              <Icon name={icon} />
              <span className={`${collapsed ? "md:hidden" : "md:inline-block"}`}>{text}</span>
            </button>
          )}

        </>












      )}
    </li>
  )
}