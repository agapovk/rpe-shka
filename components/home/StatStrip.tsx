import type { HomeStats } from "@/features/session/session.utils";
import { rpeColor } from "@/features/survey/survey.utils";

interface Props {
  stats: HomeStats;
}

export default function StatStrip({ stats }: Props) {
  const { sevenDayAvg, sessionsLast30d } = stats;
  const avgRounded = Math.max(1, Math.min(10, Math.round(sevenDayAvg)));

  return (
    <div className="grid grid-cols-[1fr_1fr] items-center border-line border-y px-1 py-4">
      <div className="flex flex-col gap-1 px-3">
        <span className="font-bold font-display text-[32px] text-text tabular-nums leading-none">
          {sessionsLast30d}
        </span>
        <span className="font-mono text-[9.5px] text-text-3 uppercase tracking-widest">
          SESSIONS 30D
        </span>
      </div>
      <div className="flex flex-col items-end gap-1 px-3">
        <span
          className="font-bold font-display text-[32px] tabular-nums leading-none"
          style={{
            color: sevenDayAvg > 0 ? rpeColor(avgRounded) : undefined,
          }}
        >
          {sevenDayAvg > 0 ? sevenDayAvg.toFixed(1) : "—"}
        </span>
        <span className="font-mono text-[9.5px] text-text-3 uppercase tracking-widest">
          7-DAY AVG
        </span>
      </div>
    </div>
  );
}
