import { Outlet } from "react-router-dom";

export default function ProjectLayout() {
    return (
        <>

            {/* <div className="flex h-screen bg-gray-100">
                <div className="w-64 bg-base-200">
                    <span>Drawer</span>
                </div>
                <div className="flex-1 flex flex-col">
                    <div className="h-screen bg-base-200 overflow-hidden sticky top-0 overflow-y-auto">
                        <span>Navbar</span>
                        <div className="overflow-y-auto">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div> */}

<div className="text-base-content">
  <div className="flex min-h-screen">
    {/* Sidebar */}
    <div className="w-64 bg-base-300 p-4">
      Sidebar
    </div>

    {/* Main Content Area */}
    <div className="flex-1 w-auto flex flex-col">
      {/* Navbar */}
      <div className="sticky top-0 z-10 bg-base-100 p-4 shadow">
        Navbar
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 bg-base-200">
        <Outlet />
      </main>

      {/* Footer (Not Sticky) */}
      <div className="bg-base-300 p-4 shadow">
        Footer
      </div>
    </div>
  </div>
</div>


        </>
    );
}
