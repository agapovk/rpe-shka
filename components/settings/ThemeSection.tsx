"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const THEMES = [
  { value: "light", label: "LIGHT", icon: Sun },
  { value: "dark", label: "DARK", icon: Moon },
  { value: "system", label: "SYSTEM", icon: Monitor },
] as const;

export default function ThemeSection() {
  const { theme, setTheme } = useTheme();

  return (
    <section className="flex flex-col gap-3">
      <span className="font-mono text-[11px] text-text-2 uppercase tracking-widest">
        THEME
      </span>
      <div className="flex gap-2 rounded-xl border border-line bg-bg-2 p-1">
        {THEMES.map(({ value, label, icon: Icon }) => (
          <button
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5",
              "font-mono text-[11px] uppercase tracking-widest transition",
              theme === value
                ? "bg-bg-3 text-text shadow-sm"
                : "text-text-3 hover:text-text-2"
            )}
            key={value}
            onClick={() => setTheme(value)}
            type="button"
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}
