import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './services/firebase';
import { AuthPage } from './pages/AuthPage';
import { DetectorPage } from './pages/DetectorPage';
import { LandingPage } from './pages/LandingPage';
import { Spinner } from './components/Spinner';
import { isFirebaseConfigured, isGeminiConfigured } from './config';
import { ConfigurationNotice } from './components/ConfigurationNotice';
import { LanguageProvider } from './contexts/LanguageContext';

export type Theme = 'light' | 'dark';

const GUEST_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes guest session

const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  const [theme, setTheme] = useState<Theme>('light');
  const [isLandingVisited, setIsLandingVisited] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const guestTimeoutRef = useRef<any>(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const initialTheme = storedTheme ? storedTheme : 'light';
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
      if (currentUser) {
        setIsLandingVisited(true);
        setIsGuest(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isGuest) {
      guestTimeoutRef.current = setTimeout(() => {
        handleExitGuest();
        alert("Guest session expired. Please sign in to continue using VoiceVerify.");
      }, GUEST_TIMEOUT_MS);
    } else {
      if (guestTimeoutRef.current) clearTimeout(guestTimeoutRef.current);
    }
    return () => {
      if (guestTimeoutRef.current) clearTimeout(guestTimeoutRef.current);
    };
  }, [isGuest]);

  const handleLogout = async () => {
    await auth.signOut();
    setIsGuest(false);
    setIsLandingVisited(false);
  };

  const handleGuestLogin = () => {
    setIsGuest(true);
    setIsLandingVisited(true);
  };
  
  const handleExitGuest = () => {
    setIsGuest(false);
    setIsLandingVisited(false);
    if (guestTimeoutRef.current) clearTimeout(guestTimeoutRef.current);
  }

  const handleStart = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setIsLandingVisited(true);
  };

  const handleBackToLanding = () => {
    setIsLandingVisited(false);
  };

  if (!isFirebaseConfigured || !isGeminiConfigured) {
    return <ConfigurationNotice isFirebaseConfigured={isFirebaseConfigured} isGeminiConfigured={isGeminiConfigured} />;
  }

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (user || isGuest) {
    return <DetectorPage user={user} isGuest={isGuest} onLogout={handleLogout} onExitGuest={handleExitGuest} theme={theme} onToggleTheme={toggleTheme} />;
  }

  if (!isLandingVisited) {
    return <LandingPage onStart={handleStart} onGuestLogin={handleGuestLogin} theme={theme} onToggleTheme={toggleTheme} />;
  }

  return <AuthPage onGuestLogin={handleGuestLogin} initialMode={authMode} onBack={handleBackToLanding} theme={theme} onToggleTheme={toggleTheme} />;
};

const App: React.FC = () => (
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
);

export default App;