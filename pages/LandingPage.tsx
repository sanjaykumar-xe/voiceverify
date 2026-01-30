import React, { useEffect } from 'react';
import { 
  MicIcon, ZapIcon, ShieldCheckIcon, GlobeIcon, 
  BarChartIcon, UserCheckIcon, UploadCloudIcon, CheckCircleIcon
} from '../components/icons';
import { ThemeToggle } from '../components/ThemeToggle';
import { LanguageSelector } from '../components/LanguageSelector';
import { useLanguage } from '../contexts/LanguageContext';
import type { Theme } from '../App';

interface LandingPageProps {
  onStart: (mode?: 'login' | 'signup') => void;
  onGuestLogin: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; delay: number; }> = ({ icon, title, children, delay }) => (
  <div 
    className="bg-white dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:border-sky-500/30"
    data-aos="fade-up"
    data-aos-delay={delay}
  >
    <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-lg flex items-center justify-center mb-4 text-sky-600 dark:text-sky-400">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{children}</p>
  </div>
);

const HowItWorksStep: React.FC<{ icon: React.ReactNode; title: string; number: string; children: React.ReactNode; animation: string }> = ({ icon, title, number, children, animation }) => (
  <div className="relative pl-16" data-aos={animation}>
    <div className="absolute left-0 top-0 w-12 h-12 bg-slate-200/80 dark:bg-slate-800 rounded-xl flex items-center justify-center font-black text-2xl text-sky-600 dark:text-sky-400">{number}</div>
    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400">{children}</p>
  </div>
);


