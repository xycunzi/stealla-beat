import { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini with API key from environment
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function useGemini() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [intensity, setIntensity] = useState(0.5); // Emotion intensity 0-1
  const [vortexColor, setVortexColor] = useState('#00f0ff'); 

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
      // Build conversation history format expected by the model
      // We will just use ai.models.generateContent with system instruction and history string for simplicity
      const historyText = messages.map(m => `${m.role}: ${m.content}`).join('\n');
      const prompt = `${systemInstruction}\n\nHistory:\n${historyText}\n\nuser: ${content}\nassistant:`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const responseText = response.text;
      
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
      console.error('Error talking to Gemini:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Comm-link disrupted. Please recalibrate your signal and try again.'
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, intensity, vortexColor, systemInstruction]);

  return { messages, sendMessage, isTyping, intensity, vortexColor };
}
