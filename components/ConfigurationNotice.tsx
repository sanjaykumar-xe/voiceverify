
import React from 'react';
import { ShieldAlertIcon } from './icons';

interface Props {
  isFirebaseConfigured: boolean;
  isGeminiConfigured: boolean;
}

export const ConfigurationNotice: React.FC<Props> = ({ isFirebaseConfigured, isGeminiConfigured }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="w-full max-w-3xl bg-slate-800/50 rounded-2xl p-8 shadow-2xl border border-amber-500/50">
        <div className="flex items-start gap-4">
          <ShieldAlertIcon className="w-10 h-10 text-amber-400 flex-shrink-0 mt-1" />
          <div>
            <h1 className="text-2xl font-bold text-amber-400">Action Required: Project Configuration</h1>
            <p className="mt-3 text-slate-300">
              Before you can use this application, you need to provide your API keys for Firebase.
            </p>
            <p className="mt-2 text-slate-400">
              Please open the following file in your code editor:
            </p>
            <div className="my-4 p-3 bg-slate-900 rounded-md font-mono text-sky-400 text-center">
              config.ts
            </div>
            
            <div className="space-y-5 border-t border-slate-700 pt-4">
              {!isFirebaseConfigured && (
                 <div className="animate-fade-in-short">
                   <h3 className="font-semibold text-lg text-slate-200">1. Firebase Setup (Incomplete)</h3>
                   <p className="text-slate-400 text-sm mt-1">
                     Update the `firebaseConfig` object with the values from your Firebase project settings.
                     <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline ml-2 font-semibold">
                       Find your Firebase keys &rarr;
                     </a>
                   </p>
                 </div>
              )}
            </div>

            <p className="mt-6 text-sm text-slate-500">
              After saving your changes to `config.ts`, please refresh this page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
