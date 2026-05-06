import { cn } from "@shared/lib/utils";
import { Badge } from "@/src/shared/ui";
import type { Category } from "../model";

interface CategoryBadgeProps {
  category: Pick<Category, "name">;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <Badge
      className={cn(
        "rounded-md bg-elevated font-mono text-secondary text-xs uppercase",
        className
      )}
    >
      {category.name}
    </Badge>
  );
}
