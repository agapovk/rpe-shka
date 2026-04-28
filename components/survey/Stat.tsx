interface Props {
  color?: string;
  label: string;
  value: number | string;
}

export default function Stat({ color, label, value }: Props) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-line bg-bg-2 px-2.5 py-2.5 sm:gap-1.5 sm:px-4 sm:py-3.5">
      <div className="font-mono text-[10px] text-text-2 uppercase tracking-[0.14em] sm:text-[11px] sm:tracking-[0.16em]">
        {label}
      </div>
      <div
        className="font-bold font-display text-[28px] tabular-nums leading-[0.9] sm:text-[44px]"
        style={color ? { color } : undefined}
      >
        {value}
      </div>
    </div>
  );
}
