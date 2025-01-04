import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function ProjectLayout() {
  return (
    <>
      <div className="text-base-content">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <div>
            <Sidebar />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 w-auto flex flex-col">
            {/* Navbar */}

            <div className="sticky top-0 bg-base-100 p-4 shadow">
              <label htmlFor="my-drawer-2" className="drawer-button md:hidden">
                <div tabIndex={0} role="button" className="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h7"
                    />
                  </svg>
                </div>
              </label>
              Navbar
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 bg-base-200">
              <Outlet />
            </main>

            <div className="bg-base-300 p-4 shadow">Footer</div>
          </div>
        </div>
      </div>
    </>
  );
}
