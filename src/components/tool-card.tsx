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
    <Link to={to} className="w-full md:w-auto">
      <div
        className={cn(
          "w-full md:w-[200px] p-6 rounded-lg border bg-card shadow-lg hover:shadow-xl transition-all relative group",
          "flex flex-col items-center text-center space-y-4",
          className
        )}
      >
        <div className="p-3 rounded-full bg-primary/10">
          <Icon className="h-8 w-8" />
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
        {description && (
          <div className="absolute inset-0 rounded-lg bg-background/95 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
            <p className="text-sm text-muted-foreground -mt-4">{description}</p>
          </div>
        )}
      </div>
    </Link>
  );
} 