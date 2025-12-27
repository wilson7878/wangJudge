import { GoogleGenAI } from "@google/genai";
import { CaseData } from "../types";
import { JUDGE_SYSTEM_PROMPT } from "../constants";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.error("❌ CRITICAL ERROR: process.env.API_KEY is missing or undefined.");
    throw new Error("API Key configuration missing");
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

    console.log("🤖 Calling Gemini API...");
    // Switch to gemini-2.5-flash for better stability and rate limits compared to preview models
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: userPrompt,
      config: {
        systemInstruction: JUDGE_SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    if (!response.text) {
      throw new Error("Gemini response was empty");
    }

    return response.text;
  } catch (error: any) {
    console.error("🔥 Gemini Service Error Details:", {
      message: error.message,
      stack: error.stack,
      code: error.code || error.status // Log error code if available
    });
    
    // Handle specific error cases
    const errorMsg = error.message || "";
    
    if (errorMsg.includes("API Key")) {
      throw new Error("系统配置错误：缺少 API Key");
    }
    
    if (errorMsg.includes("429") || errorMsg.includes("quota") || errorMsg.includes("RESOURCE_EXHAUSTED")) {
      throw new Error("阿汪法官太累了 (API Quota Exceeded)。请休息一会再试，或检查您的 API 配额。");
    }
    
    if (errorMsg.includes("503") || errorMsg.includes("overloaded")) {
      throw new Error("法庭服务器繁忙，请稍后重试。");
    }

    throw new Error("阿汪法官暂时无法连接到法庭网络，请重试。");
  }
};