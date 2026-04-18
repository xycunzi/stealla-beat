import { useState, useMemo } from 'react';
import { CyberPanel, CyberButton } from './ui/CyberUI';
import { Users, Radar, Loader2, Sparkles, BrainCircuit, ShieldAlert, Activity } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useAI } from '../hooks/useGemini';
import { useTheme } from '../hooks/useTheme';

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
  const { t, lang } = useTranslation();
  const { generateText } = useAI();
  const { theme } = useTheme();

  const isDao = theme === 'dao';
  const tDao = (cyberKey: any, daoOverride: string) => {
    return isDao && lang === 'zh' ? daoOverride : t(cyberKey);
  };

  const activeAlerts = useMemo(() => MOCK_STUDENTS.filter(s => s.energy > 0.6).length, []);
  const avgEnergy = useMemo(() => MOCK_STUDENTS.reduce((acc, s) => acc + s.energy, 0) / MOCK_STUDENTS.length, []);

  const handleGenerateAdvice = async (student: typeof MOCK_STUDENTS[0]) => {
    setLoading(true);
    try {
      const prompt = `
A student named ${student.name} is experiencing an obsession vortex: "${student.type}".
Recent log: "${student.log}"
Generate a short (3-4 sentences) guidance script for the teacher to use when talking to this student. Frame it gently, using the "energy perspective" (e.g. "I noticed your energy has been tangled...").
      `;
      const systemInst = isDao 
        ? `You are an ancient Daoist master giving advice to a teacher on how to guide a disciple out of their inner demons.` 
        : `You are the AI Assistant for a teacher. We use a concept called "Consciousness Energy".`;
      const text = await generateText(prompt, systemInst);
      setAdvice(text || 'Error generating advice.');
    } catch (e) {
      console.error(e);
      setAdvice(isDao ? '法阵能量不足以生成锦囊...' : 'Comm-link disrupted. Cannot fetch AI guidance.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full p-4 md:p-8 flex flex-col md:flex-row gap-6 overflow-y-auto pb-24 md:pb-8">
      {/* List Panel */}
      <div className="w-full md:w-80 flex flex-col gap-4 shrink-0 z-10">
        <h2 className="font-display font-medium text-xl text-eco-green flex items-center gap-2 uppercase">
          <Radar className="animate-[spin_6s_linear_infinite]" /> {tDao('teacher_starmap', '门徒根骨谱')}
        </h2>

        {/* Global Class Stats */}
        <CyberPanel title={tDao('teacher_class_status', '宗门气象')} className="border-eco-green/30 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-eco-green/10 blur-3xl rounded-full pointer-events-none" />
          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
              <div className="text-[10px] text-text-secondary mb-1 flex items-center gap-1 uppercase">
                <ShieldAlert size={12} className="text-vortex-crimson" /> {tDao('teacher_active_alerts', '走火入魔预警')}
              </div>
              <div className="text-xl font-mono text-text-primary">{activeAlerts}</div>
            </div>
            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
              <div className="text-[10px] text-text-secondary mb-1 flex items-center gap-1 uppercase">
                <Activity size={12} className="text-eco-green" /> {tDao('teacher_avg_energy', '宗门平均执念')}
              </div>
              <div className="text-xl font-mono text-text-primary">{(avgEnergy * 100).toFixed(0)}%</div>
            </div>
          </div>
        </CyberPanel>

        <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 snap-x mt-2">
          {MOCK_STUDENTS.map(s => (
            <CyberPanel 
              key={s.id} 
              className={`cursor-pointer transition-all shrink-0 w-64 md:w-full snap-start backdrop-blur-md ${selectedStudent.id === s.id ? 'border-eco-green bg-eco-green/10 shadow-[0_0_15px_rgba(57,255,20,0.1)]' : 'hover:border-glass-border opacity-70 hover:opacity-100'}`}
            >
              <div 
                className="flex justify-between items-center"
                onClick={() => { setSelectedStudent(s); setAdvice(null); }}
              >
                <div>
                  <div className="font-sans font-bold text-lg text-text-primary">{s.name}</div>
                  <div className="text-[10px] font-mono text-text-secondary uppercase tracking-widest mt-1">{isDao ? s.type.replace('Anxiety', '劫').replace('Pressure', '业障').replace('Rejection', '孤星').replace('Flow', '化境') : s.type}</div>
                </div>
                <div className={`w-3 h-3 rounded-full border border-white/10 ${s.energy > 0.6 ? 'bg-vortex-crimson shadow-[0_0_10px_var(--color-vortex-crimson)]' : s.energy > 0.3 ? 'bg-luxury-gold shadow-[0_0_10px_var(--color-luxury-gold)]' : 'bg-eco-green shadow-[0_0_10px_var(--color-eco-green)]'}`} />
              </div>
            </CyberPanel>
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      <div className="flex-1 flex flex-col z-10">
        <CyberPanel title={`${tDao('teacher_profile', '修道者卷宗')}: ${selectedStudent.name}`} className="flex-1 flex flex-col border-eco-green/20 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
          <div className="space-y-6 relative z-10">
            <div>
              <h4 className="text-xs font-mono tracking-widest text-text-secondary mb-3 uppercase">{tDao('teacher_vortex_sig', '心魔残影')}</h4>
              <div className="text-sm md:text-base font-sans font-medium text-text-primary bg-white/[0.03] p-5 rounded-lg border border-glass-border relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-eco-green/50 rounded-l" />
                "{selectedStudent.log}"
              </div>
            </div>

            <div className="pt-2">
              <CyberButton onClick={() => handleGenerateAdvice(selectedStudent)} className="w-full md:w-auto hover:bg-eco-green/10 border-eco-green text-eco-green font-display font-bold px-6">
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                {tDao('teacher_btn_generate', '开启点化锦囊')}
              </CyberButton>
            </div>

            {advice && (
              <div className="mt-6 p-5 bg-panel-bg border border-eco-green/30 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-eco-green shadow-[0_0_10px_var(--color-eco-green)]" />
                <h4 className="flex items-center gap-2 text-xs font-mono text-eco-green mb-3 font-bold uppercase tracking-widest ml-3">
                  <BrainCircuit size={14} className="text-accent-purple" /> {tDao('teacher_ai_recommendation', '祖师爷点化')}
                </h4>
                <div className="text-sm text-text-primary font-sans leading-[1.7] ml-3">
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
