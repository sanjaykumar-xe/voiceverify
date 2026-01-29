import React, { useState, useCallback } from 'react';
import type { User } from 'firebase/auth';
import type { Theme } from '../App';
import { Header } from '../components/Header';
import { AudioUploader } from '../components/AudioUploader';
import { ResultDisplay } from '../components/ResultDisplay';
import { HistoryPanel } from '../components/HistoryPanel';
import { Disclaimer } from '../components/Disclaimer';
import { analyzeAudio } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import type { DetectionResult, HistoryItem } from '../types';

interface DetectorPageProps {
  user: User | null;
  isGuest: boolean;
  onLogout: () => void;
  onExitGuest: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export const DetectorPage: React.FC<DetectorPageProps> = ({ user, isGuest, onLogout, onExitGuest, theme, onToggleTheme }) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const handleAudioAnalysis = useCallback(async (audioFile: File) => {
    setIsLoading(true);
    setError(null);
    setDetectionResult(null);
    setCurrentFile(audioFile);

    try {
      const result = await analyzeAudio(audioFile);
      setDetectionResult(result);
      const newHistoryItem: HistoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        fileName: audioFile.name,
        timestamp: Date.now(),
        result: result,
      };
      setHistory(prevHistory => [newHistoryItem, ...prevHistory]);
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleHistoryDelete = useCallback((id: string) => {
    setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
  }, []);

  const handleReset = () => {
    setDetectionResult(null);
    setError(null);
    setCurrentFile(null);
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8 animate-fade-in transition-colors duration-300">
      <div className="w-full max-w-7xl mx-auto flex flex-col min-h-full">
        <Header user={user} isGuest={isGuest} onLogout={onLogout} onExitGuest={onExitGuest} theme={theme} onToggleTheme={onToggleTheme} />
        
        <main className="mt-12 flex-grow">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 dark:border-slate-800 transition-all duration-300">
              {detectionResult ? (
                <ResultDisplay result={detectionResult} fileName={currentFile?.name || ''} onReset={handleReset}/>
              ) : (
                <>
                  <div className="mb-8 text-center">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{t('detectTitle')}</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">{t('detectSubtitle')}</p>
                  </div>
                  <AudioUploader 
                    onAnalyze={handleAudioAnalysis} 
                    isLoading={isLoading} 
                    error={error} 
                    isGuest={isGuest} 
                    onExitGuest={onExitGuest}
                  />
                </>
              )}
            </div>
            
            <div className="lg:col-span-4 h-full">
              <HistoryPanel history={history} onDelete={handleHistoryDelete} isGuest={isGuest} onExitGuest={onExitGuest} />
            </div>
          </div>

          <div className="mt-12 mb-12">
             <Disclaimer />
          </div>
        </main>
      </div>
    </div>
  );
};