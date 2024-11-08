import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface ToolCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  to: string;
  className?: string;
}

export function ToolCard({ title, description, icon: Icon, to, className }: ToolCardProps) {
  return (
    <Link to={to}>
      <div
        className={cn(
          "h-[60px] w-full rounded-lg border bg-card shadow-lg hover:shadow-xl transition-all",
          "md:h-auto md:w-[200px]",
          "flex flex-row md:flex-col items-center md:text-center",
          "px-4 md:p-6",
          "gap-4 md:gap-4",
          className
        )}
      >
        <div className="p-2 md:p-3 rounded-full bg-primary/10 shrink-0">
          <Icon className="h-6 w-6 md:h-8 md:w-8" />
        </div>
        <div className="flex flex-col items-start md:items-center min-w-0">
          <h3 className="font-semibold text-base md:text-lg truncate w-full">{title}</h3>
          {description && (
            <div className="hidden md:block absolute inset-0 rounded-lg bg-background/95 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
} 