import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { NavButton } from "@/components/nav-button";
import { AboutTooltip } from "@/components/about-tooltip";

export function Sidebar() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed top-0 w-full md:w-[60px] h-[60px] md:h-screen bg-background border-b md:border-b-0 md:border-r flex flex-row md:flex-col items-center justify-between md:justify-start px-4 md:px-0 md:py-4 md:space-y-4 z-50">
      <NavButton />
      <div className="hidden md:block md:flex-1" />
      <div className="flex flex-row md:flex-col items-center gap-2 md:gap-4">
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
        <AboutTooltip />
      </div>
    </div>
  );
} 