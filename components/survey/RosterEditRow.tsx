import type { Player } from "@/features/survey/survey.types";

interface Props {
  inSession: boolean;
  onToggle: (id: number) => void;
  player: Player;
}

export default function RosterEditRow({ inSession, onToggle, player }: Props) {
  return (
    <button
      className={`flex min-h-14 items-center gap-4 border-line border-b px-4.5 py-3.5 text-left transition last:border-b-0 ${inSession ? "text-text" : "text-text-2"} hover:bg-bg-3 hover:text-text`}
      onClick={() => onToggle(player.id)}
      type="button"
    >
      <span
        className={`flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-md border-[1.5px] transition ${inSession ? "border-accent bg-accent" : "border-line-2"}`}
      >
        {inSession && (
          <svg
            fill="none"
            height="14"
            stroke="#0D0D0F"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3.5"
            viewBox="0 0 24 24"
            width="14"
          >
            <title>Remove from session</title>
            <polyline points="4 12 10 18 20 6" />
          </svg>
        )}
      </span>
      <span
        className={`w-6 font-medium font-mono text-[13px] ${inSession ? "text-text-2" : "text-text-3"}`}
      >
        {String(player.num).padStart(2, "0")}
      </span>
      <span className="flex-1 font-display font-medium text-[18px] sm:text-[22px]">
        {player.name}
      </span>
    </button>
  );
}
