import { GoogleGenAI, Tool } from "@google/genai";
import { GroundingSource, GroundingMetadata, ArticleStyle } from "../types";

const API_KEY = process.env.API_KEY || '';

// Helper to create AI instance
const getAI = () => new GoogleGenAI({ apiKey: API_KEY });

// Helper to extract sources from grounding metadata
const extractSources = (metadata?: GroundingMetadata): GroundingSource[] => {
  if (!metadata || !metadata.groundingChunks) return [];
  
  const sources: GroundingSource[] = [];
  metadata.groundingChunks.forEach(chunk => {
    if (chunk.web && chunk.web.uri && chunk.web.title) {
      sources.push({
        title: chunk.web.title,
        uri: chunk.web.uri
      });
    }
  });
  
  // Deduplicate sources by URI
  const uniqueSources = new Map();
  sources.forEach(s => uniqueSources.set(s.uri, s));
  return Array.from(uniqueSources.values());
};

/**
 * Step 1 & 2: Analyze topic and research content angles
 */
export const researchTopicAngles = async (topic: string, audience: string) => {
  const ai = getAI();
  
  const prompt = `
    你是一位深谙新媒体爆款逻辑的中文内容专家。用户想写一篇软文。
    
    主题：${topic}
    目标受众：${audience}
    
    任务：
    1. 重点搜索 **微信公众号、小红书** 等平台关于该主题针对该人群的最新热门内容。
    2. 提供 **10个** 极具吸引力、且 **“干货感”** 十足的标题供用户选择。
    
    **标题要求：**
    - **极度实用（干货）**：让用户一眼觉得“这对我很有用”、“省了好多时间”。
    - **拒绝标题党**：虽然要吸引人，但不能空洞。必须暗示文章包含具体的方法、清单、避坑指南或深度盘点。
    - **参考风格**：
      - “2024日本留学全流程SOP！含费用+材料清单，建议收藏”
      - “千万别乱报！日语N1备考的5个真相，学姐血泪教训”
      - “职场人转行必看：30岁后留学值不值？真实数据告诉你”
    
    输出格式必须严格如下（纯文本，不要Markdown代码块）：
    
    ###
    Title: [标题1]
    Description: [简短说明这个标题的核心价值点]
    ###
    Title: [标题2]
    Description: [说明]
    ...以此类推10个。
  `;

  const tools: Tool[] = [{ googleSearch: {} }];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: tools,
        systemInstruction: "You are a creative content strategist. Generate 10 high-value, practical headlines."
      }
    });

    const text = response.text || "";
    const sources = extractSources(response.candidates?.[0]?.groundingMetadata as GroundingMetadata);
    
    const angles = [];
    const parts = text.split('###').filter(p => p.trim().length > 0);
    
    for (const part of parts) {
      const titleMatch = part.match(/Title:\s*(.+)/);
      const descMatch = part.match(/Description:\s*(.+)/);
      
      if (titleMatch && descMatch) {
        angles.push({
          id: Math.random().toString(36).substring(7),
          title: titleMatch[1].trim(),
          description: descMatch[1].trim()
        });
      }
    }

    // Limit to 10 just in case
    const finalAngles = angles.slice(0, 10);

    return { angles: finalAngles, sources };

  } catch (error) {
    console.error("Error researching topic:", error);
    throw error;
  }
};

/**
 * Step 3: Generate Outline
 */
export const generateOutline = async (topic: string, audience: string, angleTitle: string, angleDesc: string) => {
  const ai = getAI();
  
  const prompt = `
    主题: ${topic}
    目标受众: ${audience}
    选定标题: ${angleTitle}
    策略方向: ${angleDesc}

    请基于以上标题，生成一份详尽、逻辑严密的中文软文大纲。
    
    要求：
    - 大纲必须紧扣“${angleTitle}”这个标题的承诺。
    - **必须针对 ${audience} 的需求**。
    - 在适当的章节，**标注建议插入表格（Table）或引用官方数据图片的位置**。
    - 结构清晰，包含引言、核心干货段落（3-5点）、结语。
    
    请使用清晰的 Markdown 格式输出中文大纲。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "无法生成大纲。";
  } catch (error) {
    console.error("Error generating outline:", error);
    throw error;
  }
};

/**
 * Step 4: Generate Full Article
 */
export const generateFullArticle = async (
  topic: string, 
  audience: string,
  outline: string, 
  style: ArticleStyle,
  customStyleLinks: string
) => {
  const ai = getAI();
  
  let stylePrompt = "";
  
  // Only add preset style if it's not custom/unknown or if user explicitly selected one
  if (style && style !== ArticleStyle.CUSTOM) {
      stylePrompt = `风格要求: ${style}`;
  } else {
      stylePrompt = `风格要求: 请根据下方提供的参考链接进行模仿。`;
  }

  if (customStyleLinks && customStyleLinks.trim()) {
    stylePrompt += `
    \n**重要：用户提供了参考风格链接/账号：**
    ${customStyleLinks}
    
    请利用 Google Search 工具分析这些链接中的内容风格、语气、排版习惯。
    **请务必模仿这些参考链接的行文风格来撰写本文。**
    `;
  }

  const prompt = `
    你是一位资深的中文内容创作者。请撰写一篇高质量的深度文章。
    
    基本信息：
    - 主题: ${topic}
    - 目标受众: ${audience}
    - ${stylePrompt}
    
    已确认大纲:
    ${outline}
    
    **核心撰写要求（务必遵守）**:
    1. **极度实用的干货感**: 
       - 既然标题是干货，内容就必须“硬”。
       - 多给具体步骤、具体数据、具体建议。
       - 拒绝正确的废话。
    2. **拒绝硬广/过度营销**: 
       - 行文必须真实、客观、专业。
       - **严禁使用过多的感叹号（!）**。
       - 语气要平实、真诚，像老朋友分享经验。
    3. **数据可视化**: 凡是涉及对比、参数、流程、费用等信息，**必须使用 Markdown 表格**进行展示。
    4. **引用权威**: 必须在文中引用真实数据或行业报告。
    5. **图片/配图建议**: 
       - 在文章适当位置，必须插入配图建议。
       - 格式要求：使用引言块 (Markdown > ) 并在其中写明 "【配图建议】：XXX画面..."。
    6. **查证**: 使用 Google Search 验证数据准确性。
    7. **篇幅**: 1000-1800 字，内容充实。

    现在开始撰写。
  `;

  const tools: Tool[] = [{ googleSearch: {} }];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: prompt,
      config: {
        tools: tools,
      }
    });

    const text = response.text || "";
    const sources = extractSources(response.candidates?.[0]?.groundingMetadata as GroundingMetadata);

    return { text, sources };
  } catch (error) {
    console.error("Error generating article:", error);
    throw error;
  }
};