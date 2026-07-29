import React from 'react';
import { Calendar, Download, Upload, GraduationCap, Clock, CheckCircle2, RotateCcw, FileText } from 'lucide-react';
import { formatHumanDate, getTodayStr, addDaysToStr } from '../utils/dateUtils';

interface HeaderProps {
  anchorDate: string;
  onAnchorDateChange: (newDate: string) => void;
  onExportFile: () => void;
  onTriggerImport: () => void;
  onResetToDefaults: () => void;
  todayCompletedCount: number;
  todayTotalCount: number;
  hasLoadedFile: boolean;
  loadedFilename?: string;
}

export const Header: React.FC<HeaderProps> = ({
  anchorDate,
  onAnchorDateChange,
  onExportFile,
  onTriggerImport,
  onResetToDefaults,
  todayCompletedCount,
  todayTotalCount,
  hasLoadedFile,
  loadedFilename,
}) => {
  const isActualToday = anchorDate === getTodayStr();
  const completionPercent = todayTotalCount > 0 ? Math.round((todayCompletedCount / todayTotalCount) * 100) : 0;

  return (
    <header className="bg-slate-900 text-slate-100 border-b border-slate-800 shadow-xl sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Title & Education Branding */}
          <div className="flex items-center space-x-3">
            <div className="bg-amber-500/20 text-amber-400 p-2.5 rounded-xl border border-amber-500/30 flex items-center justify-center shadow-inner">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-fredoka text-xl sm:text-2xl font-bold tracking-wide text-amber-300">
                  Daily Academic Schedule
                </h1>
                <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-medium border border-amber-500/30">
                  Education Planner
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-lexend">
                Modifiable Daily Agenda • Relative Day Rows • Local File Sync
              </p>
            </div>
          </div>

          {/* Date Anchor Selector & Date Shift Testing */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-800/80 p-2 rounded-xl border border-slate-700/60 text-xs sm:text-sm">
            <div className="flex items-center space-x-2 text-slate-300 px-2 py-1">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-medium font-lexend text-slate-200 hidden sm:inline">
                Present Day (Today):
              </span>
            </div>

            <input
              type="date"
              value={anchorDate}
              onChange={(e) => e.target.value && onAnchorDateChange(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-amber-200 px-2.5 py-1 rounded-lg font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
            />

            {!isActualToday && (
              <button
                onClick={() => onAnchorDateChange(getTodayStr())}
                className="flex items-center space-x-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs px-2 py-1 rounded-lg border border-amber-500/30 transition-colors"
                title="Reset anchor date to today's actual real date"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Date</span>
              </button>
            )}

            <div className="flex items-center space-x-1 pl-1 border-l border-slate-700">
              <button
                onClick={() => onAnchorDateChange(addDaysToStr(anchorDate, -1))}
                className="px-2 py-0.5 bg-slate-700/80 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors font-mono"
                title="Shift present date back -1 day (Test dynamic row re-positioning)"
              >
                -1 Day
              </button>
              <button
                onClick={() => onAnchorDateChange(addDaysToStr(anchorDate, 1))}
                className="px-2 py-0.5 bg-slate-700/80 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors font-mono"
                title="Shift present date forward +1 day (Test dynamic row re-positioning)"
              >
                +1 Day
              </button>
            </div>
          </div>

          {/* Local File Save / Load Action Controls */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={onTriggerImport}
              className="flex items-center space-x-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg transition-all shadow-sm"
              title="Upload and view schedule info from a local file"
            >
              <Upload className="w-4 h-4 text-indigo-400" />
              <span>Load File</span>
            </button>

            <button
              onClick={onExportFile}
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm px-3.5 py-1.5 rounded-lg transition-all shadow-md shadow-emerald-900/30"
              title="Save current schedule info to a local JSON file on your computer"
            >
              <Download className="w-4 h-4" />
              <span>Save Local File</span>
            </button>
          </div>

        </div>

        {/* Today Completion Bar & File Status */}
        <div className="mt-3 pt-2.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 font-lexend">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{formatHumanDate(anchorDate)}</span>
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Today's Progress: <strong className="text-slate-200">{todayCompletedCount}/{todayTotalCount} completed</strong> ({completionPercent}%)</span>
            </div>
          </div>

          {hasLoadedFile && loadedFilename && (
            <div className="flex items-center space-x-1.5 text-indigo-300 bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-800/60 font-mono text-[11px]">
              <FileText className="w-3 h-3 text-indigo-400" />
              <span>Active File: {loadedFilename}</span>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
