import React from 'react';
import { ArrowRight, Calendar, Sparkles, MoveRight } from 'lucide-react';
import { formatShortDate } from '../utils/dateUtils';

interface DayPositionVisualizerProps {
  sortedDayDates: string[];
  anchorDateStr: string;
  getRelativeLabel: (dateStr: string) => string;
}

export const DayPositionVisualizer: React.FC<DayPositionVisualizerProps> = ({
  sortedDayDates,
  anchorDateStr,
  getRelativeLabel,
}) => {
  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 my-6 border border-slate-800 shadow-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="font-fredoka text-amber-300 font-semibold text-sm sm:text-base">
            Relative Day Sequence & Position Tracking
          </h3>
        </div>
        <p className="text-xs text-slate-400 font-lexend">
          As date changes, schedule rows dynamically shift position relative to <strong className="text-amber-300 font-mono">Present Day</strong>.
        </p>
      </div>

      {/* Sequence Chips */}
      <div className="flex items-center gap-2 overflow-x-auto py-2 pr-2 scrollbar-none">
        {sortedDayDates.map((dStr, index) => {
          const isToday = dStr === anchorDateStr;
          const label = getRelativeLabel(dStr);

          return (
            <React.Fragment key={dStr}>
              {index > 0 && <MoveRight className="w-4 h-4 text-slate-600 shrink-0" />}

              <div
                className={`flex flex-col items-center px-3.5 py-2 rounded-xl text-xs font-mono shrink-0 transition-all border ${
                  isToday
                    ? 'bg-amber-500/20 text-amber-200 border-amber-500/50 ring-2 ring-amber-500/30 scale-105 shadow-inner'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700'
                }`}
              >
                <span className="font-bold font-sans text-xs">
                  {isToday ? '⭐ ' + label : label}
                </span>
                <span className="text-[11px] opacity-75 mt-0.5">{formatShortDate(dStr)}</span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
