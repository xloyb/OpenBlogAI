import { MdOutlineSupportAgent } from "react-icons/md";
import SidebarItem from "./SidebarItem";



const Sidebar = () => {
    
  return (
    <div className="h-screen overflow-hidden sticky top-0 z-30 overflow-x-hidden ">
      <div className="z-50 drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          {/* Page content here */}
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-100 text-base-content min-h-full w-80 p-4 flex flex-col">
            {/* Sidebar content here */}
            <div className="btn">Responsive</div>
            
            <SidebarItem to="/" icon={<MdOutlineSupportAgent size={24} />} text="Home" />

            <SidebarItem to="/support" icon={<MdOutlineSupportAgent size={24} />} text="Support" />
            <SidebarItem to="/support" icon={<MdOutlineSupportAgent size={24} />} text="Support" />

            <h1>SideBar</h1>
          </ul>
        </div>
      </div>
    </div>

    
  );
};


export default Sidebar;


