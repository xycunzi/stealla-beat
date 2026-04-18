import { useState } from 'react';
import { CyberPanel, CyberButton } from './ui/CyberUI';
import { Network, Activity, Clock } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { useTranslation } from '../hooks/useTranslation';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export function ParentView() {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  // Mocked connection data
  const childState = "High frequency anxiety detected regarding 'Future Academic Value'.";
  
  const generateParentAdvice = async () => {
    setLoading(true);
    try {
      const prompt = `
You are the AI Assistant for the "Stellar Beat" app, talking to a parent. 
The child is experiencing: "${childState}"
Generate a short (3-4 sentences) actionable advice for the parent tonight. Do NOT focus on solving the problem logically, but rather on "energy resonance" (e.g., validating them, spending quiet time, showing unconditional worth outside of academics). Use a gentle but slightly sci-fi tone.
      `;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      setAdvice(response.text || 'Error generating advice.');
    } catch (e) {
      console.error(e);
      setAdvice('Comm-link disrupted. Cannot fetch AI guidance.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full p-4 md:p-8 flex flex-col items-center justify-start md:justify-center overflow-y-auto pb-24 md:pb-8">
      <div className="w-full max-w-3xl space-y-6 md:space-y-8 mt-4 md:mt-0">
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-4 md:mb-8 relative py-8">
          {/* Family Node Visualization */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
            <div className="w-40 md:w-64 h-1 md:h-1 rounded-full bg-gradient-to-r from-luxury-gold to-accent-purple opacity-50 blur-[2px]" />
          </div>
          
          <div className="flex flex-col items-center scale-90 md:scale-100">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-luxury-gold/10 backdrop-blur-sm border border-luxury-gold flex items-center justify-center shadow-[0_0_15px_rgba(255,190,11,0.3)]">
              <Network className="text-luxury-gold" size={28} />
            </div>
            <span className="mt-3 text-[10px] md:text-xs font-mono font-bold tracking-widest text-text-secondary uppercase">{t('parent_node')}</span>
          </div>
          
          <div className="w-16 md:w-32 flex flex-col items-center justify-center border-b border-dashed border-luxury-gold/30 h-10 -ml-2 -mr-2">
             <div className="flex justify-center gap-1 w-full opacity-50 relative bottom-3">
               <div className="w-1 h-1 rounded-full bg-luxury-gold animate-pulse" />
               <div className="w-1 h-1 rounded-full bg-luxury-gold animate-pulse [animation-delay:0.2s]" />
               <div className="w-1 h-1 rounded-full bg-luxury-gold animate-pulse [animation-delay:0.4s]" />
             </div>
          </div>
          
          <div className="flex flex-col items-center scale-90 md:scale-100">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-accent-purple/10 backdrop-blur-sm border border-accent-purple flex items-center justify-center shadow-[0_0_15px_rgba(157,80,187,0.3)]">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-accent-purple animate-pulse shadow-[0_0_15px_rgba(157,80,187,0.8)]" />
            </div>
            <span className="mt-3 text-[10px] md:text-xs font-mono font-bold tracking-widest text-text-secondary uppercase">{t('child_node')} (Alex)</span>
          </div>
        </div>

        <CyberPanel title={t('parent_telemetry')} className="mx-2 md:mx-0 border-luxury-gold/30">
          <div className="text-text-primary font-sans mb-8">
            <div className="flex items-center justify-between w-full border-b border-glass-border pb-4 mb-4">
               <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-vortex-crimson animate-ping" />
                 <span className="font-mono text-xs tracking-widest text-vortex-crimson uppercase">{t('parent_resonance_disrupted')}</span>
               </div>
               <div className="text-right">
                 <div className="text-[10px] text-text-secondary uppercase">{t('parent_resonance')}</div>
                 <div className="font-mono text-vortex-crimson">34%</div>
               </div>
            </div>

            <div className="flex items-center gap-2 mb-4 text-xs font-mono text-text-secondary w-full bg-white/5 p-3 rounded-lg border border-white/5">
              <Clock size={14} className="text-luxury-gold" /> {t('parent_last_sync')}: T-minus 48 hours
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-glass-border font-sans leading-relaxed text-sm">
              <span className="block text-xs font-mono text-text-secondary mb-2 uppercase tracking-widest">{t('parent_child_state')}</span>
              <span className="text-white italic">"{childState}"</span>
            </div>
          </div>

          <CyberButton onClick={generateParentAdvice} className="w-full justify-center border-luxury-gold text-luxury-gold hover:bg-luxury-gold/10">
            {loading ? <Activity className="animate-spin w-4 h-4" /> : <Activity className="w-4 h-4" />}
            <span>{t('parent_btn_sync')}</span>
          </CyberButton>

          {advice && (
            <div className="mt-6 p-5 bg-panel-bg border border-luxury-gold/30 rounded-xl text-text-primary relative overflow-hidden">
              <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-luxury-gold to-accent-purple" />
              <h4 className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest mb-3 text-luxury-gold ml-2">
                <Network size={14} className="text-accent-purple" /> {t('parent_ai_guideline')}
              </h4>
              <p className="text-sm leading-relaxed ml-2 text-white/90">{advice}</p>
            </div>
          )}
        </CyberPanel>
      </div>
    </div>
  );
}
