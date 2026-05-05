export interface DefaultCategory {
  name: string;
  order: number;
}

export const DEFAULT_CATEGORIES: DefaultCategory[] = [
  { name: "MD-4", order: 1 },
  { name: "MD-3", order: 2 },
  { name: "MD-2", order: 3 },
  { name: "MD-1", order: 4 },
  { name: "MD", order: 5 },
  { name: "MD+1", order: 6 },
  { name: "Recovery", order: 7 },
];
