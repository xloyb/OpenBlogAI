"use client";
import type React from "react";
import { Icon } from "./Icon";

interface SidebarItemProps {
  href?: string;
  icon: string;
  text: string;
  isSubmenu?: boolean;
  isOpen?: boolean;
  active?: boolean;
  onClick?: () => void;
  submenuItems?: Array<{ href: string; text: string }>;
  collapsed?: boolean;
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
  collapsed = false,
}) => {
  return (
    <li className={`group ${active ? "text-primary-600 dark:text-primary-400" : "text-gray-700 dark:text-gray-300"}`}>
      {isSubmenu ? (
        <>
          <button
            onClick={onClick}
            className={`w-full text-left bg-transparent border-none font-inherit cursor-pointer flex items-center gap-4 rounded-lg p-[0.85em] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors md:w-full md:justify-start md:p-[0.85em] h-[60px] justify-center ${isOpen ? "rotate" : ""}`}
          >
            <Icon name={icon} />
            <span className={collapsed ? "hidden" : "hidden md:inline-block"}>{text}</span>
            <Icon
              name="chevron-down"
              className={`${collapsed ? "hidden" : "hidden md:inline-block"} ml-auto`}
            />
          </button>
          <ul
            className={`list-none transition-all duration-300 ease-in-out md:grid ${isOpen ? "md:grid-rows-[1fr]" : "md:grid-rows-[0fr]"} md:static md:h-auto md:w-auto md:bg-transparent md:border-t-0 fixed bottom-[60px] left-0 box-border h-[60px] w-full bg-gray-100 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-center ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <div className="md:overflow-hidden md:pl-6 overflow-x-auto">
              {submenuItems?.map((item, index) => (
                <li key={index} className="md:block inline-flex">
                  <a
                    href={item.href}
                    className="md:rounded-lg md:p-[0.85em] md:justify-start box-border p-4 w-auto justify-center inline-flex items-center hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 no-underline transition-colors"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </div>
          </ul>
        </>
      ) : (
        <>
          {href ? (
            <a
              href={href}
              onClick={onClick}
              className={`flex items-center gap-4 rounded-lg p-[0.85em] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors md:w-full md:justify-start md:p-[0.85em] w-[60px] h-[60px] justify-center ${active ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20" : "text-gray-700 dark:text-gray-300"} no-underline`}
            >
              <Icon name={icon} />
              <span className={collapsed ? "hidden" : "hidden md:inline-block"}>{text}</span>
            </a>
          ) : (
            <button
              onClick={onClick}
              className={`flex items-center gap-4 rounded-lg p-[0.85em] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors md:w-full md:justify-start md:p-[0.85em] w-[60px] h-[60px] justify-center ${active ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20" : "text-gray-700 dark:text-gray-300"} no-underline border-none bg-transparent cursor-pointer`}
            >
              <Icon name={icon} />
              <span className={collapsed ? "hidden" : "hidden md:inline-block"}>{text}</span>
            </button>
          )}
        </>
      )}
    </li>
  );
};