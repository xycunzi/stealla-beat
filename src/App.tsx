/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { StudentDiary } from './components/StudentDiary';
import { TeacherView } from './components/TeacherView';
import { ParentView } from './components/ParentView';
import { CyberButton } from './components/ui/CyberUI';
import { Hexagon, BookUser, Orbit, Sparkles, Globe } from 'lucide-react';
import { I18nProvider, useTranslation } from './hooks/useTranslation';

function AppContent() {
  const [view, setView] = useState<'student' | 'teacher' | 'parent'>('student');
  const { t, toggleLang, lang } = useTranslation();

  return (
    <div className="w-full h-base-height lg:h-screen flex flex-col font-sans bg-space-navy text-text-primary relative overflow-hidden">
      <div className="starfield"></div>
      
      {/* Desktop Navigation */}
      <header className="hidden md:flex absolute top-0 w-full z-50 p-6 items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto bg-panel-bg backdrop-blur-xl px-5 py-3 rounded-xl border border-glass-border shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-electric-blue/20">
            <Sparkles className="text-electric-blue w-5 h-5 absolute" />
          </div>
          <h1 className="font-display font-bold text-xl tracking-wide uppercase">
            <span className="bg-gradient-to-r from-electric-blue to-accent-purple bg-clip-text text-transparent">{t('app_title')}</span>
          </h1>
        </div>
        
        <div className="flex gap-2 pointer-events-auto bg-panel-bg backdrop-blur-xl p-2 rounded-xl border border-glass-border shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
          <CyberButton 
            variant={view === 'student' ? 'primary' : 'ghost'} 
            active={view === 'student'} 
            onClick={() => setView('student')}
            className="rounded-full"
          >
            <Hexagon size={16} /> <span className="hidden lg:inline">{t('nav_pilot_full')}</span>
          </CyberButton>
          <CyberButton 
            variant={view === 'teacher' ? 'primary' : 'ghost'} 
            active={view === 'teacher'} 
            onClick={() => setView('teacher')}
            className="rounded-full"
          >
            <BookUser size={16} /> <span className="hidden lg:inline">{t('nav_commander_full')}</span>
          </CyberButton>
          <CyberButton 
            variant={view === 'parent' ? 'primary' : 'ghost'} 
            active={view === 'parent'} 
            onClick={() => setView('parent')}
            className="rounded-full"
          >
            <Orbit size={16} /> <span className="hidden lg:inline">{t('nav_base_full')}</span>
          </CyberButton>

          <div className="w-px h-6 bg-glass-border mx-2 self-center"></div>

          <button 
            onClick={toggleLang}
            className="px-4 py-2 flex items-center gap-2 text-text-secondary hover:text-electric-blue transition-colors font-mono text-xs font-bold"
          >
            <Globe size={16} />
            {lang.toUpperCase()}
          </button>
        </div>
      </header>

      {/* Mobile Lang Toggle */}
      <div className="md:hidden absolute top-4 right-4 z-50">
         <button 
            onClick={toggleLang}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-panel-bg border border-glass-border text-text-secondary hover:text-electric-blue transition-colors shadow-lg"
          >
            <Globe size={18} />
          </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full h-[calc(100vh-5rem)] md:h-full md:pt-24 z-10 overflow-hidden relative">
        {view === 'student' && <StudentDiary />}
        {view === 'teacher' && <TeacherView />}
        {view === 'parent' && <ParentView />}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden flex h-20 w-full bg-panel-bg backdrop-blur-xl border-t border-glass-border z-50 px-4 pb-safe pt-2 justify-around items-center absolute bottom-0">
        <button 
          onClick={() => setView('student')}
          className={`flex flex-col items-center justify-center w-16 h-12 gap-1 transition-all ${view === 'student' ? 'text-electric-blue scale-110 drop-shadow-[0_0_8px_rgba(0,210,255,0.6)]' : 'text-text-secondary opacity-60 hover:opacity-100'}`}
        >
          <Hexagon size={24} />
          <span className="text-[10px] font-bold tracking-wider">{t('nav_pilot')}</span>
        </button>
        <button 
          onClick={() => setView('teacher')}
          className={`flex flex-col items-center justify-center w-20 h-12 gap-1 transition-all ${view === 'teacher' ? 'text-electric-blue scale-110 drop-shadow-[0_0_8px_rgba(0,210,255,0.6)]' : 'text-text-secondary opacity-60 hover:opacity-100'}`}
        >
          <BookUser size={24} />
          <span className="text-[10px] font-bold tracking-wider">{t('nav_commander')}</span>
        </button>
        <button 
          onClick={() => setView('parent')}
          className={`flex flex-col items-center justify-center w-16 h-12 gap-1 transition-all ${view === 'parent' ? 'text-electric-blue scale-110 drop-shadow-[0_0_8px_rgba(0,210,255,0.6)]' : 'text-text-secondary opacity-60 hover:opacity-100'}`}
        >
          <Orbit size={24} />
          <span className="text-[10px] font-bold tracking-wider">{t('nav_base')}</span>
        </button>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}

