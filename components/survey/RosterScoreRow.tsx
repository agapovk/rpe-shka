import { ArrowRight, Check } from "lucide-react";
import type { Player } from "@/features/survey/survey.types";
import { rpeColor } from "@/features/survey/survey.utils";

interface Props {
  note: string | undefined;
  onOpen: (id: number) => void;
  player: Player;
  score: number | undefined;
}

export default function RosterScoreRow({ note, onOpen, player, score }: Props) {
  const hasScore = score != null;
  return (
    <button
      className={`grid min-h-14 items-center gap-3.5 border-line border-b px-4.5 py-3.5 text-left transition last:border-b-0 ${hasScore ? "bg-white/1.5 text-text" : "text-text-2"} group hover:bg-bg-3 hover:text-text`}
      onClick={() => onOpen(player.id)}
      style={{ gridTemplateColumns: "28px 1fr auto" }}
      type="button"
    >
      <span className="w-6 font-medium font-mono text-[13px] text-text-3">
        {String(player.num).padStart(2, "0")}
      </span>
      <span className="truncate font-display font-medium text-[18px] sm:text-[22px]">
        {player.name}
        {note && (
          <span className="ml-2 font-normal font-sans text-[11px] text-text-3 tracking-normal">
            · {note}
          </span>
        )}
      </span>
      {hasScore ? (
        <span className="flex items-center gap-3 font-mono text-[10px] tracking-widest">
          <span className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full bg-accent">
            <Check className="h-4 w-4 text-bg-3" />
          </span>
          <span
            className="min-w-5.5 text-right font-bold font-display text-[22px] tabular-nums leading-none sm:text-[28px]"
            style={{ color: rpeColor(score) }}
          >
            {score}
          </span>
        </span>
      ) : (
        <span className="flex items-center gap-2.5 font-mono text-[10px] text-text-3 tracking-widest">
          <span className="font-medium transition-colors group-hover:text-accent">
            TAP TO SCORE
          </span>
          <ArrowRight className="h-4 w-4" />
        </span>
      )}
    </button>
  );
}
