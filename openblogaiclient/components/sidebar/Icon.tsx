import type React from "react";
import { JSX } from "react";
import { FaChevronLeft, FaHome, FaTachometerAlt, FaPlus, FaClipboardList, FaCalendarAlt, FaUser } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";

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
    logout: <IoLogOut  className={className} />,

  };

  return icons[name] || null;
};
