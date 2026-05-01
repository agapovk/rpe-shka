import { Check } from "lucide-react";
import type { Player } from "@/features/survey/survey.types";
import { rpeColor } from "@/features/survey/survey.utils";

interface Props {
  inSession: boolean;
  onToggle: (id: number) => void;
  player: Player;
  score: number | undefined;
}

export default function RosterEditRow({
  inSession,
  onToggle,
  player,
  score,
}: Props) {
  return (
    <button
      className={`flex min-h-14 items-center gap-4 border-line border-b px-4.5 py-3.5 text-left transition last:border-b-0 ${inSession ? "text-text" : "text-text-2"} hover:bg-bg-3 hover:text-text`}
      onClick={() => onToggle(player.id)}
      type="button"
    >
      <span
        className={`flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-md border-[1.5px] transition ${inSession ? "border-accent bg-accent" : "border-line-2"}`}
      >
        {inSession && <Check className="h-4 w-4 text-bg-3" />}
      </span>
      <span
        className={`w-6 font-medium font-mono text-[13px] ${inSession ? "text-text-2" : "text-text-3"}`}
      >
        {String(player.num).padStart(2, "0")}
      </span>
      <span className="flex-1 font-display font-medium text-[18px] sm:text-[22px]">
        {player.name}
      </span>
      {score != null && (
        <span
          className="font-bold font-display text-[20px] tabular-nums leading-none sm:text-[24px]"
          style={{ color: rpeColor(score) }}
        >
          {score}
        </span>
      )}
    </button>
  );
}
