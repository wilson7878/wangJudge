import { GoogleGenAI } from "@google/genai";
import { CaseData } from "../types";
import { JUDGE_SYSTEM_PROMPT } from "../constants";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const getVerdict = async (data: CaseData): Promise<string> => {
  try {
    const ai = getClient();
    
    // Construct the user prompt
    const userPrompt = `
      情侣吵架案件详情：
      
      【🐶 汪汪队 A (委屈方) 陈述】:
      ${data.complaintA}
      
      【🐱 汪汪队 B (委屈方) 陈述】:
      ${data.complaintB}
      
      请阿汪大法官给出判决！
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: JUDGE_SYSTEM_PROMPT,
        temperature: 0.7, // A bit of creativity for humor
      },
    });

    return response.text || "阿汪睡着了，请稍后再试... (API Error)";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("阿汪法官暂时无法连接到法庭网络。");
  }
};