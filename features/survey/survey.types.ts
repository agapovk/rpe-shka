export interface Player {
  id: number;
  name: string;
  num: number;
}

export interface Team {
  id: string;
  label: string;
  short: string;
}

export interface Session {
  date: string;
  id: string;
  name: string;
  notes: Record<number, string>;
  rosterIds: number[];
  scores: Record<number, number>;
  teamId: string;
}

export type ScaleLayout = "grid" | "row" | "arc";
export type AccentName = "lime" | "coral" | "cyan";
