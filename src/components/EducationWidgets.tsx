import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, Filter, Award, Target, BookOpen } from 'lucide-react';
import { DEFAULT_SUBJECTS } from '../data/defaultSchedules';

interface EducationWidgetsProps {
  selectedSubjectFilter: string | null;
  onSelectSubjectFilter: (subject: string | null) => void;
  totalItemsCount: number;
  completedItemsCount: number;
}

export const EducationWidgets: React.FC<EducationWidgetsProps> = ({
  selectedSubjectFilter,
  onSelectSubjectFilter,
  totalItemsCount,
  completedItemsCount,
}) => {
  // Focus Timer state (25 min = 1500 sec)
  const [timeLeft, setTimeLeft] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setTimeLeft(1500);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
      
      {/* 1. Pomodoro Study Session Timer */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 border border-slate-800 shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Timer className="w-5 h-5 text-amber-400" />
            <h3 className="font-fredoka text-amber-300 font-semibold text-sm sm:text-base">
              Scholar Focus Timer
            </h3>
          </div>
          <span className="text-[11px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
            25 Min Study Block
          </span>
        </div>

        <div className="my-3 text-center">
          <div className="font-mono text-3xl sm:text-4xl font-bold tracking-wider text-amber-200">
            {formatTimer(timeLeft)}
          </div>
          <p className="text-xs text-slate-400 font-lexend mt-1">
            {isRunning ? '🔥 Focus session active... Stay on task!' : 'Ready to start your next study sprint?'}
          </p>
        </div>

        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center space-x-1.5 text-xs font-semibold px-4 py-1.5 rounded-xl transition-all shadow-sm ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
          </button>

          <button
            onClick={handleResetTimer}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700"
            title="Reset timer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Subject Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-amber-700" />
              <h3 className="font-fredoka text-slate-900 font-semibold text-sm sm:text-base">
                Subject Filter
              </h3>
            </div>
            {selectedSubjectFilter && (
              <button
                onClick={() => onSelectSubjectFilter(null)}
                className="text-[11px] text-amber-700 hover:underline font-medium"
              >
                Clear Filter
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500 font-lexend mb-2.5">
            Filter schedule items across Yesterday, Today & Tomorrow by subject:
          </p>

          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
            <button
              onClick={() => onSelectSubjectFilter(null)}
              className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                selectedSubjectFilter === null
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              All Subjects
            </button>
            {DEFAULT_SUBJECTS.map((sub) => {
              const isSelected = selectedSubjectFilter === sub.name;
              return (
                <button
                  key={sub.id}
                  onClick={() => onSelectSubjectFilter(isSelected ? null : sub.name)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                    isSelected
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : `${sub.bgLight} ${sub.textDark} ${sub.border} hover:opacity-90`
                  }`}
                >
                  {sub.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Academic Achievement & Target Tracker */}
      <div className="bg-amber-950 text-amber-50 rounded-2xl p-4 border border-amber-900 shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-fredoka text-amber-300 font-semibold text-sm sm:text-base">
              Academic Milestone
            </h3>
          </div>
          <Target className="w-4 h-4 text-amber-400" />
        </div>

        <div className="my-2">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-amber-200 font-lexend">Tasks Completed</span>
            <span className="font-mono text-lg font-bold text-amber-300">
              {completedItemsCount} / {totalItemsCount}
            </span>
          </div>
          <div className="w-full bg-amber-900/80 rounded-full h-2.5 mt-1.5 overflow-hidden border border-amber-700/50">
            <div
              className="bg-gradient-to-r from-amber-400 to-amber-200 h-full rounded-full transition-all duration-500"
              style={{
                width: `${totalItemsCount > 0 ? (completedItemsCount / totalItemsCount) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        <p className="text-[11px] text-amber-200/80 font-lexend italic">
          💡 "Small daily study achievements compound into extraordinary knowledge over time."
        </p>
      </div>

    </div>
  );
};
