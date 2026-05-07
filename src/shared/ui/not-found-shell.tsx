import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "./button";

interface NotFoundShellProps {
  backHref?: string;
  message: string;
}

export function NotFoundShell({ message, backHref = "/" }: NotFoundShellProps) {
  return (
    <div className="flex min-h-full flex-col bg-base">
      <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-border border-b bg-surface px-4">
        <Link href={backHref}>
          <Button size="icon-sm" variant="ghost">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="font-semibold text-primary">Not found</h1>
      </header>
      <div className="flex flex-1 items-center justify-center px-8 py-16 text-center">
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>
    </div>
  );
}
