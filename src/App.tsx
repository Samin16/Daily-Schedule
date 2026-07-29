import React, { useState, useEffect, useMemo } from 'react';
import {
  Header,
} from './components/Header';
import { FilePersistenceBar } from './components/FilePersistenceBar';
import { LetterCard } from './components/LetterCard';
import { DayScheduleCard } from './components/DayScheduleCard';
import { ScheduleItemModal } from './components/ScheduleItemModal';
import { EducationWidgets } from './components/EducationWidgets';
import { DayPositionVisualizer } from './components/DayPositionVisualizer';

import { ScheduleItem, LoadedFileMeta } from './types';
import {
  getTodayStr,
  addDaysToStr,
  getRelativeDayOffset,
  getRelativeDayLabel,
} from './utils/dateUtils';
import { getInitialSchedules } from './data/defaultSchedules';
import {
  exportScheduleToJsonFile,
  parseScheduleFile,
} from './utils/fileUtils';
import { Sparkles, Calendar, BookOpen, PlusCircle, RotateCcw, CheckCircle2 } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'edu_schedule_planner_v1';
const LOCAL_LETTERS_KEY = 'edu_schedule_letters_v1';

export default function App() {
  // System anchor date representing "Present Day (Today)"
  const [anchorDate, setAnchorDate] = useState<string>(() => getTodayStr());

  // Schedules state keyed by YYYY-MM-DD date string
  const [schedules, setSchedules] = useState<Record<string, ScheduleItem[]>>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse stored schedules from localStorage:', e);
    }
    return getInitialSchedules(getTodayStr()).schedules;
  });

  // Letter notes state keyed by YYYY-MM-DD
  const [letterNotes, setLetterNotes] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_LETTERS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse stored letter notes:', e);
    }
    return getInitialSchedules(getTodayStr()).letterNotes;
  });

  // File import meta
  const [loadedMeta, setLoadedMeta] = useState<LoadedFileMeta | null>(null);

  // Subject filter
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string | null>(null);

  // Modal State
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    targetDateStr: string;
    item?: ScheduleItem | null;
  }>({
    isOpen: false,
    targetDateStr: anchorDate,
    item: null,
  });

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(schedules));
    } catch (err) {
      console.error('Error saving to localStorage:', err);
    }
  }, [schedules]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_LETTERS_KEY, JSON.stringify(letterNotes));
    } catch (err) {
      console.error('Error saving letter notes to localStorage:', err);
    }
  }, [letterNotes]);

  // Ensure Yesterday, Today, Tomorrow dates exist in schedules map
  useEffect(() => {
    const yesterdayStr = addDaysToStr(anchorDate, -1);
    const todayStr = anchorDate;
    const tomorrowStr = addDaysToStr(anchorDate, 1);

    setSchedules((prev) => {
      const updated = { ...prev };
      let changed = false;
      [yesterdayStr, todayStr, tomorrowStr].forEach((dStr) => {
        if (!updated[dStr]) {
          updated[dStr] = [];
          changed = true;
        }
      });
      return changed ? updated : prev;
    });
  }, [anchorDate]);

  // Calculate sorted list of date strings for display
  const sortedDateStrings = useMemo(() => {
    const dates = Object.keys(schedules);
    // Ensure at least Yesterday, Today, Tomorrow are included
    const yesterdayStr = addDaysToStr(anchorDate, -1);
    const todayStr = anchorDate;
    const tomorrowStr = addDaysToStr(anchorDate, 1);

    const setOfDates = new Set([...dates, yesterdayStr, todayStr, tomorrowStr]);
    return Array.from(setOfDates).sort((a, b) => a.localeCompare(b));
  }, [schedules, anchorDate]);

  // Count total and completed items for Today
  const todayItems = schedules[anchorDate] || [];
  const todayCompletedCount = todayItems.filter((i) => i.completed).length;

  // Total items across all days
  const totalItemsCount = useMemo(() => {
    return (Object.values(schedules) as ScheduleItem[][]).reduce((acc, arr) => acc + arr.length, 0);
  }, [schedules]);

  const completedItemsCount = useMemo(() => {
    return (Object.values(schedules) as ScheduleItem[][]).reduce(
      (acc, arr) => acc + arr.filter((i) => i.completed).length,
      0
    );
  }, [schedules]);

  // Handlers
  const handleToggleComplete = (dateStr: string, itemId: string) => {
    setSchedules((prev) => {
      const dayArr = prev[dateStr] || [];
      const updatedArr = dayArr.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      );
      return { ...prev, [dateStr]: updatedArr };
    });
  };

  const handleDeleteItem = (dateStr: string, itemId: string) => {
    setSchedules((prev) => {
      const dayArr = prev[dateStr] || [];
      const updatedArr = dayArr.filter((item) => item.id !== itemId);
      return { ...prev, [dateStr]: updatedArr };
    });
    showToast('Schedule item deleted.', 'info');
  };

  const handleOpenAddModal = (dateStr: string) => {
    setModalState({
      isOpen: true,
      targetDateStr: dateStr,
      item: null,
    });
  };

  const handleOpenEditModal = (dateStr: string, item: ScheduleItem) => {
    setModalState({
      isOpen: true,
      targetDateStr: dateStr,
      item,
    });
  };

  const handleSaveModalItem = (itemData: Omit<ScheduleItem, 'id'>, existingId?: string) => {
    const targetDateStr = modalState.targetDateStr;

    setSchedules((prev) => {
      const dayArr = prev[targetDateStr] || [];
      let updatedArr: ScheduleItem[];

      if (existingId) {
        updatedArr = dayArr.map((item) =>
          item.id === existingId ? { ...itemData, id: existingId } : item
        );
      } else {
        const newItem: ScheduleItem = {
          ...itemData,
          id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        };
        updatedArr = [...dayArr, newItem];
      }

      return { ...prev, [targetDateStr]: updatedArr };
    });

    showToast(existingId ? 'Schedule entry updated!' : 'New schedule entry added!');
  };

  const handleQuickAddEmptyRow = (dateStr: string, quickTitle: string) => {
    const newItem: ScheduleItem = {
      id: `quick-${Date.now()}`,
      title: quickTitle,
      subject: 'General Study & Review',
      type: 'study',
      time: '04:00 PM - 05:00 PM',
      completed: false,
      priority: 'medium',
      notes: 'Quick added entry (updated later)',
    };

    setSchedules((prev) => {
      const dayArr = prev[dateStr] || [];
      return { ...prev, [dateStr]: [...dayArr, newItem] };
    });

    showToast('Quick schedule row added to present day!');
  };

  const handleReorderItem = (dateStr: string, index: number, direction: 'up' | 'down') => {
    setSchedules((prev) => {
      const dayArr = [...(prev[dateStr] || [])];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= dayArr.length) return prev;

      const temp = dayArr[index];
      dayArr[index] = dayArr[targetIndex];
      dayArr[targetIndex] = temp;

      return { ...prev, [dateStr]: dayArr };
    });
  };

  const handleUpdateLetter = (dateStr: string, newContent: string) => {
    setLetterNotes((prev) => ({
      ...prev,
      [dateStr]: newContent,
    }));
    showToast('Scholar letter note saved!');
  };

  // Local File Export
  const handleExportFile = () => {
    exportScheduleToJsonFile(schedules, letterNotes, anchorDate);
    showToast('Schedule data exported to local JSON file!');
  };

  // Local File Import
  const handleFileSelected = async (file: File) => {
    try {
      const result = await parseScheduleFile(file);
      setSchedules(result.schedules);
      if (result.letterNotes && Object.keys(result.letterNotes).length > 0) {
        setLetterNotes(result.letterNotes);
      }
      setLoadedMeta(result.meta);
      if (result.anchorDate) {
        setAnchorDate(result.anchorDate);
      }
      showToast(
        `Successfully imported ${result.meta.totalItemsCount} items from ${result.meta.filename}!`
      );
    } catch (err) {
      alert((err as Error).message);
    }
  };

  // Load sample default schedule
  const handleLoadSample = () => {
    const defaultData = getInitialSchedules(anchorDate);
    setSchedules(defaultData.schedules);
    setLetterNotes(defaultData.letterNotes);
    setLoadedMeta(null);
    showToast('Loaded default educational sample schedule!');
  };

  return (
    <div className="min-h-screen bg-notebook-paper text-slate-800 font-lexend flex flex-col selection:bg-amber-200 selection:text-amber-900">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-amber-200 text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-2xl border border-amber-500/40 flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        anchorDate={anchorDate}
        onAnchorDateChange={setAnchorDate}
        onExportFile={handleExportFile}
        onTriggerImport={() => {
          const input = document.querySelector('input[type="file"]') as HTMLInputElement;
          input?.click();
        }}
        onResetToDefaults={handleLoadSample}
        todayCompletedCount={todayCompletedCount}
        todayTotalCount={todayItems.length}
        hasLoadedFile={!!loadedMeta}
        loadedFilename={loadedMeta?.filename}
      />

      {/* Body Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Local File Management & Import/Save Bar */}
        <FilePersistenceBar
          loadedMeta={loadedMeta}
          onFileSelected={handleFileSelected}
          onExportFile={handleExportFile}
          onLoadSample={handleLoadSample}
        />

        {/* Relative Day Sequence Visualizer */}
        <DayPositionVisualizer
          sortedDayDates={sortedDateStrings}
          anchorDateStr={anchorDate}
          getRelativeLabel={(dStr) => getRelativeDayLabel(dStr, anchorDate)}
        />

        {/* Education Widgets (Pomodoro Focus Timer & Subject Filters) */}
        <EducationWidgets
          selectedSubjectFilter={selectedSubjectFilter}
          onSelectSubjectFilter={setSelectedSubjectFilter}
          totalItemsCount={totalItemsCount}
          completedItemsCount={completedItemsCount}
        />

        {/* Handwritten Letter & Academic Notes for Present Day (Today) */}
        <LetterCard
          dateStr={anchorDate}
          relativeLabel={getRelativeDayLabel(anchorDate, anchorDate)}
          letterContent={
            letterNotes[anchorDate] ||
            `Dear Scholar,\n\nWelcome to your present day schedule! Use the empty row below to capture new lectures or study goals.`
          }
          onUpdateLetter={handleUpdateLetter}
          dayItems={schedules[anchorDate] || []}
        />

        {/* Dynamic Relative Schedule Cards Section */}
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between border-b border-amber-800/20 pb-3">
            <h2 className="font-fredoka text-slate-900 font-bold text-xl sm:text-2xl flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-amber-700" />
              <span>Daily Schedules Organized by Relative Date</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              {sortedDateStrings.length} Days Tracked
            </span>
          </div>

          {sortedDateStrings.map((dStr) => {
            const relOffset = getRelativeDayOffset(dStr, anchorDate);
            const relLabel = getRelativeDayLabel(dStr, anchorDate);
            const isToday = relOffset === 0;
            const isPast = relOffset < 0;
            const isFuture = relOffset > 0;
            const dayItems = schedules[dStr] || [];

            return (
              <DayScheduleCard
                key={dStr}
                dateStr={dStr}
                relativeLabel={relLabel}
                isToday={isToday}
                isPast={isPast}
                isFuture={isFuture}
                items={dayItems}
                selectedSubjectFilter={selectedSubjectFilter}
                onToggleComplete={handleToggleComplete}
                onDeleteItem={handleDeleteItem}
                onEditItem={handleOpenEditModal}
                onAddItem={handleOpenAddModal}
                onReorderItem={handleReorderItem}
                onQuickAddEmptyRow={handleQuickAddEmptyRow}
              />
            );
          })}
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-6 text-center text-xs font-lexend mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Daily Academic Schedule Planner • Education Theme</p>
          <div className="flex items-center space-x-4">
            <button onClick={handleExportFile} className="hover:text-amber-300 transition-colors">
              Save Local File (.json)
            </button>
            <span>•</span>
            <button onClick={handleLoadSample} className="hover:text-amber-300 transition-colors">
              Reset Sample Data
            </button>
          </div>
        </div>
      </footer>

      {/* Schedule Item Modal */}
      <ScheduleItemModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        onSave={handleSaveModalItem}
        initialItem={modalState.item}
        targetDateStr={modalState.targetDateStr}
        relativeLabel={getRelativeDayLabel(modalState.targetDateStr, anchorDate)}
      />

    </div>
  );
}
