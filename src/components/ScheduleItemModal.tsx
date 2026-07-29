import React, { useState, useEffect } from 'react';
import { X, Clock, MapPin, User, BookOpen, AlertCircle, Check } from 'lucide-react';
import { ScheduleItem, ItemType, PriorityLevel } from '../types';
import { DEFAULT_SUBJECTS } from '../data/defaultSchedules';

interface ScheduleItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<ScheduleItem, 'id'>, id?: string) => void;
  initialItem?: ScheduleItem | null;
  targetDateStr: string;
  relativeLabel: string;
}

export const ScheduleItemModal: React.FC<ScheduleItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem,
  targetDateStr,
  relativeLabel,
}) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(DEFAULT_SUBJECTS[0].name);
  const [type, setType] = useState<ItemType>('lecture');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('10:30 AM');
  const [room, setRoom] = useState('');
  const [instructor, setInstructor] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialItem) {
      setTitle(initialItem.title);
      setSubject(initialItem.subject);
      setType(initialItem.type);
      
      const parts = initialItem.time.split('-').map(s => s.trim());
      setStartTime(parts[0] || '09:00 AM');
      setEndTime(parts[1] || '10:30 AM');
      
      setRoom(initialItem.room || '');
      setInstructor(initialItem.instructor || '');
      setPriority(initialItem.priority);
      setNotes(initialItem.notes || '');
    } else {
      // Defaults for new entry
      setTitle('');
      setSubject(DEFAULT_SUBJECTS[0].name);
      setType('lecture');
      setStartTime('02:00 PM');
      setEndTime('03:30 PM');
      setRoom('Room 101');
      setInstructor('');
      setPriority('medium');
      setNotes('');
    }
    setError(null);
  }, [initialItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a schedule task title or class name.');
      return;
    }

    const formattedTime = `${startTime} - ${endTime}`;

    onSave(
      {
        title: title.trim(),
        subject,
        type,
        time: formattedTime,
        room: room.trim() || undefined,
        instructor: instructor.trim() || undefined,
        completed: initialItem ? initialItem.completed : false,
        priority,
        notes: notes.trim() || undefined,
      },
      initialItem?.id
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-slate-100 p-4 sm:p-5 flex items-center justify-between">
          <div>
            <h3 className="font-fredoka text-lg sm:text-xl font-semibold text-amber-300 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>{initialItem ? 'Edit Schedule Entry' : 'Add New Schedule Entry'}</span>
            </h3>
            <p className="text-xs text-slate-400 font-lexend mt-0.5">
              Target Day: <strong className="text-slate-200 font-mono">{relativeLabel} ({targetDateStr})</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Task / Course / Lecture Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Calculus II: Integration by Parts"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none"
              autoFocus
            />
          </div>

          {/* Subject & Item Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Academic Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                {DEFAULT_SUBJECTS.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Schedule Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ItemType)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none capitalize"
              >
                <option value="lecture">📖 Lecture</option>
                <option value="lab">🔬 Lab / Experiment</option>
                <option value="exam">📝 Exam / Quiz</option>
                <option value="assignment">📂 Homework / Essay</option>
                <option value="study">💡 Self-Study</option>
                <option value="activity">🏃 Extra-Curricular</option>
                <option value="break">☕ Break / Meal</option>
              </select>
            </div>
          </div>

          {/* Time Slot */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> Start Time
              </label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="09:00 AM"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> End Time
              </label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="10:30 AM"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Location & Instructor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" /> Classroom / Room
              </label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Hall 302 or Online"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-500" /> Instructor / Professor
              </label>
              <input
                type="text"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                placeholder="Dr. Smith"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPriority('low')}
                className={`py-1.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                  priority === 'low'
                    ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Low Priority
              </button>
              <button
                type="button"
                onClick={() => setPriority('medium')}
                className={`py-1.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                  priority === 'medium'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Medium
              </button>
              <button
                type="button"
                onClick={() => setPriority('high')}
                className={`py-1.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                  priority === 'high'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                High Priority
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Additional Study Notes / Guidelines
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Read chapters 3 & 4 before class; submit lab report online."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-5 py-2 rounded-xl shadow-md transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{initialItem ? 'Save Updates' : 'Add to Schedule'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
