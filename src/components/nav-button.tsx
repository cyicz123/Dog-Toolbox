import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";

export function NavButton() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const handleClick = () => {
    if (!isHome) {
      navigate("/");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className={!isHome ? "hover:bg-accent" : "bg-accent"}
    >
      {isHome ? (
        <Home className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <ArrowLeft className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  );
} 