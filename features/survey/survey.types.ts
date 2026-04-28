export interface Player {
  id: number;
  name: string;
  num: number;
}

export interface Session {
  date: string;
  id: string;
  name: string;
  notes: Partial<Record<number, string>>;
  rosterIds: number[];
  scores: Record<number, number>;
}
