import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface HeadingProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  iconColor?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function Heading({
  title,
  description,
  icon: Icon,
  iconColor,
  actions,
  className,
}: HeadingProps) {
  return (
    <div className={cn("flex items-start justify-between", className)}>
      <div className="space-y-1">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          {Icon && (
            <Icon className={cn("h-6 w-6", iconColor)} />
          )}
          {title}
        </h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {actions && <div className="ml-auto">{actions}</div>}
    </div>
  );
}
