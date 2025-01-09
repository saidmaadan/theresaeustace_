import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const AuthCard = ({
  children,
  header,
  footer,
  className,
}: AuthCardProps) => {
  return (
    <Card className={cn("w-full max-w-[400px] shadow-md", className)}>
      {header && <CardHeader>{header}</CardHeader>}
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};
