import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { checkForUpdates } from "@/lib/updater";

export function MainLayout() {
  // 程序启动时检查更新
  useEffect(() => {
    checkForUpdates();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <main className="flex flex-1 justify-center md:pl-[60px] pt-[60px] md:pt-0">
          <Outlet />
      </main>
    </div>
  );
} 