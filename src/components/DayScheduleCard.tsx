import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  CheckCircle2,
  Circle,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  BookOpen,
  AlertCircle,
  FileEdit,
} from 'lucide-react';
import { ScheduleItem, ItemType } from '../types';
import { DEFAULT_SUBJECTS } from '../data/defaultSchedules';

interface DayScheduleCardProps {
  dateStr: string;
  relativeLabel: string;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  items: ScheduleItem[];
  selectedSubjectFilter: string | null;
  onToggleComplete: (dateStr: string, itemId: string) => void;
  onDeleteItem: (dateStr: string, itemId: string) => void;
  onEditItem: (dateStr: string, item: ScheduleItem) => void;
  onAddItem: (dateStr: string) => void;
  onReorderItem: (dateStr: string, index: number, direction: 'up' | 'down') => void;
  onQuickAddEmptyRow: (dateStr: string, quickTitle: string) => void;
}

export const DayScheduleCard: React.FC<DayScheduleCardProps> = ({
  dateStr,
  relativeLabel,
  isToday,
  isPast,
  isFuture,
  items,
  selectedSubjectFilter,
  onToggleComplete,
  onDeleteItem,
  onEditItem,
  onAddItem,
  onReorderItem,
  onQuickAddEmptyRow,
}) => {
  const [quickRowText, setQuickRowText] = useState('');
  const [isAddingInline, setIsAddingInline] = useState(false);

  // Filter items if subject filter is active
  const filteredItems = selectedSubjectFilter
    ? items.filter((item) => item.subject === selectedSubjectFilter)
    : items;

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickRowText.trim()) {
      onQuickAddEmptyRow(dateStr, quickRowText.trim());
      setQuickRowText('');
      setIsAddingInline(false);
    }
  };

  // Get color for subject
  const getSubjectStyle = (subjectName: string) => {
    const found = DEFAULT_SUBJECTS.find((s) => s.name === subjectName);
    if (found) return found;
    return DEFAULT_SUBJECTS[DEFAULT_SUBJECTS.length - 1]; // fallback
  };

  const getTypeIcon = (type: ItemType) => {
    switch (type) {
      case 'lecture':
        return '📖';
      case 'lab':
        return '🔬';
      case 'exam':
        return '📝';
      case 'assignment':
        return '📂';
      case 'study':
        return '💡';
      case 'activity':
        return '🏃';
      case 'break':
        return '☕';
      default:
        return '📚';
    }
  };

  return (
    <div
      className={`rounded-3xl transition-all duration-300 border shadow-lg overflow-hidden my-6 ${
        isToday
          ? 'bg-white border-amber-400 ring-4 ring-amber-400/20 shadow-amber-900/10'
          : isPast
          ? 'bg-slate-50/90 border-slate-200 opacity-95'
          : 'bg-white border-slate-200'
      }`}
    >
      {/* Day Header Banner */}
      <div
        className={`p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b ${
          isToday
            ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white border-amber-600'
            : isPast
            ? 'bg-slate-800 text-slate-100 border-slate-700'
            : 'bg-slate-900 text-slate-100 border-slate-800'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div
            className={`p-2 rounded-2xl flex items-center justify-center ${
              isToday ? 'bg-white/20 text-white' : 'bg-amber-500/20 text-amber-300'
            }`}
          >
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-fredoka text-xl sm:text-2xl font-bold tracking-wide">
                {relativeLabel}
              </h2>
              {isToday && (
                <span className="bg-white/30 text-white text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">
                  Present Day
                </span>
              )}
            </div>
            <p className={`text-xs sm:text-sm font-lexend ${isToday ? 'text-amber-100' : 'text-slate-300'}`}>
              {dateStr} • {items.length} Schedule {items.length === 1 ? 'Slot' : 'Slots'}
            </p>
          </div>
        </div>

        {/* Action Button to Add Entry */}
        <button
          onClick={() => onAddItem(dateStr)}
          className={`flex items-center space-x-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-sm ${
            isToday
              ? 'bg-slate-900 hover:bg-slate-800 text-amber-300'
              : 'bg-amber-600 hover:bg-amber-500 text-white'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Add Schedule Row</span>
        </button>
      </div>

      {/* Schedule Items List */}
      <div className="p-4 sm:p-6 space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-600 font-lexend">
              {selectedSubjectFilter
                ? `No items matching filter "${selectedSubjectFilter}" on this day.`
                : 'No schedule items recorded for this date yet.'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Click "Add Schedule Row" above or fill in the empty slot below.
            </p>
          </div>
        ) : (
          filteredItems.map((item, idx) => {
            const subStyle = getSubjectStyle(item.subject);

            return (
              <div
                key={item.id}
                className={`group border rounded-2xl p-3.5 sm:p-4 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  item.completed
                    ? 'bg-slate-50/80 border-slate-200 opacity-75'
                    : 'bg-white border-slate-200 hover:border-amber-400 hover:shadow-md'
                }`}
              >
                {/* Left Section: Checkbox & Main Info */}
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <button
                    onClick={() => onToggleComplete(dateStr, item.id)}
                    className="mt-0.5 text-slate-400 hover:text-amber-600 transition-colors shrink-0"
                    title={item.completed ? 'Mark pending' : 'Mark completed'}
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {/* Time slot */}
                      <span className="flex items-center space-x-1 text-xs font-mono font-semibold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-700" />
                        <span>{item.time}</span>
                      </span>

                      {/* Subject Tag */}
                      <span
                        className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${subStyle.bgLight} ${subStyle.textDark} ${subStyle.border}`}
                      >
                        {getTypeIcon(item.type)} {item.subject}
                      </span>

                      {/* Priority */}
                      {item.priority === 'high' && (
                        <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-rose-200">
                          HIGH
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3
                      className={`text-sm sm:text-base font-semibold font-lexend ${
                        item.completed ? 'line-through text-slate-500' : 'text-slate-900'
                      }`}
                    >
                      {item.title}
                    </h3>

                    {/* Location & Instructor */}
                    {(item.room || item.instructor) && (
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1 font-lexend">
                        {item.room && (
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{item.room}</span>
                          </span>
                        )}
                        {item.instructor && (
                          <span className="flex items-center space-x-1">
                            <User className="w-3 h-3 text-slate-400" />
                            <span>{item.instructor}</span>
                          </span>
                        )}
                      </div>
                    )}

                    {/* Notes */}
                    {item.notes && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg mt-2 border border-slate-100 font-lexend italic">
                        "{item.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Section: Reorder & Actions */}
                <div className="flex items-center justify-end space-x-1 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 shrink-0">
                  <div className="flex items-center space-x-0.5 mr-1">
                    <button
                      onClick={() => onReorderItem(dateStr, idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400"
                      title="Move up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onReorderItem(dateStr, idx, 'down')}
                      disabled={idx === items.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400"
                      title="Move down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => onEditItem(dateStr, item)}
                    className="p-1.5 text-slate-500 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Edit entry"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteItem(dateStr, item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* 🌟 USER REQUEST FEATURE: EMPTY ROW BELOW PRESENT DAY / EVERY DAY WHICH CAN BE UPDATED LATER */}
        {isToday && (
          <div className="mt-4 pt-3 border-t-2 border-dashed border-amber-300">
            <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-4 shadow-sm hover:border-amber-400 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="font-fredoka text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600 animate-spin-slow" />
                  <span>Present Day Empty Row (Update Later)</span>
                </span>
                <span className="text-[11px] text-amber-800 font-mono bg-amber-200/80 px-2 py-0.5 rounded-full border border-amber-300">
                  Ready for Input
                </span>
              </div>

              {isAddingInline ? (
                <form onSubmit={handleQuickSubmit} className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={quickRowText}
                    onChange={(e) => setQuickRowText(e.target.value)}
                    placeholder="Enter quick schedule task (e.g. 05:00 PM - Math Revision & Homework)..."
                    className="flex-1 bg-white border border-amber-400 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm shrink-0"
                  >
                    Save Slot
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingInline(false)}
                    className="text-xs text-slate-500 hover:text-slate-800 px-2 py-2"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <div
                  onClick={() => setIsAddingInline(true)}
                  className="group flex items-center justify-between bg-white/90 border border-dashed border-amber-400 hover:border-amber-600 rounded-xl p-3 cursor-pointer transition-all hover:bg-white hover:shadow-xs"
                >
                  <div className="flex items-center space-x-2 text-amber-900 text-xs sm:text-sm font-medium font-lexend">
                    <FileEdit className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
                    <span className="text-slate-600 group-hover:text-amber-950">
                      ✍️ <em>Empty schedule row below Today — Click to fill in now or update later...</em>
                    </span>
                  </div>
                  <span className="text-xs text-amber-800 font-semibold bg-amber-100 group-hover:bg-amber-200 px-3 py-1 rounded-lg border border-amber-300 transition-colors shrink-0">
                    + Fill Row
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
