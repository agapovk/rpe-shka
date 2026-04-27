export function fmtDate(d: Date): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

export function suggestSessionName(): string {
  const h = new Date().getHours();
  const period = h < 12 ? "Morning" : h < 17 ? "Afternoon" : "Evening";
  return `${period} · ${fmtDate(new Date())}`;
}
