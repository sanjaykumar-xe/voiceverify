import React from 'react';
import type { Theme } from '../App';
import { SunIcon, MoonIcon } from './icons';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`
        relative inline-flex items-center h-9 w-16 rounded-full 
        transition-all duration-500 ease-in-out focus:outline-none 
        focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 
        focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900
        hover:scale-105 active:scale-90
        ${theme === 'light' ? 'bg-slate-200 shadow-inner' : 'bg-slate-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]'}
      `}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* The Toggle Knob */}
      <span
        className={`
          absolute inset-1 w-7 h-7 rounded-full bg-white dark:bg-slate-700 
          shadow-lg transform transition-transform duration-500 
          cubic-bezier(0.34, 1.56, 0.64, 1)
          ${theme === 'dark' ? 'translate-x-7' : 'translate-x-0'}
        `}
      />
      
      {/* The Icons */}
      <div className="relative w-full flex justify-around items-center px-1 z-10 pointer-events-none">
        <div className={`
          transition-all duration-500 transform
          ${theme === 'light' ? 'scale-110 rotate-0 opacity-100' : 'scale-75 -rotate-12 opacity-40'}
        `}>
          <SunIcon className={`w-4 h-4 ${theme === 'light' ? 'text-amber-500' : 'text-slate-400'}`} />
        </div>
        
        <div className={`
          transition-all duration-500 transform
          ${theme === 'dark' ? 'scale-110 rotate-0 opacity-100' : 'scale-75 rotate-12 opacity-40'}
        `}>
          <MoonIcon className={`w-4 h-4 ${theme === 'dark' ? 'text-sky-400' : 'text-slate-500'}`} />
        </div>
      </div>

      {/* Decorative inner glow for dark mode knob */}
      {theme === 'dark' && (
        <span className="absolute right-1 top-1 w-7 h-7 rounded-full bg-sky-500/10 animate-pulse pointer-events-none" />
      )}
    </button>
  );
};