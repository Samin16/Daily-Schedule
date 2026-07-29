// Date helper utilities for relative day positioning (Yesterday, Today, Tomorrow)

export function getTodayStr(dateObj: Date = new Date()): string {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateStr(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDaysToStr(dateStr: string, days: number): string {
  const d = parseDateStr(dateStr);
  d.setDate(d.getDate() + days);
  return getTodayStr(d);
}

export function getRelativeDayOffset(targetDateStr: string, anchorDateStr: string): number {
  const target = parseDateStr(targetDateStr).getTime();
  const anchor = parseDateStr(anchorDateStr).getTime();
  const diffTime = target - anchor;
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function getRelativeDayLabel(targetDateStr: string, anchorDateStr: string): string {
  const offset = getRelativeDayOffset(targetDateStr, anchorDateStr);
  if (offset === 0) return 'Today (Present Day)';
  if (offset === -1) return 'Yesterday';
  if (offset === 1) return 'Tomorrow';
  if (offset < 0) return `${Math.abs(offset)} Days Ago`;
  return `In ${offset} Days`;
}

export function formatHumanDate(dateStr: string): string {
  try {
    const d = parseDateStr(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function formatShortDate(dateStr: string): string {
  try {
    const d = parseDateStr(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
