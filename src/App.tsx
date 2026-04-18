/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { StudentDiary } from './components/StudentDiary';
import { TeacherView } from './components/TeacherView';
import { ParentView } from './components/ParentView';
import { LoginView } from './components/LoginView';
import { CyberButton } from './components/ui/CyberUI';
import { Hexagon, BookUser, Orbit, Sparkles, Globe, LogOut, Cpu, Aperture } from 'lucide-react';
import { I18nProvider, useTranslation } from './hooks/useTranslation';
import { AIProvider, useAI } from './hooks/useGemini';
import { ThemeProvider, useTheme } from './hooks/useTheme';
import { motion, AnimatePresence } from 'framer-motion';

type Role = 'student' | 'teacher' | 'parent';

function AppContent() {
  const [view, setView] = useState<Role | null>(null);
  const { t, toggleLang, lang } = useTranslation();
  const { provider, setProvider } = useAI();
  const { theme, toggleTheme } = useTheme();

  const toggleAI = () => setProvider(provider === 'gemini' ? 'doubao' : 'gemini');

  // Helper macro for theme-aware dynamic labels (inline wrapper for visual demo)
  const isDao = theme === 'dao';

  const tDao = (cyberKey: any, daoOverride: string) => {
    return isDao && lang === 'zh' ? daoOverride : t(cyberKey);
  };

  if (!view) {
    return (
      <div className={isDao ? 'theme-dao' : ''}>
        <div className="scanlines"></div>
        <LoginView onLogin={(role) => setView(role)} />
      </div>
    );
  }

  return (
    <div className={`w-full h-base-height lg:h-screen flex flex-col font-sans bg-space-navy text-text-primary relative overflow-hidden ${isDao ? 'theme-dao' : ''}`}>
      <div className="starfield"></div>
      <div className="scanlines"></div>
      
      {/* Desktop Navigation */}
      <header className="hidden md:flex absolute top-0 w-full z-50 p-6 items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto bg-panel-bg backdrop-blur-xl px-5 py-3 rounded-xl border border-glass-border shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-electric-blue/20">
            {isDao ? <Aperture className="text-electric-blue w-5 h-5 absolute" /> : <Sparkles className="text-electric-blue w-5 h-5 absolute" />}
          </div>
          <h1 className="font-display font-bold text-xl tracking-wide uppercase">
            <span className="bg-gradient-to-r from-electric-blue to-accent-purple bg-clip-text text-transparent">
              {tDao('app_title', '道法自然')}
            </span>
          </h1>
        </div>
        
        <div className="flex gap-2 pointer-events-auto bg-panel-bg backdrop-blur-xl p-2 rounded-xl border border-glass-border shadow-[0_4px_24px_rgba(0,0,0,0.2)] items-center">
          <CyberButton 
            variant={view === 'student' ? 'primary' : 'ghost'} 
            active={view === 'student'} 
            onClick={() => setView('student')}
            className="rounded-full"
          >
            <Hexagon size={16} /> <span className="hidden lg:inline">{tDao('nav_pilot_full', '太极寻道者')}</span>
          </CyberButton>
          <CyberButton 
            variant={view === 'teacher' ? 'primary' : 'ghost'} 
            active={view === 'teacher'} 
            onClick={() => setView('teacher')}
            className="rounded-full"
          >
            <BookUser size={16} /> <span className="hidden lg:inline">{tDao('nav_commander_full', '传道引路人')}</span>
          </CyberButton>
          <CyberButton 
            variant={view === 'parent' ? 'primary' : 'ghost'} 
            active={view === 'parent'} 
            onClick={() => setView('parent')}
            className="rounded-full"
          >
            <Orbit size={16} /> <span className="hidden lg:inline">{tDao('nav_base_full', '护法守望台')}</span>
          </CyberButton>

          <div className="w-px h-6 bg-glass-border mx-2 self-center"></div>

          <button 
            onClick={toggleTheme}
            className={`px-4 py-2 flex items-center gap-2 transition-colors font-mono text-xs font-bold text-text-secondary hover:text-eco-green`}
          >
            <Aperture size={16} className={isDao ? 'animate-spin-slow text-eco-green' : ''} />
            {isDao ? 'DAO' : 'CYBER'}
          </button>

          <button 
            onClick={toggleAI}
            className={`px-4 py-2 flex items-center gap-2 transition-colors font-mono text-xs font-bold ${provider === 'gemini' ? 'text-electric-blue custom-shadow border-electric-blue/50' : 'text-vortex-orange custom-shadow border-vortex-orange/50'} border rounded-md`}
          >
            <Cpu size={16} />
            {provider === 'gemini' ? (isDao ? '心法: GEMINI' : 'CORE: GEMINI') : (isDao ? '心法: DOUBAO' : 'CORE: DOUBAO')}
          </button>

          <button 
            onClick={toggleLang}
            className="px-4 py-2 flex items-center gap-2 text-text-secondary hover:text-electric-blue transition-colors font-mono text-xs font-bold"
          >
            <Globe size={16} />
            {lang.toUpperCase()}
          </button>

          <button 
            onClick={() => setView(null)}
            className="px-3 py-2 flex items-center gap-2 text-text-secondary hover:text-vortex-crimson transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Mobile Lang & Logout Toggle */}
      <div className="md:hidden absolute top-4 right-4 z-50 flex gap-2">
         <button 
            onClick={toggleTheme}
            className={`w-10 h-10 flex items-center justify-center rounded-xl bg-panel-bg border transition-colors shadow-lg ${isDao ? 'text-eco-green border-eco-green/50' : 'text-text-secondary border-glass-border'}`}
          >
            <Aperture size={18} className={isDao ? 'animate-spin-slow' : ''} />
          </button>
         <button 
            onClick={toggleAI}
            className={`w-10 h-10 flex items-center justify-center rounded-xl bg-panel-bg border transition-colors shadow-lg ${provider === 'gemini' ? 'text-electric-blue border-electric-blue/50' : 'text-vortex-orange border-vortex-orange/50'}`}
          >
            <Cpu size={18} />
          </button>
         <button 
            onClick={toggleLang}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-panel-bg border border-glass-border text-text-secondary hover:text-electric-blue transition-colors shadow-lg"
          >
            <Globe size={18} />
          </button>
          <button 
            onClick={() => setView(null)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-panel-bg border border-glass-border text-text-secondary hover:text-vortex-crimson transition-colors shadow-lg"
          >
            <LogOut size={18} />
          </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full h-[calc(100vh-5rem)] md:h-full md:pt-24 z-10 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            {view === 'student' && <StudentDiary />}
            {view === 'teacher' && <TeacherView />}
            {view === 'parent' && <ParentView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden flex h-20 w-full bg-panel-bg backdrop-blur-xl border-t border-glass-border z-50 px-4 pb-safe pt-2 justify-around items-center absolute bottom-0">
        <button 
          onClick={() => setView('student')}
          className={`flex flex-col items-center justify-center w-16 h-12 gap-1 transition-all ${view === 'student' ? 'text-electric-blue scale-110 drop-shadow-[0_0_8px_rgba(0,210,255,0.6)]' : 'text-text-secondary opacity-60 hover:opacity-100'}`}
        >
          <Hexagon size={24} />
          <span className="text-[10px] font-bold tracking-wider">{tDao('nav_pilot', '寻道')}</span>
        </button>
        <button 
          onClick={() => setView('teacher')}
          className={`flex flex-col items-center justify-center w-20 h-12 gap-1 transition-all ${view === 'teacher' ? 'text-electric-blue scale-110 drop-shadow-[0_0_8px_rgba(0,210,255,0.6)]' : 'text-text-secondary opacity-60 hover:opacity-100'}`}
        >
          <BookUser size={24} />
          <span className="text-[10px] font-bold tracking-wider">{tDao('nav_commander', '引路')}</span>
        </button>
        <button 
          onClick={() => setView('parent')}
          className={`flex flex-col items-center justify-center w-16 h-12 gap-1 transition-all ${view === 'parent' ? 'text-electric-blue scale-110 drop-shadow-[0_0_8px_rgba(0,210,255,0.6)]' : 'text-text-secondary opacity-60 hover:opacity-100'}`}
        >
          <Orbit size={24} />
          <span className="text-[10px] font-bold tracking-wider">{tDao('nav_base', '护法')}</span>
        </button>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AIProvider>
          <AppContent />
        </AIProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

