import { useState } from 'react';
import { Scene } from './3d/Scene';
import { CyberPanel, CyberButton } from './ui/CyberUI';
import { useGemini } from '../hooks/useGemini';
import { Send, Activity, BrainCircuit, Sparkles, Wifi, Waves } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';
import { useGenerativeAudio } from '../hooks/useGenerativeAudio';

export function StudentDiary() {
  const { messages, sendMessage, isTyping, intensity, vortexColor } = useGemini();
  const [input, setInput] = useState('');
  const { t } = useTranslation();
  const { isPlaying, toggleAudio } = useGenerativeAudio(intensity);

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
        <CyberPanel title={t('student_telemetry')}>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-mono text-text-secondary mb-2">
                <span>{t('student_obsession')}</span>
                <span className="text-electric-blue">{(intensity * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-sm overflow-hidden mb-1">
                <motion.div 
                  className="h-full rounded-sm"
                  style={{ backgroundColor: vortexColor, boxShadow: `0 0 10px ${vortexColor}` }}
                  animate={{ width: `${intensity * 100}%` }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-t border-glass-border pt-4">
              <div>
                <div className="text-[10px] text-text-secondary uppercase mb-1">{t('student_freq')}</div>
                <div className="font-mono text-xs text-electric-blue flex items-center gap-1">
                  <Activity size={12} /> {Math.floor(20 + intensity * 60)} Hz
                </div>
              </div>
              <div>
                <div className="text-[10px] text-text-secondary uppercase mb-1">{t('student_sync')}</div>
                <div className="font-mono text-xs text-accent-purple flex items-center gap-1">
                  <Wifi size={12} /> {Math.floor(99 - intensity * 40)}%
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 text-[10px] font-mono border-t border-glass-border pt-3">
              <span className="text-text-secondary uppercase">{t('student_status')}</span>
              <span className={`px-2 py-1 rounded bg-white/5 border border-white/10 ${intensity > 0.7 ? 'text-vortex-crimson border-vortex-crimson/50' : intensity > 0.4 ? 'text-luxury-gold border-luxury-gold/50' : 'text-electric-blue border-electric-blue/50'}`}>
                {intensity > 0.7 ? t('student_status_critical') : intensity > 0.4 ? t('student_status_fluctuating') : t('student_status_flow')}
              </span>
            </div>

            {/* Audio Toggle */}
            <button 
              onClick={toggleAudio}
              className={`w-full flex items-center justify-center gap-2 py-2 mt-2 border rounded-md transition-all font-mono text-[10px] uppercase font-bold tracking-widest ${isPlaying ? 'bg-electric-blue/10 border-electric-blue text-electric-blue shadow-[0_0_10px_rgba(0,210,255,0.2)]' : 'bg-transparent border-glass-border text-text-secondary hover:text-electric-blue hover:border-electric-blue/50'}`}
            >
              <Waves size={14} className={isPlaying ? 'animate-pulse' : ''} />
              {isPlaying ? t('student_audio_sync_on') : t('student_audio_sync_off')}
            </button>
          </div>
        </CyberPanel>
      </div>

      {/* Chat Interface */}
      <div className="w-full md:max-w-2xl px-4 z-10 flex flex-col gap-4 mt-auto">
        <div className="flex flex-col gap-3 h-[45vh] md:h-[60vh] overflow-y-auto scroll-smooth pb-4 px-2 no-scrollbar">
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-center font-display font-medium text-text-secondary text-sm py-4 bg-panel-bg backdrop-blur-md rounded-xl mx-auto px-6 border border-glass-border">
                <Sparkles className="w-5 h-5 mx-auto mb-2 text-electric-blue opacity-50" />
                {t('student_init_msg')}
              </motion.div>
            )}
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}
              >
                <div className={`max-w-[85%] md:max-w-[75%] px-5 py-3.5 font-sans text-[14px] shadow-lg leading-relaxed border ${
                  msg.role === 'user' 
                    ? 'bg-electric-blue/10 text-electric-blue border-transparent rounded-[12px_12px_0_12px]' 
                    : 'bg-white/5 border-glass-border text-text-primary rounded-[0_12px_12px_12px]'
                }`}>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2 text-text-secondary text-[10px] font-mono font-bold tracking-widest uppercase">
                      <BrainCircuit size={14} className="text-accent-purple" /> {t('student_guide_ai')}
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
            placeholder={t('student_input_placeholder')}
            className="flex-1 bg-white/5 border border-white/20 rounded-lg pl-4 pr-12 py-3 text-text-secondary font-style-italic focus:outline-none focus:border-electric-blue/50 focus:bg-white/10 transition-all font-sans text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-6 top-1/2 -translate-y-1/2 px-4 py-2 bg-electric-blue text-space-navy font-bold uppercase tracking-widest text-xs rounded-md disabled:bg-white/10 disabled:text-text-secondary disabled:cursor-not-allowed transition-all"
          >
            {t('student_send')}
          </button>
        </div>
      </div>
    </div>
  );
}
