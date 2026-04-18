import { useState, createContext, useContext, ReactNode } from 'react';

type Language = 'en' | 'zh';

const translations = {
  en: {
    app_title: "STELLAR BEAT",
    nav_pilot: "PILOT",
    nav_commander: "CMD",
    nav_base: "BASE",
    nav_pilot_full: "PILOT VIEW",
    nav_commander_full: "COMMANDER",
    nav_base_full: "FAMILY BASE",

    // Login
    login_title: "SYSTEM INITIALIZATION",
    login_subtitle: "SELECT CONSCIOUSNESS VESSEL",
    login_role_pilot: "PILOT VESSEL",
    login_role_pilot_desc: "Access your inner dimension and clear the vortex.",
    login_role_commander: "COMMAND CENTER",
    login_role_commander_desc: "Monitor fleet telemetry and deploy guidance.",
    login_role_base: "BASE STATION",
    login_role_base_desc: "Analyze resonance and re-establish connection.",
    login_enter: "INITIALIZE LINK",

    // Student View
    student_telemetry: "LIFESTREAM TELEMETRY",
    student_obsession: "Obsession Level",
    student_freq: "Core Frequency",
    student_sync: "Sync Rate",
    student_status: "Status",
    student_status_critical: "CRITICAL_VORTEX",
    student_status_fluctuating: "FLUCTUATING",
    student_status_flow: "FLOW_STATE",
    student_init_msg: "[ INIT_LINK ] Welcome, Pilot. How is your energy field today?",
    student_guide_ai: "GUIDE_AI",
    student_input_placeholder: "Transmit your emotional frequency...",
    student_send: "SEND",
    student_audio_sync_on: "AUDIO RESONANCE: SYNCED",
    student_audio_sync_off: "AUDIO RESONANCE: OFFLINE",
    
    // Teacher View
    teacher_starmap: "STAR MAP",
    teacher_profile: "PILOT PROFILE",
    teacher_vortex_sig: "VORTEX SIGNATURE",
    teacher_btn_generate: "GENERATE INTERVENTION GUIDE",
    teacher_ai_recommendation: "AI RECOMMENDATION",
    teacher_class_status: "Fleet Status",
    teacher_active_alerts: "Active Alerts",
    teacher_avg_energy: "Avg Fleet Obsession",
    
    // Parent View
    parent_node: "PARENT NODE",
    child_node: "CHILD NODE",
    parent_telemetry: "CONNECTION TELEMETRY",
    parent_resonance: "Current Resonance",
    parent_resonance_disrupted: "Resonance Disrupted",
    parent_child_state: "Child State Flow",
    parent_last_sync: "Last Successful Sync",
    parent_btn_sync: "REQUEST SYNC PROTOCOL",
    parent_ai_guideline: "AI SYNC GUIDELINE",
    
    // Global
    loading: "PROCESSING...",
    lang_toggle: "切换中文",
  },
  zh: {
    app_title: "星尘跳动",
    nav_pilot: "领航员",
    nav_commander: "指挥官",
    nav_base: "家庭基地",
    nav_pilot_full: "领航员视图",
    nav_commander_full: "中枢指挥官",
    nav_base_full: "家庭基地",

    // Login
    login_title: "系统正在初始化",
    login_subtitle: "请选择你的意识容器",
    login_role_pilot: "领航员终端",
    login_role_pilot_desc: "接入内维空间，疏导情绪能量漩涡。",
    login_role_commander: "中枢指挥台",
    login_role_commander_desc: "监控舰队遥测数据，部署干预策略。",
    login_role_base: "家庭基地站",
    login_role_base_desc: "分析同频共鸣，重建意识连接链路。",
    login_enter: "建立神经链路",

    // Student View
    student_telemetry: "生命流遥测",
    student_obsession: "执念浓度",
    student_freq: "核心共振特征",
    student_sync: "高维同步率",
    student_status: "当前状态",
    student_status_critical: "临界漩涡",
    student_status_fluctuating: "能量波动",
    student_status_flow: "心流状态",
    student_init_msg: "[ 链路初始化 ] 欢迎你，领航员。今天的能量场感觉如何？",
    student_guide_ai: "向导_AI",
    student_input_placeholder: "传输你的全息情绪频率...",
    student_send: "发送广播",
    student_audio_sync_on: "音频共振生成系统：已链接",
    student_audio_sync_off: "音频共振生成系统：离线",

    // Teacher View
    teacher_starmap: "星图坐标",
    teacher_profile: "领航员档案",
    teacher_vortex_sig: "漩涡特征码",
    teacher_btn_generate: "生成干预指南",
    teacher_ai_recommendation: "AI 战术建议",
    teacher_class_status: "舰队总体状态",
    teacher_active_alerts: "活跃的高危预警",
    teacher_avg_energy: "舰队平均执念值",

    // Parent View
    parent_node: "母星节点",
    child_node: "子星节点",
    parent_telemetry: "连接遥测",
    parent_resonance: "当前链接共鸣率",
    parent_resonance_disrupted: "引力波连接中断",
    parent_child_state: "子星状态波形",
    parent_last_sync: "上次成功同步时间",
    parent_btn_sync: "请求意识同步协议",
    parent_ai_guideline: "AI 陪伴同步策略",
    
    // Global
    loading: "解析中...",
    lang_toggle: "EN / ZH",
  }
};

const I18nContext = createContext<{ lang: Language; toggleLang: () => void; t: (key: keyof typeof translations['en']) => string }>({
  lang: 'zh',
  toggleLang: () => {},
  t: (key) => key,
});

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>('zh');

  const toggleLang = () => {
    setLang(l => l === 'en' ? 'zh' : 'en');
  };

  const t = (key: keyof typeof translations['en']) => {
    return translations[lang][key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => useContext(I18nContext);
