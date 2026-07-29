import { ScheduleFileFormat, ScheduleItem, LoadedFileMeta } from '../types';
import { formatHumanDate } from './dateUtils';

export function exportScheduleToJsonFile(
  schedules: Record<string, ScheduleItem[]>,
  letterNotes: Record<string, string>,
  anchorDateStr: string,
  customFileName?: string
): void {
  const payload: ScheduleFileFormat = {
    appName: 'Daily Academic Schedule Planner',
    version: '1.0.0',
    exportTimestamp: new Date().toISOString(),
    exportDateHuman: formatHumanDate(anchorDateStr),
    anchorDate: anchorDateStr,
    schedules,
    letterNotes,
  };

  const jsonString = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const defaultName = `academic_schedule_${anchorDateStr}.json`;
  const fileName = customFileName || defaultName;

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportDayScheduleAsTxt(
  dateStr: string,
  relativeLabel: string,
  items: ScheduleItem[],
  letterNote?: string
): void {
  let content = `====================================================\n`;
  content += `       DAILY ACADEMIC SCHEDULE & SCHOLAR LETTER     \n`;
  content += `====================================================\n\n`;
  content += `Date: ${formatHumanDate(dateStr)} (${relativeLabel})\n`;
  content += `Exported: ${new Date().toLocaleString()}\n\n`;

  if (letterNote) {
    content += `--- DAILY LETTER & ACADEMIC NOTES ---\n`;
    content += `${letterNote}\n\n`;
  }

  content += `--- SCHEDULED CLASSES, LABS & STUDY SESSIONS ---\n`;
  if (items.length === 0) {
    content += `(No schedule items recorded for this date)\n`;
  } else {
    items.forEach((item, index) => {
      const statusStr = item.completed ? '[COMPLETED]' : '[PENDING]';
      content += `${index + 1}. ${statusStr} ${item.time}\n`;
      content += `   Subject: ${item.subject} (${item.type.toUpperCase()})\n`;
      content += `   Task: ${item.title}\n`;
      if (item.room) content += `   Location: ${item.room}\n`;
      if (item.instructor) content += `   Instructor: ${item.instructor}\n`;
      if (item.notes) content += `   Notes: ${item.notes}\n`;
      content += `\n`;
    });
  }

  content += `====================================================\n`;
  content += `Keep striving for excellence!\n`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `schedule_letter_${dateStr}.txt`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export interface ParseResult {
  schedules: Record<string, ScheduleItem[]>;
  letterNotes: Record<string, string>;
  meta: LoadedFileMeta;
  anchorDate?: string;
}

export function parseScheduleFile(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        let importedSchedules: Record<string, ScheduleItem[]> = {};
        let importedLetters: Record<string, string> = {};
        let totalItems = 0;

        // Check if file is valid ScheduleFileFormat or raw schedules object
        if (parsed && typeof parsed === 'object') {
          if (parsed.schedules && typeof parsed.schedules === 'object') {
            importedSchedules = parsed.schedules;
            if (parsed.letterNotes && typeof parsed.letterNotes === 'object') {
              importedLetters = parsed.letterNotes;
            }
          } else {
            // Might be direct object mapping of dates to items
            importedSchedules = parsed;
          }

          // Count items
          Object.values(importedSchedules).forEach((arr) => {
            if (Array.isArray(arr)) {
              totalItems += arr.length;
            }
          });

          const meta: LoadedFileMeta = {
            filename: file.name,
            sizeBytes: file.size,
            importedAt: new Date().toLocaleTimeString(),
            schedulesCount: Object.keys(importedSchedules).length,
            totalItemsCount: totalItems,
          };

          resolve({
            schedules: importedSchedules,
            letterNotes: importedLetters,
            meta,
            anchorDate: parsed.anchorDate,
          });
        } else {
          reject(new Error('Invalid JSON file format. Expected schedule data object.'));
        }
      } catch (err) {
        reject(new Error(`Failed to read schedule file: ${(err as Error).message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading local file.'));
    };

    reader.readAsText(file);
  });
}
