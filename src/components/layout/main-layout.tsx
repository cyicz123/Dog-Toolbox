import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";

export function MainLayout() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 md:pl-[60px] pt-[60px] md:pt-0">
        <div className="container mx-auto p-4 md:flex md:items-center md:justify-center md:min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
} 