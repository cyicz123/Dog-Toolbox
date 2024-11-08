import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import pkg from "../../package.json";

export function AboutTooltip() {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <Info className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="p-4 space-y-2">
          <p className="font-semibold">{pkg.name}</p>
          <p className="text-sm text-muted-foreground">版本: {pkg.version}</p>
          <p className="text-sm text-muted-foreground">{pkg.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 