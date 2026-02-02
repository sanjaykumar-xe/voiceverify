import React, { useState, useRef, useEffect } from 'react';
import { GlobeIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';
import { languages, Language } from '../translations';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-slate-600 dark:text-slate-300 border border-transparent hover:border-sky-500/30"
        aria-label="Select Language"
      >
        <GlobeIcon className="w-4 h-4" />
        <span className="text-xs font-bold uppercase hidden sm:inline">
          {languages.find(l => l.code === language)?.code}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-[100] overflow-hidden animate-fade-in-short">
          <div className="py-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors ${
                  language === lang.code ? 'text-sky-600 dark:text-sky-400 bg-sky-50/50 dark:bg-sky-900/10' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-bold leading-none mb-1">{lang.native}</span>
                  <span className="text-[10px] opacity-60 uppercase font-bold tracking-wider">{lang.label}</span>
                </div>
                {language === lang.code && (
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};