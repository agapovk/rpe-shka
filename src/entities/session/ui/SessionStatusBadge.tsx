import { cn } from "@shared/lib";
import { Badge } from "@shared/ui";
import type { LucideIcon } from "lucide-react";
import { CheckCircle2, Circle, CircleDashed } from "lucide-react";
import type { SessionStatus } from "../model/types";

interface SessionStatusBadgeProps {
  className?: string;
  status: SessionStatus;
}

const STATUS_CONFIG: Record<
  SessionStatus,
  { label: string; Icon: LucideIcon }
> = {
  complete: { label: "Complete", Icon: CheckCircle2 },
  partial: { label: "Partial", Icon: CircleDashed },
  empty: { label: "Empty", Icon: Circle },
};

export function SessionStatusBadge({
  status,
  className,
}: SessionStatusBadgeProps) {
  const { label, Icon } = STATUS_CONFIG[status];
  return (
    <Badge className={cn("rounded-md bg-elevated text-secondary", className)}>
      <Icon size={12} />
      {label}
    </Badge>
  );
}
