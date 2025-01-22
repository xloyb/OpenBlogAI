import type React from "react";
import { JSX } from "react";
import { FaChevronLeft, FaHome, FaTachometerAlt, FaPlus, FaClipboardList, FaCalendarAlt, FaUser } from "react-icons/fa";

interface IconProps {
  name: string;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, className = "" }) => {
  const icons: { [key: string]: JSX.Element } = {
    "chevron-left": <FaChevronLeft className={className} />,
    home: <FaHome className={className} />,
    dashboard: <FaTachometerAlt className={className} />,
    create: <FaPlus className={className} />,
    todo: <FaClipboardList className={className} />,
    calendar: <FaCalendarAlt className={className} />,
    profile: <FaUser className={className} />,
  };

  return icons[name] || null;
};
