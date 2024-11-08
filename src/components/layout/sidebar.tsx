import { Home, Sun, Moon, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Link, useLocation } from "react-router-dom";

export function Sidebar() {
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed left-0 top-0 h-screen w-[60px] bg-background border-r flex flex-col items-center py-4 space-y-4">
      <Link to="/">
        <Button
          variant="ghost"
          size="icon"
          className={isActive("/") ? "bg-accent" : ""}
        >
          <Home className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </Link>
      <div className="flex-1" />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? (
          <Sun className="h-[1.2rem] w-[1.2rem]" />
        ) : (
          <Moon className="h-[1.2rem] w-[1.2rem]" />
        )}
      </Button>
      <Link to="/about">
        <Button
          variant="ghost"
          size="icon"
          className={isActive("/about") ? "bg-accent" : ""}
        >
          <Info className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </Link>
    </div>
  );
} 