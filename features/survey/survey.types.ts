export interface Player {
  id: number;
  name: string;
  num: number;
}

export interface Category {
  id: number;
  label: string;
  short: string;
}

export interface Session {
  categoryId: number;
  date: string;
  id: string;
  name: string;
  notes: Record<number, string>;
  rosterIds: number[];
  scores: Record<number, number>;
}

export type ScaleLayout = "grid" | "row" | "arc";
