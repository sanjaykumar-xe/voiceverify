import React from 'react';
import { ShieldAlertIcon } from './icons';

export const Disclaimer: React.FC = () => {
  return (
    <div className="mt-12 bg-amber-50 dark:bg-slate-800/50 border border-amber-200 dark:border-amber-500/20 rounded-lg p-6">
        <div className="flex items-start gap-4">
            <ShieldAlertIcon className="w-8 h-8 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-1" />
            <div>
                <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-400">Important Disclaimer</h3>
                <p className="mt-2 text-amber-800 dark:text-slate-400 text-sm">
                    This tool is a proof-of-concept for educational and research purposes only. It is not a forensic-grade or legally admissible verification system. 
                    The detection accuracy may vary based on audio quality, language, and the sophistication of the AI generation model.
                </p>
                <ul className="list-disc list-inside mt-3 space-y-1 text-amber-800 dark:text-slate-400 text-sm">
                    <li><strong>Privacy-First:</strong> Your audio is analyzed in memory and is not stored long-term or used for model training.</li>
                    <li><strong>No Biometrics:</strong> This tool does not identify individuals. It only analyzes acoustic patterns.</li>
                    <li><strong>Use Responsibly:</strong> Do not use this tool to make critical decisions. Results should be considered indicative, not definitive.</li>
                </ul>
            </div>
        </div>
    </div>
  );
};