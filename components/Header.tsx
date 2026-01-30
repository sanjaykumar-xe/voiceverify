import React from 'react';
import type { User } from 'firebase/auth';
import type { Theme } from '../App';
import { MicIcon, LogOutIcon } from './icons';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  user: User | null;
  isGuest: boolean;
  onLogout: () => void;
  onExitGuest: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, isGuest, onLogout, onExitGuest, theme, onToggleTheme }) => {
  const { t } = useLanguage();
  
  return (
    <header className="text-center relative">
       <div className="absolute top-0 right-0 flex items-center gap-2 sm:gap-3 text-sm">
         <LanguageSelector />
         <ThemeToggle theme={theme} onToggle={onToggleTheme} />

        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 hidden lg:inline font-medium">{user.email}</span>
            <button onClick={onLogout} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200 p-2 rounded-md bg-slate-200 dark:bg-slate-800/50 hover:bg-slate-300 dark:hover:bg-slate-700/50">
              <LogOutIcon className="w-4 h-4" />
              <span className="hidden sm:inline">{t('btnLogIn')}</span>
            </button>
          </div>
        ) : isGuest ? (
          <button onClick={onExitGuest} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 transition-all duration-200 p-2 rounded-md bg-slate-200 dark:bg-slate-800/50 hover:bg-slate-300 dark:hover:bg-slate-700/50">
             <LogOutIcon className="w-4 h-4" />
             <span className="hidden sm:inline">Exit Guest</span>
          </button>
        ) : null}
      </div>
      <div className="flex justify-center items-center gap-4 pt-16 sm:pt-0">
        <MicIcon className="w-12 h-12 text-sky-500" />
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
          VoiceVerify
        </h1>
      </div>
      <p className="mt-4 text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto italic">
        {t('heroSubtitle')}
      </p>
    </header>
  );
};