export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onGuestLogin, theme, onToggleTheme }) => {
  const { t } = useLanguage();
  
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Adjust for fixed header height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-sky-500/30 transition-colors duration-300 overflow-x-hidden">
      
      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-15%] w-[70%] h-[70%] bg-sky-600/5 dark:bg-sky-600/10 rounded-full blur-[150px] opacity-60 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-indigo-600/5 dark:bg-indigo-600/10 rounded-full blur-[150px] opacity-60 animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      <header className="fixed top-0 left-0 right-0 z-[100] bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-800/50 transition-colors">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-sky-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg shadow-sky-500/20">
              <MicIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-500">
              VOICEVERIFY
            </span>
          </a>
          <div className="hidden md:flex items-center gap-10 text-sm font-bold text-slate-500 dark:text-slate-400">
            <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="hover:text-sky-600 dark:hover:text-white transition-all transform hover:-translate-y-0.5">{t('navFeatures')}</a>
            <a href="#technology" onClick={(e) => scrollToSection(e, 'technology')} className="hover:text-sky-600 dark:hover:text-white transition-all transform hover:-translate-y-0.5">{t('navTechnology')}</a>
            <a href="#privacy" onClick={(e) => scrollToSection(e, 'privacy')} className="hover:text-sky-600 dark:hover:text-white transition-all transform hover:-translate-y-0.5">{t('navPrivacy')}</a>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <button onClick={() => onStart('login')} className="hidden sm:block px-5 py-2 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-white font-bold text-sm transition-all">{t('btnLogIn')}</button>
            <button onClick={() => onStart('signup')} className="px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 transition-all font-black text-sm shadow-xl dark:shadow-white/5 transform hover:scale-105">{t('btnSignUp')}</button>
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        <section className="max-w-7xl mx-auto px-6 pt-48 pb-40 text-center">
          <div data-aos="fade-up">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-8 text-slate-900 dark:text-white">
              {t('heroTitle1')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 dark:from-sky-400 dark:via-blue-500 dark:to-indigo-600">
                {t('heroTitle2')}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed" data-aos="fade-up" data-aos-delay="200">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5" data-aos="fade-up" data-aos-delay="400">
              <button onClick={() => onStart('signup')} className="w-full sm:w-auto px-10 py-4 bg-sky-600 hover:bg-sky-500 rounded-xl text-white font-black text-lg shadow-2xl shadow-sky-600/30 transition-all hover:scale-[1.03] active:scale-[0.98]">
                {t('btnStartAnalysis')}
              </button>
              <button onClick={onGuestLogin} className="w-full sm:w-auto px-10 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:scale-[1.03] active:scale-[0.98]">
                {t('btnTryGuest')}
              </button>
            </div>
          </div>
        </section>

        <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-6">
             <div className="text-center" data-aos="fade-up">
                <h2 className="text-base font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest">{t('featuresTitle')}</h2>
                <p className="mt-4 text-4xl md:text-5xl font-black text-slate-800 dark:text-white max-w-3xl mx-auto">{t('featuresSubtitle')}</p>
             </div>
             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
                <FeatureCard title={t('feature1Title')} icon={<ZapIcon className="w-6 h-6"/>} delay={0}>{t('feature1Desc')}</FeatureCard>
                <FeatureCard title={t('feature2Title')} icon={<BarChartIcon className="w-6 h-6"/>} delay={100}>{t('feature2Desc')}</FeatureCard>
                <FeatureCard title={t('feature3Title')} icon={<GlobeIcon className="w-6 h-6"/>} delay={200}>{t('feature3Desc')}</FeatureCard>
                <FeatureCard title={t('feature4Title')} icon={<UserCheckIcon className="w-6 h-6"/>} delay={300}>{t('feature4Desc')}</FeatureCard>
             </div>
          </div>
        </section>

        <section id="how-it-works" className="py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div data-aos="fade-up">
              <h2 className="text-base font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest">{t('howItWorksTitle')}</h2>
              <p className="mt-4 text-4xl md:text-5xl font-black text-slate-800 dark:text-white">{t('howItWorksSubtitle')}</p>
            </div>
            <div className="mt-16 space-y-12 text-left">
              <HowItWorksStep number="1" title={t('step1Title')} icon={<UploadCloudIcon className="w-8 h-8"/>} animation="fade-right">{t('step1Desc')}</HowItWorksStep>
              <HowItWorksStep number="2" title={t('step2Title')} icon={<BarChartIcon className="w-8 h-8"/>} animation="fade-left">{t('step2Desc')}</HowItWorksStep>
              <HowItWorksStep number="3" title={t('step3Title')} icon={<CheckCircleIcon className="w-8 h-8"/>} animation="fade-right">{t('step3Desc')}</HowItWorksStep>
            </div>
          </div>
        </section>
        
        <section id="technology" className="py-24 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div data-aos="fade-up">
              <h2 className="text-base font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest">{t('techTitle')}</h2>
              <p className="mt-4 text-4xl md:text-5xl font-black text-slate-800 dark:text-white max-w-3xl mx-auto">{t('techSubtitle')}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mt-16 text-left">
              <div className="p-8 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-xl" data-aos="fade-up" data-aos-delay="0">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('techCard1Title')}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t('techCard1Desc')}</p>
              </div>
              <div className="p-8 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-xl" data-aos="fade-up" data-aos-delay="100">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('techCard2Title')}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t('techCard2Desc')}</p>
              </div>
              <div className="p-8 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-xl" data-aos="fade-up" data-aos-delay="200">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('techCard3Title')}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t('techCard3Desc')}</p>
              </div>
            </div>
          </div>
        </section>
        
        <section id="privacy" className="py-24">
          <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-shrink-0" data-aos="zoom-in">
              <div className="w-40 h-40 bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                <ShieldCheckIcon className="w-20 h-20 text-white" />
              </div>
            </div>
            <div data-aos="fade-left">
              <h2 className="text-base font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">{t('privacyTitle')}</h2>
              <p className="mt-4 text-4xl font-black text-slate-800 dark:text-white">{t('privacySubtitle')}</p>
              <p className="mt-6 text-slate-600 dark:text-slate-400">{t('privacyDesc')}</p>
              <ul className="mt-6 space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li className="flex items-start gap-3"><ShieldCheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />{t('privacyPoint1')}</li>
                <li className="flex items-start gap-3"><ShieldCheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />{t('privacyPoint2')}</li>
                <li className="flex items-start gap-3"><ShieldCheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />{t('privacyPoint3')}</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 py-24 bg-slate-900 dark:bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black" data-aos="fade-up">{t('ctaTitle')}</h2>
          <p className="max-w-xl mx-auto mt-4 text-slate-400" data-aos="fade-up" data-aos-delay="100">{t('ctaSubtitle')}</p>
          <div className="mt-10" data-aos="fade-up" data-aos-delay="200">
            <button onClick={() => onStart('signup')} className="px-10 py-4 bg-white hover:bg-slate-200 rounded-xl text-slate-950 font-black text-lg shadow-2xl shadow-white/10 transition-all hover:scale-[1.03] active:scale-[0.98]">
              {t('btnSignUp')}
            </button>
          </div>
          <div className="mt-24 border-t border-slate-800 pt-12">
            <p className="text-slate-500 text-sm mb-6 uppercase tracking-[0.2em] font-black">
              {t('footerTagline')}
            </p>
            <div className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em]">
              {t('footerCopyright')}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};