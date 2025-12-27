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

// Helper function to wait
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getVerdict = async (data: CaseData): Promise<string> => {
  const ai = getClient();
  // 使用 Flash 模型，配额更高，不易报错
  const modelName = 'gemini-3-flash-preview'; 

  const userPrompt = `
      情侣吵架案件详情：
      
      【🐶 汪汪队 A (委屈方) 陈述】:
      ${data.complaintA}
      
      【🐱 汪汪队 B (委屈方) 陈述】:
      ${data.complaintB}
      
      请阿汪大法官给出判决！
    `;

  let lastError: any;
  const MAX_RETRIES = 3;

  // 自动重试循环
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`🤖 Calling Gemini API (${modelName})... Attempt ${attempt + 1}/${MAX_RETRIES + 1}`);
      
      const response = await ai.models.generateContent({
        model: modelName, 
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
      lastError = error;
      console.warn(`⚠️ Attempt ${attempt + 1} failed:`, error.message);

      const errorMsg = error.message || "";
      // 检测是否为配额不足 (429) 或 服务器过载 (503)
      const isQuotaError = errorMsg.includes("429") || errorMsg.includes("quota") || errorMsg.includes("RESOURCE_EXHAUSTED");
      const isServerOverload = errorMsg.includes("503") || errorMsg.includes("overloaded");

      // 如果是配额问题，等待几秒后重试
      if ((isQuotaError || isServerOverload) && attempt < MAX_RETRIES) {
        const waitTime = 2000 * Math.pow(2, attempt); // 指数退避: 2秒, 4秒, 8秒
        console.log(`⏳ Quota hit. Waiting ${waitTime}ms before retry...`);
        await delay(waitTime);
        continue;
      }
      
      // 其他错误直接跳出
      break;
    }
  }

  // 如果重试多次后依然失败
  console.error("🔥 Gemini Service Final Failure:", lastError);
  
  const errorMsg = lastError?.message || "";
  
  if (errorMsg.includes("API Key")) {
    throw new Error("系统配置错误：缺少 API Key");
  }
  
  if (errorMsg.includes("429") || errorMsg.includes("quota")) {
    throw new Error("阿汪法官太累了 (API Quota Exceeded)。即便重试后依然繁忙，请稍后再试。");
  }

  throw new Error("阿汪法官暂时无法连接到法庭网络，请重试。");
};