import React, { useState } from 'react';
import type { DetectionResult } from '../types';
import { BotIcon, UserIcon, InfoIcon } from './icons';

interface ResultDisplayProps {
  result: DetectionResult;
  fileName: string;
  onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, fileName, onReset }) => {
  const isAI = result.label === 'AI';
  const isUncertain = result.label === 'Uncertain';
  const confidencePercent = Math.round(result.confidence * 100);

  return (
    <div className="flex flex-col w-full animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-700 text-center">
        <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 ${isAI ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : isUncertain ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'bg-green-100 dark:bg-green-900/30 text-green-600'}`}>
          {isAI ? <BotIcon className="w-12 h-12" /> : isUncertain ? <InfoIcon className="w-12 h-12" /> : <UserIcon className="w-12 h-12" />}
        </div>
        
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">
          {isAI ? 'Detected as AI' : isUncertain ? 'Uncertain Result' : 'Detected as Human'}
        </h2>
        <div className="text-5xl font-black text-sky-500 mb-4">{confidencePercent}% <span className="text-sm text-slate-500 uppercase tracking-widest">Confidence</span></div>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto mb-8">
          {result.explanation}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left">
           <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
             <span className="text-[10px] font-black text-slate-400 uppercase">Primary Language</span>
             <p className="font-bold text-slate-800 dark:text-slate-200">{result.detectedLanguage || 'Undetected'}</p>
           </div>
           <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
             <span className="text-[10px] font-black text-slate-400 uppercase">Analysis Status</span>
             <p className="font-bold text-green-500">Verified</p>
           </div>
        </div>

        <div className="bg-sky-50 dark:bg-sky-900/20 p-6 rounded-xl border border-sky-100 dark:border-sky-900/30 text-left">
           <h4 className="font-black text-sky-700 dark:text-sky-400 text-sm uppercase mb-3">Analysis Reasoning</h4>
           <ul className="space-y-2">
             {result.reasoningPoints.map((point, i) => (
               <li key={i} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
                 <span className="text-sky-500 mt-1">•</span>
                 {point}
               </li>
             ))}
           </ul>
        </div>

        <button
          onClick={onReset}
          className="mt-8 w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest rounded-xl transition-all hover:scale-[1.02]"
        >
          New Analysis
        </button>
      </div>
    </div>
  );
};