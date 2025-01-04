import { NavLink } from "react-router-dom";

interface SidebarItemProps {
  to: string;
  icon: JSX.Element;
  text: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, text }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-3 p-3 rounded transition m-3 ${
          isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700"
        }`
      }
    >
      {icon}
      <span className="text-sm">{text}</span>
    </NavLink>
  );
};

export default SidebarItem;
