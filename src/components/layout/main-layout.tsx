import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";

export function MainLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 pl-[60px]">
        <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
} 