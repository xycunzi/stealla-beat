import { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import { GoogleGenAI } from '@google/genai';

export type AIProviderName = 'gemini' | 'doubao';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AIContextProps {
  provider: AIProviderName;
  setProvider: (name: AIProviderName) => void;
  generateText: (prompt: string, systemInstruction?: string) => Promise<string | null>;
  // Student Diary specific state
  messages: ChatMessage[];
  sendMessage: (content: string) => Promise<void>;
  isTyping: boolean;
  intensity: number;
  vortexColor: string;
}

const AIContext = createContext<AIContextProps>({} as AIContextProps);

export function useAI() {
  return useContext(AIContext);
}

// Keep backward compatibility for imports
export function useGemini() {
  return useAI();
}

const geminiClient = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY });

export const AIProvider = ({ children }: { children: ReactNode }) => {
  const [provider, setProvider] = useState<AIProviderName>('gemini');
  
  // Student Diary State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [intensity, setIntensity] = useState(0.5); 
  const [vortexColor, setVortexColor] = useState('#00f0ff'); 

  // Generic text generation for Teacher and Parent views
  const generateText = async (prompt: string, systemInstruction?: string): Promise<string | null> => {
    try {
      if (provider === 'doubao') {
        const apiKey = import.meta.env.VITE_DOUBAO_API_KEY;
        const modelEp = import.meta.env.VITE_DOUBAO_MODEL_EP || 'ep-20240521xxx-xxx'; // Fallback mockup
        if (!apiKey) {
           return "[DOUBAO_API_KEY_MISSING] Please configure VITE_DOUBAO_API_KEY in .env. Falling back to Gemini format... (Error: Connect Volcengine failed)";
        }
        
        const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: modelEp,
            messages: [
              ...(systemInstruction ? [{ role: 'system', content: systemInstruction }] : []),
              { role: 'user', content: prompt }
            ]
          })
        });
        
        if (!res.ok) throw new Error(`Doubao API Error: ${res.statusText}`);
        const data = await res.json();
        return data.choices[0]?.message?.content || null;
      } else {
        // Default to Gemini 2.5
        const fullPrompt = systemInstruction ? `${systemInstruction}\n\n${prompt}` : prompt;
        const response = await geminiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: fullPrompt,
        });
        return response.text || null;
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const systemInstruction = `
You are the High-Dimensional Guide AI for the "Stellar Beat" app.
Your role is to help teenagers (the "Pilots") clear their "consciousness energy vortices" (emotions and obsessions).
Tone: Calm, futuristic, objective, empathetic, slightly sci-fi but very accessible.
Use terms like "energy field", "obsession vortex", "high-dimensional perspective", "frequency".
If the user expresses negative emotions, validate them, but remind them that emotions are just temporary energy fluctuations in their 3D physical container.

When responding, ALWAYS end your response with a JSON block in this exact format:
\`\`\`json
{
  "obsession_intensity": 0.8,
  "vortex_color": "#ff3333" 
}
\`\`\`
- obsession_intensity: A float from 0.0 to 1.0 (1.0 = high stress/anger/sadness, 0.0 = calm/peaceful).
- vortex_color: A hex color representing the energy state (e.g. #ff3333 for high stress, #00f0ff for normal/electric blue, #39ff14 for growth/healing green, #ffbe0b for value/gold).

Keep the conversational part concise (2-3 short sentences).
  `;

  const sendMessage = useCallback(async (content: string) => {
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const historyText = messages.map(m => `${m.role}: ${m.content}`).join('\n');
      const prompt = `History:\n${historyText}\n\nuser: ${content}\nassistant:`;
      
      const responseText = await generateText(prompt, systemInstruction);
      
      if (responseText) {
        // Extract JSON part
        const jsonMatch = responseText.match(/\n?\s*```json\n([\s\S]*?)\n```/);
        let cleanText = responseText;
        let pIntensity = intensity;
        let pColor = vortexColor;

        if (jsonMatch && jsonMatch[1]) {
          try {
            const data = JSON.parse(jsonMatch[1]);
            pIntensity = data.obsession_intensity || pIntensity;
            pColor = data.vortex_color || pColor;
            cleanText = responseText.replace(/\n?\s*```json\n[\s\S]*?\n```/, '').trim();
          } catch (e) {
            console.error("Failed to parse JSON from AI", e);
          }
        }

        setIntensity(pIntensity);
        setVortexColor(pColor);

        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: cleanText
        }]);
      }
    } catch (error) {
      console.error('Error talking to AI:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Comm-link disrupted. Please recalibrate your signal and try again.'
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, intensity, vortexColor, provider]);

  return (
    <AIContext.Provider value={{
      provider, setProvider, generateText,
      messages, sendMessage, isTyping, intensity, vortexColor
    }}>
      {children}
    </AIContext.Provider>
  );
};
