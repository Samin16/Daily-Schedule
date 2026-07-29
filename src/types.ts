export type ItemType = 'lecture' | 'lab' | 'assignment' | 'exam' | 'study' | 'activity' | 'break';
export type PriorityLevel = 'high' | 'medium' | 'low';

export interface ScheduleItem {
  id: string;
  time: string; // e.g. "09:00 AM - 10:30 AM"
  title: string;
  subject: string;
  type: ItemType;
  room?: string;
  instructor?: string;
  completed: boolean;
  priority: PriorityLevel;
  notes?: string;
  durationMinutes?: number;
}

export interface DaySchedule {
  dateStr: string; // YYYY-MM-DD
  relativeLabel: string; // "Yesterday", "Today", "Tomorrow", "2 Days Ago", etc.
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  items: ScheduleItem[];
  letterNote?: string;
}

export interface SubjectConfig {
  id: string;
  name: string;
  color: string; // Tailwind class or hex
  bgLight: string;
  textDark: string;
  border: string;
}

export interface ScheduleFileFormat {
  appName: string;
  version: string;
  exportTimestamp: string;
  exportDateHuman: string;
  anchorDate: string; // YYYY-MM-DD
  schedules: Record<string, ScheduleItem[]>; // Keyed by dateStr (YYYY-MM-DD)
  letterNotes: Record<string, string>; // Keyed by dateStr
}

export interface LoadedFileMeta {
  filename: string;
  sizeBytes: number;
  importedAt: string;
  schedulesCount: number;
  totalItemsCount: number;
}
