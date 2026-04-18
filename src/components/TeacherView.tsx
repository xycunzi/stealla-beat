import { useState, useMemo } from 'react';
import { CyberPanel, CyberButton } from './ui/CyberUI';
import { Users, Radar, Loader2, Sparkles, BrainCircuit, ShieldAlert, Activity } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { useTranslation } from '../hooks/useTranslation';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MOCK_STUDENTS = [
  { id: '1', name: 'Alex M.', energy: 0.2, type: 'Performance Anxiety', log: 'Terrified of the math final. I can\'t sleep.' },
  { id: '2', name: 'Sarah J.', energy: 0.8, type: 'Social Rejection', log: 'No one sat with me at lunch. I hate this place.' },
  { id: '3', name: 'Liam T.', energy: 0.5, type: 'Parental Pressure', log: 'Dad says I have to win the game tomorrow. It is too much.' },
  { id: '4', name: 'Chloe W.', energy: 0.1, type: 'Flow State', log: 'Finished my art project. Feeling really aligned.' },
];

export function TeacherView() {
  const [selectedStudent, setSelectedStudent] = useState(MOCK_STUDENTS[0]);
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const activeAlerts = useMemo(() => MOCK_STUDENTS.filter(s => s.energy > 0.6).length, []);
  const avgEnergy = useMemo(() => MOCK_STUDENTS.reduce((acc, s) => acc + s.energy, 0) / MOCK_STUDENTS.length, []);

  const generateAdvice = async (student: typeof MOCK_STUDENTS[0]) => {
    setLoading(true);
    try {
      const prompt = `
You are the AI Assistant for a teacher. We use a concept called "Consciousness Energy".
A student named ${student.name} is experiencing an obsession vortex: "${student.type}".
Recent log: "${student.log}"
Generate a short (3-4 sentences) guidance script for the teacher to use when talking to this student. Frame it gently, using the "energy perspective" (e.g. "I noticed your energy has been tangled...").
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
    <div className="w-full h-full p-4 md:p-8 flex flex-col md:flex-row gap-6 overflow-y-auto pb-24 md:pb-8">
      {/* List Panel */}
      <div className="w-full md:w-80 flex flex-col gap-4 shrink-0">
        <h2 className="font-display font-medium text-xl text-eco-green flex items-center gap-2 uppercase">
          <Radar className="animate-[spin_6s_linear_infinite]" /> {t('teacher_starmap')}
        </h2>

        {/* Global Class Stats */}
        <CyberPanel title={t('teacher_class_status')} className="border-eco-green/30">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
              <div className="text-[10px] text-text-secondary mb-1 flex items-center gap-1 uppercase">
                <ShieldAlert size={12} className="text-vortex-crimson" /> {t('teacher_active_alerts')}
              </div>
              <div className="text-xl font-mono text-text-primary">{activeAlerts}</div>
            </div>
            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
              <div className="text-[10px] text-text-secondary mb-1 flex items-center gap-1 uppercase">
                <Activity size={12} className="text-eco-green" /> {t('teacher_avg_energy')}
              </div>
              <div className="text-xl font-mono text-text-primary">{(avgEnergy * 100).toFixed(0)}%</div>
            </div>
          </div>
        </CyberPanel>

        <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 snap-x mt-2">
          {MOCK_STUDENTS.map(s => (
            <CyberPanel 
              key={s.id} 
              className={`cursor-pointer transition-all shrink-0 w-64 md:w-full snap-start ${selectedStudent.id === s.id ? 'border-eco-green bg-eco-green/5' : 'hover:border-glass-border opacity-70 hover:opacity-100'}`}
            >
              <div 
                className="flex justify-between items-center"
                onClick={() => { setSelectedStudent(s); setAdvice(null); }}
              >
                <div>
                  <div className="font-sans font-bold text-lg text-text-primary">{s.name}</div>
                  <div className="text-[10px] font-mono text-text-secondary uppercase tracking-widest mt-1">{s.type}</div>
                </div>
                <div className={`w-3 h-3 rounded-full border border-white/10 ${s.energy > 0.6 ? 'bg-vortex-crimson shadow-[0_0_10px_var(--color-vortex-crimson)]' : s.energy > 0.3 ? 'bg-luxury-gold shadow-[0_0_10px_var(--color-luxury-gold)]' : 'bg-eco-green shadow-[0_0_10px_var(--color-eco-green)]'}`} />
              </div>
            </CyberPanel>
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      <div className="flex-1 flex flex-col">
        <CyberPanel title={`${t('teacher_profile')}: ${selectedStudent.name}`} className="flex-1 flex flex-col border-eco-green/20">
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-mono tracking-widest text-text-secondary mb-3 uppercase">{t('teacher_vortex_sig')}</h4>
              <div className="text-sm md:text-base font-sans font-medium text-text-primary bg-white/[0.03] p-5 rounded-lg border border-glass-border">
                "{selectedStudent.log}"
              </div>
            </div>

            <div className="pt-2">
              <CyberButton onClick={() => generateAdvice(selectedStudent)} className="w-full md:w-auto hover:bg-eco-green/10 border-eco-green text-eco-green">
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                {t('teacher_btn_generate')}
              </CyberButton>
            </div>

            {advice && (
              <div className="mt-6 p-5 bg-panel-bg border border-eco-green/30 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-eco-green" />
                <h4 className="flex items-center gap-2 text-xs font-mono text-eco-green mb-3 font-bold uppercase tracking-widest ml-3">
                  <BrainCircuit size={14} className="text-accent-purple" /> {t('teacher_ai_recommendation')}
                </h4>
                <div className="text-sm text-text-primary font-sans leading-relaxed ml-3">
                  {advice}
                </div>
              </div>
            )}
          </div>
        </CyberPanel>
      </div>
    </div>
  );
}
