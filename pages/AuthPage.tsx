import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { Spinner } from '../components/Spinner';
import { 
  MicIcon, EyeIcon, EyeOffIcon 
} from '../components/icons';
import { ThemeToggle } from '../components/ThemeToggle';
import type { Theme } from '../App';

interface AuthPageProps {
  onGuestLogin: () => void;
  onBack: () => void;
  initialMode?: 'login' | 'signup';
  theme: Theme;
  onToggleTheme: () => void;
}

type AuthMode = 'login' | 'signup';

const getFriendlyErrorMessage = (errorCode: string): string => {
    const cleanErrorCode = errorCode.toLowerCase().trim();
    switch (cleanErrorCode) {
        case 'auth/wrong-password': return 'Incorrect password. Please try again.';
        case 'auth/invalid-credential': return 'Invalid credentials. Please check your email and password.';
        case 'auth/email-already-in-use': return 'Email already in use. Please log in.';
        case 'auth/weak-password': return 'Password must be at least 6 characters.';
        case 'auth/user-not-found': return 'Account not found.';
        default: return 'An error occurred. Please try again.';
    }
}

export const AuthPage: React.FC<AuthPageProps> = ({ onGuestLogin, onBack, initialMode = 'login', theme, onToggleTheme }) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<{ code: string, message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError({
          code: err.code || 'unknown',
          message: getFriendlyErrorMessage(err.code || 'unknown'),
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 animate-fade-in overflow-y-auto relative transition-colors duration-300">
      {/* Top Controls */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>

      <div className="w-full max-w-md flex flex-col items-center mb-8">
        <div className="flex items-center gap-3 mb-4">
          <MicIcon className="w-10 h-10 text-sky-500" />
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
            VoiceVerify
          </h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-center font-medium">
          Detect AI-generated voices with confidence.
        </p>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-slate-800/50 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8 overflow-hidden relative">
        {/* Return to Landing / Back Button */}
        <button 
          onClick={onBack}
          className="absolute top-4 left-6 text-xs font-bold text-slate-400 hover:text-sky-500 transition-colors flex items-center gap-1"
        >
          ← Back to Home
        </button>

        <div className="flex border-b border-slate-200 dark:border-slate-700 mb-8 mt-6">
          <button 
            onClick={() => setMode('login')} 
            className={`w-1/2 py-4 font-bold text-lg transition-all ${mode === 'login' ? 'text-sky-500 border-b-2 border-sky-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
          >
            Log In
          </button>
          <button 
            onClick={() => setMode('signup')} 
            className={`w-1/2 py-4 font-bold text-lg transition-all ${mode === 'signup' ? 'text-sky-500 border-b-2 border-sky-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
          >
            Sign Up
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm text-center font-medium animate-fade-in-short">
              {error.message}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all text-slate-900 dark:text-white font-medium" 
              placeholder="name@example.com" 
            />
          </div>

          <div className="relative">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
              {mode === 'login' && <button type="button" className="text-xs text-sky-500 hover:underline font-bold">Forgot password?</button>}
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all text-slate-900 dark:text-white" 
                placeholder="••••••••" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full h-14 flex items-center justify-center bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-black text-lg rounded-xl transition-all transform active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-sky-500/20"
          >
            {isLoading ? <Spinner className="h-6 w-6 text-white" /> : (mode === 'login' ? 'Log In' : 'Create Account')}
          </button>

          <div className="text-center pt-2">
             <button 
               type="button"
               onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
               className="text-sm text-slate-500 dark:text-slate-400 hover:text-sky-500 transition-colors font-medium"
             >
               {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
               <span className="text-sky-500 font-bold underline ml-1">
                  {mode === 'login' ? "Sign Up" : "Log In"}
               </span>
             </button>
          </div>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-700 text-center">
          <button onClick={onGuestLogin} className="w-full py-4 px-4 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-bold text-sm">
            Continue as Guest
          </button>
          <p className="mt-4 text-xs text-slate-400 dark:text-slate-500 font-medium italic">
            Guest mode allows for quick testing without saving history.
          </p>
        </div>
      </div>
    </div>
  );
};