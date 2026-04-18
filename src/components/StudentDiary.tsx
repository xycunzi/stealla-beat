import { useState } from 'react';
import { Scene } from './3d/Scene';
import { CyberPanel, CyberButton } from './ui/CyberUI';
import { useGemini } from '../hooks/useGemini';
import { Send, Activity, BrainCircuit, Sparkles, Wifi, Waves } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';
import { useGenerativeAudio } from '../hooks/useGenerativeAudio';
import { useTheme } from '../hooks/useTheme';

export function StudentDiary() {
  const { messages, sendMessage, isTyping, intensity, vortexColor } = useGemini();
  const [input, setInput] = useState('');
  const { t, lang } = useTranslation();
  const { isPlaying, toggleAudio } = useGenerativeAudio(intensity);
  const { theme } = useTheme();

  const isDao = theme === 'dao';
  const tDao = (cyberKey: any, daoOverride: string) => {
    return isDao && lang === 'zh' ? daoOverride : t(cyberKey);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-end pb-24 md:pb-8">
      {/* 3D background */}
      <Scene intensity={intensity} vortexColor={vortexColor} />

      {/* Energy HUD */}
      <div className="absolute top-4 left-4 right-4 md:right-auto md:w-80 md:top-8 md:left-8 z-20">
        <CyberPanel title={tDao('student_telemetry', '内视心法')}>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-mono text-text-secondary mb-2">
                <span>{tDao('student_obsession', '外物执念')}</span>
                <span className="text-electric-blue">{(intensity * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-sm overflow-hidden mb-1 relative">
                {isDao && <div className="absolute inset-0 bg-white/10 pointer-events-none" />}
                <motion.div 
                  className="h-full rounded-sm"
                  style={{ backgroundColor: vortexColor, boxShadow: `0 0 10px ${vortexColor}` }}
                  animate={{ width: `${intensity * 100}%` }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-t border-glass-border pt-4">
              <div>
                <div className="text-[10px] text-text-secondary uppercase mb-1">{tDao('student_freq', '本源灵力')}</div>
                <div className="font-mono text-xs text-electric-blue flex items-center gap-1">
                  <Activity size={12} /> {Math.floor(20 + intensity * 60)} {isDao ? '息' : 'Hz'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-text-secondary uppercase mb-1">{tDao('student_sync', '天地共鸣')}</div>
                <div className="font-mono text-xs text-accent-purple flex items-center gap-1">
                  <Wifi size={12} /> {Math.floor(99 - intensity * 40)}%
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 text-[10px] font-mono border-t border-glass-border pt-3">
              <span className="text-text-secondary uppercase">{tDao('student_status', '道脉气象')}</span>
              <span className={`px-2 py-1 rounded bg-white/5 border border-white/10 ${intensity > 0.7 ? 'text-vortex-crimson border-vortex-crimson/50' : intensity > 0.4 ? 'text-luxury-gold border-luxury-gold/50' : 'text-electric-blue border-electric-blue/50'}`}>
                {intensity > 0.7 ? tDao('student_status_critical', '走火入魔') : intensity > 0.4 ? tDao('student_status_fluctuating', '气潮翻涌') : tDao('student_status_flow', '顺其自然')}
              </span>
            </div>

            {/* Audio Toggle */}
            <button 
              onClick={toggleAudio}
              className={`w-full flex items-center justify-center gap-2 py-2 mt-2 border rounded-md transition-all font-mono text-[10px] uppercase font-bold tracking-widest ${isPlaying ? 'bg-electric-blue/10 border-electric-blue text-electric-blue shadow-[0_0_10px_rgba(0,210,255,0.2)]' : 'bg-transparent border-glass-border text-text-secondary hover:text-electric-blue hover:border-electric-blue/50'}`}
            >
              <Waves size={14} className={isPlaying ? 'animate-pulse' : ''} />
              {isPlaying ? tDao('student_audio_sync_on', '清心咒：已奏起') : tDao('student_audio_sync_off', '清心咒：止息')}
            </button>
          </div>
        </CyberPanel>
      </div>

      {/* Chat Interface */}
      <div className="w-full md:max-w-2xl px-4 z-10 flex flex-col gap-4 mt-auto">
        <div className="flex flex-col gap-3 h-[45vh] md:h-[60vh] overflow-y-auto scroll-smooth pb-4 px-2 no-scrollbar">
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className={`text-center ${isDao ? 'font-display' : 'font-sans'} font-medium text-text-secondary text-sm py-4 bg-panel-bg backdrop-blur-md rounded-xl mx-auto px-6 border border-glass-border custom-shadow`}>
                <Sparkles className="w-5 h-5 mx-auto mb-2 text-electric-blue opacity-50" />
                {tDao('student_init_msg', '[入境] 寻道者，你心间此刻有何种风雨？')}
              </motion.div>
            )}
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}
              >
                <div className={`max-w-[85%] md:max-w-[75%] px-5 py-3.5 font-sans text-[14px] shadow-lg leading-[1.7] border ${
                  msg.role === 'user' 
                    ? 'bg-electric-blue/10 text-electric-blue border-transparent rounded-[12px_12px_0_12px]' 
                    : 'bg-white/5 border-glass-border text-text-primary rounded-[0_12px_12px_12px]'
                }`}>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2 text-text-secondary text-[10px] font-mono font-bold tracking-widest uppercase">
                      <BrainCircuit size={14} className="text-accent-purple" /> {tDao('student_guide_ai', '扫地高僧')}
                    </div>
                  )}
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="flex justify-start">
                 <div className="bg-white/5 backdrop-blur-xl border border-glass-border px-5 py-4 rounded-[0_12px_12px_12px] flex items-center gap-2 shadow-lg">
                   <div className="w-2 h-2 bg-electric-blue rounded-full animate-pulse shadow-[0_0_8px_var(--color-electric-blue)]" />
                   <div className="w-2 h-2 bg-electric-blue rounded-full animate-pulse [animation-delay:0.15s] shadow-[0_0_8px_var(--color-electric-blue)]" />
                   <div className="w-2 h-2 bg-electric-blue rounded-full animate-pulse [animation-delay:0.3s] shadow-[0_0_8px_var(--color-electric-blue)]" />
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative flex items-center gap-2 bg-space-navy/90 border-t-2 border-electric-blue py-3 px-4 rounded-xl mb-4 md:mb-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={tDao('student_input_placeholder', '吐露心声...')}
            className="flex-1 bg-white/5 border border-white/20 rounded-lg pl-4 pr-12 py-3 text-text-secondary font-style-italic focus:outline-none focus:border-electric-blue/50 focus:bg-white/10 transition-all font-sans text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-6 top-1/2 -translate-y-1/2 px-4 py-2 bg-electric-blue text-space-navy font-bold uppercase tracking-widest text-xs rounded-md disabled:bg-white/10 disabled:text-text-secondary disabled:cursor-not-allowed transition-all"
          >
            {tDao('student_send', '传音')}
          </button>
        </div>
      </div>
    </div>
  );
}
