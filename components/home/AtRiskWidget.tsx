"use client";

import { useState } from "react";
import type { AtRiskPlayer } from "@/features/session/session.utils";

interface Props {
  players: AtRiskPlayer[];
}

export default function AtRiskWidget({ players }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  if (players.length === 0) {
    return null;
  }

  return (
    <div
      className={`overflow-hidden rounded-xl border border-[#FFB84D]/15 transition-colors ${
        collapsed ? "bg-[#FFB84D]/2.5" : "bg-[#FFB84D]/4"
      }`}
    >
      <button
        className="flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-3.25 font-mono text-[#FFB84D] text-[11px] uppercase tracking-[0.14em]"
        onClick={() => setCollapsed(!collapsed)}
        type="button"
      >
        <span aria-hidden className="flex shrink-0 items-center justify-center">
          <svg
            aria-hidden="true"
            fill="none"
            height="14"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.4"
            viewBox="0 0 24 24"
            width="14"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" x2="12" y1="9" y2="13" />
            <line x1="12" x2="12.01" y1="17" y2="17" />
          </svg>
        </span>
        <span className="font-semibold">
          AT-RISK · {players.length} PLAYERS
        </span>
        <span className="flex-1 text-left text-[#FFB84D]/50 text-[10px]">
          RPE ≥ 8 IN 2+ RECENT
        </span>
        <span
          className="flex text-[#FFB84D]/70 transition-transform duration-200"
          style={{ transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)" }}
        >
          <svg
            aria-hidden="true"
            fill="none"
            height="14"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.4"
            viewBox="0 0 24 24"
            width="14"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {!collapsed && (
        <div className="flex flex-wrap gap-2 px-3.5 pt-1 pb-3.5">
          {players.map((p) => {
            const initials = p.name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2);
            return (
              <div
                className="flex items-center gap-2 rounded-full border border-[#FFB84D]/22 bg-[#FFB84D]/10 py-1.5 pr-3 pl-1.5 text-[#FFB84D]"
                key={p.id}
              >
                <span className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-[#FFB84D]/25 font-mono font-semibold text-[#FFB84D] text-[10px] tracking-[0.04em]">
                  {initials}
                </span>
                <span className="flex flex-col items-start leading-[1.2]">
                  <span className="font-medium text-[12px] text-text">
                    {p.name}
                  </span>
                  <span className="font-mono text-[9.5px] tracking-[0.12em]">
                    {p.flags}× ≥8
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
