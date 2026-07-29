import React, { useRef, useState } from 'react';
import { Upload, FileJson, CheckCircle, AlertCircle, Save, FileText, Sparkles, RefreshCw } from 'lucide-react';
import { LoadedFileMeta } from '../types';

interface FilePersistenceBarProps {
  loadedMeta: LoadedFileMeta | null;
  onFileSelected: (file: File) => void;
  onExportFile: () => void;
  onLoadSample: () => void;
}

export const FilePersistenceBar: React.FC<FilePersistenceBarProps> = ({
  loadedMeta,
  onFileSelected,
  onExportFile,
  onLoadSample,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.name.endsWith('.json') && !file.name.endsWith('.txt')) {
      setFileError('Please select a valid .json schedule file.');
      return;
    }
    setFileError(null);
    onFileSelected(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="bg-amber-900/10 border border-amber-800/30 rounded-2xl p-4 my-4 shadow-sm">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left Info / Loaded Meta */}
        <div className="flex items-start space-x-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-xl border border-amber-500/20 shrink-0">
            <FileJson className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-fredoka text-slate-800 font-semibold text-base flex items-center gap-2">
              <span>Local File Storage & Sync</span>
              {loadedMeta ? (
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full border border-emerald-300 font-sans flex items-center gap-1 font-normal">
                  <CheckCircle className="w-3 h-3 text-emerald-600" /> Loaded from local file
                </span>
              ) : (
                <span className="bg-slate-200 text-slate-700 text-xs px-2 py-0.5 rounded-full font-sans font-normal">
                  Browser LocalStorage + Ready to Save
                </span>
              )}
            </h3>

            {loadedMeta ? (
              <p className="text-xs text-slate-600 font-lexend mt-0.5">
                Displaying info from <strong className="text-slate-900 font-mono">{loadedMeta.filename}</strong> ({Math.round(loadedMeta.sizeBytes / 1024)} KB) • <span className="text-amber-800 font-medium">{loadedMeta.schedulesCount} days / {loadedMeta.totalItemsCount} schedule entries</span> loaded at {loadedMeta.importedAt}.
              </p>
            ) : (
              <p className="text-xs text-slate-600 font-lexend mt-0.5">
                Save your schedule to a <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-amber-900">.json</code> file on your computer, or load an existing schedule file to view and edit your data.
              </p>
            )}

            {fileError && (
              <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{fileError}</span>
              </p>
            )}
          </div>
        </div>

        {/* Right Upload Drag Target & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all flex items-center space-x-2 ${
              isDragging
                ? 'border-amber-500 bg-amber-50 text-amber-900 scale-102'
                : 'border-amber-300/80 hover:border-amber-500 bg-white/80 text-slate-700 hover:text-amber-900'
            }`}
          >
            <Upload className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Drop or click to select <strong className="text-amber-800">.json schedule file</strong></span>
          </div>

          <button
            onClick={onExportFile}
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-medium px-3 py-2 rounded-xl border border-slate-700 shadow-sm transition-colors"
            title="Download current schedule state into a local JSON file"
          >
            <Save className="w-3.5 h-3.5 text-amber-400" />
            <span>Save to File</span>
          </button>

          <button
            onClick={onLoadSample}
            className="flex items-center space-x-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-medium px-3 py-2 rounded-xl border border-amber-300 transition-colors"
            title="Load default sample academic schedules for Yesterday, Today, and Tomorrow"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-700" />
            <span>Reload Sample</span>
          </button>

        </div>

      </div>
    </div>
  );
};
