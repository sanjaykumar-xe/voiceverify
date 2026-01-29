import React from 'react';
import type { HistoryItem } from '../types';
import { BotIcon, UserIcon, ShieldAlertIcon, TrashIcon, HistoryIcon, AudioWaveformIcon, ClockIcon, ZapIcon } from './icons';

interface HistoryPanelProps {
  history: HistoryItem[];
  onDelete: (id: string) => void;
  isGuest?: boolean;
  onExitGuest?: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onDelete, isGuest, onExitGuest }) => {
  const formatTime = (ts: number) => {
    return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(new Date(ts));
  };

  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-2">
        <HistoryIcon className="w-6 h-6 text-sky-500 dark:text-sky-400"/>
        <h2 className="text-2xl font-bold text-sky-600 dark:text-sky-400">Detection History</h2>
      </div>
      
      <div className="bg-sky-50 dark:bg-sky-900/20 p-3 rounded-lg flex items-start gap-3 mb-6 border border-sky-100 dark:border-sky-900/50">
        <span className="text-lg">🔒</span>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-tight">
          <strong>Privacy Guaranteed:</strong> Audio is processed temporarily in memory and is never saved or stored.
        </p>
      </div>

      {isGuest && (
        <button 
          onClick={onExitGuest}
          className="mb-6 w-full p-4 bg-gradient-to-br from-sky-500/10 to-blue-500/10 border border-sky-500/30 rounded-xl group hover:border-sky-500 transition-all flex items-center justify-between"
        >
          <div className="text-left">
            <p className="text-xs font-black text-sky-600 dark:text-sky-400 uppercase tracking-widest flex items-center gap-1">
              <ZapIcon className="w-3 h-3" /> Go Pro
            </p>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Sign In to Save History</p>
          </div>
          <span className="text-sky-500 group-hover:translate-x-1 transition-transform">→</span>
        </button>
      )}

      {history.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl py-10">
          <AudioWaveformIcon className="w-12 h-12 mb-3 opacity-20"/>
          <p className="font-bold text-slate-500 dark:text-slate-400">No detections yet.</p>
          <p className="text-sm">Your recent sessions appear here.</p>
        </div>
      ) : (
        <ul className="space-y-4 flex-grow overflow-y-auto pr-1">
          {history.map((item) => {
            const isAI = item.result.label === 'AI';
            const isUncertain = item.result.label === 'Uncertain';
            
            return (
              <li key={item.id} className="group bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl flex items-center justify-between animate-fade-in-short border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className={`p-2 rounded-full flex-shrink-0 ${isAI ? 'bg-red-100 dark:bg-red-900/30' : isUncertain ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                    {isAI ? <BotIcon className="w-5 h-5 text-red-500" /> : isUncertain ? <ShieldAlertIcon className="w-5 h-5 text-amber-500" /> : <UserIcon className="w-5 h-5 text-green-500" />}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate" title={item.fileName}>{item.fileName}</p>
                    <div className="flex items-center gap-2 mt-1">
                       <span className={`text-xs font-black uppercase tracking-tighter ${isAI ? 'text-red-500' : isUncertain ? 'text-amber-500' : 'text-green-500'}`}>
                        {item.result.label} • {Math.round(item.result.confidence * 100)}%
                       </span>
                       {item.result.detectedLanguage && (
                         <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 font-bold uppercase">
                           {item.result.detectedLanguage.substring(0, 3)}
                         </span>
                       )}
                       <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                         <ClockIcon className="w-2.5 h-2.5" />
                         {formatTime(item.timestamp)}
                       </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => onDelete(item.id)} 
                  className="p-2 opacity-0 group-hover:opacity-100 rounded-lg text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 transition-all flex-shrink-0"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};