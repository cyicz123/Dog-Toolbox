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
    <Link to={to} className="flex w-full md:w-auto">
      <div
        className={cn(
          "flex flex-row md:flex-col items-center md:text-center",
          "h-[150px] rounded-lg border bg-card shadow-lg hover:shadow-xl transition-all",
          "w-full px-4 gap-4",
          "md:justify-center md:gap-4",
          "md:h-[200px] md:w-[300px]",
          "group relative",
          className
        )}
      >
        <div className="p-3 rounded-full bg-primary/10 shrink-0">
          <Icon className="h-8 w-8" />
        </div>
        <div className="flex flex-col items-start md:items-center min-w-0">
          <h3 className="font-semibold text-lg truncate w-full">{title}</h3>
          {description && (
            <>
              <p className="text-sm text-muted-foreground md:hidden">{description}</p>
              <div className="hidden md:flex absolute inset-0 rounded-lg bg-background/95 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center p-4">
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </Link>
  );
} 