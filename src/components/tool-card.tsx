import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  className?: string;
}

export function ToolCard({ title, description, icon: Icon, to, className }: ToolCardProps) {
  return (
    <Link to={to}>
      <div
        className={cn(
          "w-[200px] p-6 rounded-lg border bg-card shadow-lg hover:shadow-xl transition-shadow",
          "flex flex-col items-center text-center space-y-4",
          className
        )}
      >
        <div className="p-3 rounded-full bg-primary/10">
          <Icon className="h-8 w-8" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </Link>
  );
} 