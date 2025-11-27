export enum AppStep {
  INPUT_TOPIC = 0,
  RESEARCH = 1,
  OUTLINE = 2,
  STYLE = 3,
  RESULT = 4
}

export interface ResearchAngle {
  id: string;
  title: string;
  description: string;
}

export enum ArticleStyle {
  SENIOR = "学姐/学长分享 (Senior Student)",
  EXPERT = "行业专家 (Industry Expert)",
  OFFICIAL = "官方严谨 (Official/Formal)",
  NEIGHBOR = "邻家朋友 (Neighborly/Casual)",
  STORYTELLING = "故事叙述 (Storytelling)",
  CUSTOM = "自定义/参考链接 (Custom Based on Links)"
}

export interface DraftState {
  topic: string;
  targetAudience: string;
  selectedAngle: ResearchAngle | null;
  outline: string;
  style: ArticleStyle | null;
  customStyleLinks: string; // Added field for reference links
  finalContent: string;
  researchSources: GroundingSource[];
  articleSources: GroundingSource[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}

// Maps to Gemini response structure for grounding
export interface GroundingMetadata {
  groundingChunks?: Array<{
    web?: {
      uri?: string;
      title?: string;
    };
  }>;
}