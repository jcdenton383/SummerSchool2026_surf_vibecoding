export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(value));
}

export function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function canCancelUntil(cancellableUntil: string, now = new Date()): boolean {
  return new Date(cancellableUntil).getTime() > now.getTime();
}
