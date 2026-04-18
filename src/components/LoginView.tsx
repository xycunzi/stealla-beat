import { motion } from 'framer-motion';
import { Hexagon, BookUser, Orbit, Sparkles, Aperture } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../hooks/useTheme';

type Role = 'student' | 'teacher' | 'parent';

interface LoginViewProps {
  onLogin: (role: Role) => void;
}

export function LoginView({ onLogin }: LoginViewProps) {
  const { t, toggleLang, lang } = useTranslation();
  const { theme } = useTheme();

  const isDao = theme === 'dao';
  const tDao = (cyberKey: any, daoOverride: string) => {
    return isDao && lang === 'zh' ? daoOverride : t(cyberKey);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 relative overflow-hidden bg-space-navy bg-grid">
      <div className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_center,_rgba(0,210,255,0.05)_0%,_transparent_60%)]" />
      <div className="starfield opacity-50"></div>
      <div className="vignette"></div>

      <div className="flex flex-col items-center mb-16 text-center z-10">
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1.5, type: "spring" }}
          className="w-16 h-16 rounded-2xl bg-electric-blue/10 border border-electric-blue flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,210,255,0.3)] relative"
        >
          {isDao ? <Aperture className="w-8 h-8 text-electric-blue" /> : <Sparkles className="w-8 h-8 text-electric-blue" />}
          <div className="absolute inset-0 animate-ping rounded-2xl border border-electric-blue/50" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          data-text={tDao('app_title', '道法自然')}
          className="text-4xl md:text-5xl font-display font-medium tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-accent-purple to-electric-blue glitch-text"
        >
          {tDao('app_title', '道法自然')}
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex flex-col items-center gap-1"
        >
          <h2 className="text-sm font-mono tracking-[0.3em] uppercase text-text-primary/80">{tDao('login_title', '心法构建中...')}</h2>
          <p className="text-xs text-text-secondary font-mono uppercase tracking-widest">{tDao('login_subtitle', '请选择你的本源脉络')}</p>
        </motion.div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl z-10"
      >
        {/* Pilot Role */}
        <motion.button
          variants={item}
          onClick={() => onLogin('student')}
          className="group relative flex flex-col items-center p-8 bg-black/40 backdrop-blur-xl border border-electric-blue/20 rounded-2xl overflow-hidden hover:bg-electric-blue/10 hover:border-electric-blue transition-all duration-300 text-left custom-shadow"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity pointer-events-none">
            <Hexagon size={64} className="text-electric-blue rotate-12 group-hover:rotate-0 transition-transform duration-700" />
          </div>
          <div className="w-12 h-12 rounded-full bg-electric-blue/20 border border-electric-blue flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,210,255,0.4)] relative">
             <div className="absolute inset-0 bg-electric-blue/20 rounded-full animate-ping pointer-events-none" />
             <Hexagon className="text-electric-blue w-6 h-6 z-10 relative" />
          </div>
          <h3 className="w-full text-lg font-mono font-bold tracking-widest uppercase text-electric-blue mb-2">{tDao('login_role_pilot', '寻道者')}</h3>
          <p className="w-full text-xs text-text-secondary leading-relaxed flex-1">
            {tDao('login_role_pilot_desc', '步入灵台，化解内心的执念心魔，寻找道法自然的宁静。')}
          </p>
          <div className="w-full mt-6 text-[10px] font-mono text-electric-blue opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
            <span>{isDao ? '[ 灵脉: 已通 ]' : '[ SYSTEM: READY ]'}</span>
            <span>&rarr;</span>
          </div>
        </motion.button>

        {/* Commander Role */}
        <motion.button
          variants={item}
          onClick={() => onLogin('teacher')}
          className="group relative flex flex-col items-center p-8 bg-black/40 backdrop-blur-xl border border-eco-green/20 rounded-2xl overflow-hidden hover:bg-eco-green/10 hover:border-eco-green transition-all duration-300 text-left hover:shadow-[0_0_15px_rgba(57,255,20,0.2)]"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity pointer-events-none">
            <BookUser size={64} className="text-eco-green -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
          </div>
          <div className="w-12 h-12 rounded-full bg-eco-green/20 border border-eco-green flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(57,255,20,0.4)] relative">
            <BookUser className="text-eco-green w-6 h-6 z-10 relative" />
          </div>
          <h3 className="w-full text-lg font-mono font-bold tracking-widest uppercase text-eco-green mb-2">{tDao('login_role_commander', '引路人')}</h3>
          <p className="w-full text-xs text-text-secondary leading-relaxed flex-1">
            {tDao('login_role_commander_desc', '洞察万象微步，点拨陷入心魔障壁中的寻道者。')}
          </p>
          <div className="w-full mt-6 text-[10px] font-mono text-eco-green opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
            <span>{isDao ? '[ 天机: 已启 ]' : '[ CONSOLE: LINKED ]'}</span>
            <span>&rarr;</span>
          </div>
        </motion.button>

        {/* Base Station Role */}
        <motion.button
          variants={item}
          onClick={() => onLogin('parent')}
          className="group relative flex flex-col items-center p-8 bg-black/40 backdrop-blur-xl border border-luxury-gold/20 rounded-2xl overflow-hidden hover:bg-luxury-gold/10 hover:border-luxury-gold transition-all duration-300 text-left hover:shadow-[0_0_15px_rgba(255,190,11,0.2)]"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity pointer-events-none">
            <Orbit size={64} className="text-luxury-gold rotate-45 group-hover:rotate-0 transition-transform duration-700" />
          </div>
          <div className="w-12 h-12 rounded-full bg-luxury-gold/20 border border-luxury-gold flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(255,190,11,0.4)] relative">
            <Orbit className="text-luxury-gold w-6 h-6 z-10 relative" />
          </div>
          <h3 className="w-full text-lg font-mono font-bold tracking-widest uppercase text-luxury-gold mb-2">{tDao('login_role_base', '护法阵')}</h3>
          <p className="w-full text-xs text-text-secondary leading-relaxed flex-1">
            {tDao('login_role_base_desc', '镇守后方，通过血脉共振护佑寻道者的平衡。')}
          </p>
          <div className="w-full mt-6 text-[10px] font-mono text-luxury-gold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
            <span>{isDao ? '[ 阵法: 待命 ]' : '[ RESONANCE: STANDBY ]'}</span>
            <span>&rarr;</span>
          </div>
        </motion.button>
      </motion.div>

      <div className="absolute bottom-6 right-6 z-50">
        <button 
          onClick={toggleLang}
          className="font-mono text-xs text-text-secondary hover:text-white transition-colors border border-glass-border px-3 py-1 rounded bg-panel-bg shadow-xl"
        >
          {lang.toUpperCase()}
        </button>
      </div>
    </div>
  );
}
