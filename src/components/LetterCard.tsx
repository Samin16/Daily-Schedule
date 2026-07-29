import React, { useState } from 'react';
import { PenTool, Check, Copy, Download, BookOpen, Quote, Sparkles } from 'lucide-react';
import { exportDayScheduleAsTxt } from '../utils/fileUtils';
import { ScheduleItem } from '../types';

interface LetterCardProps {
  dateStr: string;
  relativeLabel: string;
  letterContent: string;
  onUpdateLetter: (dateStr: string, newContent: string) => void;
  dayItems: ScheduleItem[];
}

export const LetterCard: React.FC<LetterCardProps> = ({
  dateStr,
  relativeLabel,
  letterContent,
  onUpdateLetter,
  dayItems,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(letterContent);
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    onUpdateLetter(dateStr, draft);
    setIsEditing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letterContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    exportDayScheduleAsTxt(dateStr, relativeLabel, dayItems, letterContent);
  };

  return (
    <div className="bg-notebook-paper border-2 border-amber-800/20 rounded-2xl p-5 shadow-lg relative overflow-hidden my-6">
      {/* Decorative Washi Tape on top */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-amber-200/70 border-x border-amber-300/80 shadow-xs rotate-1 z-10 pointer-events-none" />

      <div className="flex items-center justify-between border-b border-amber-900/15 pb-3 mb-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-amber-800" />
          <h2 className="font-fredoka text-amber-950 font-bold text-lg tracking-wide flex items-center gap-2">
            <span>Scholar's Daily Letter & Notes</span>
            <span className="text-xs font-mono font-normal bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
              {relativeLabel}
            </span>
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="flex items-center space-x-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Note</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setDraft(letterContent);
                setIsEditing(true);
              }}
              className="flex items-center space-x-1 bg-amber-800/10 hover:bg-amber-800/20 text-amber-900 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors border border-amber-800/20"
              title="Edit daily letter/notes"
            >
              <PenTool className="w-3.5 h-3.5 text-amber-800" />
              <span>Edit Letter</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="p-1.5 hover:bg-amber-800/10 text-amber-800 rounded-lg transition-colors"
            title="Copy letter text"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            onClick={handleDownloadTxt}
            className="p-1.5 hover:bg-amber-800/10 text-amber-800 rounded-lg transition-colors"
            title="Download formatted day schedule letter as .txt file"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {copied && (
        <div className="bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs px-3 py-1 rounded-md mb-3 font-medium animate-fade-in">
          Letter copied to clipboard!
        </div>
      )}

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={5}
            className="w-full bg-white/90 border border-amber-300 rounded-xl p-3 text-amber-950 font-caveat text-xl sm:text-2xl leading-relaxed focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-inner"
            placeholder="Write your daily motivation, scholar letter, or study notes..."
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-xs text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-amber-800 hover:bg-amber-900 text-amber-50 text-xs font-medium px-4 py-1.5 rounded-lg shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <div className="relative pl-4 border-l-2 border-amber-500/40 py-1">
          <Quote className="w-6 h-6 text-amber-700/30 absolute -top-2 left-1 -rotate-12" />
          <p className="font-caveat text-amber-950 text-xl sm:text-2xl leading-relaxed whitespace-pre-line font-medium select-text">
            {letterContent || "No letter note written for this day yet. Click 'Edit Letter' above to add your personal academic note!"}
          </p>
          <div className="mt-3 text-right font-caveat text-amber-800 text-lg italic">
            — Yours in Knowledge & Perseverance 🎓
          </div>
        </div>
      )}
    </div>
  );
};
