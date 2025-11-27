import React, { useState } from 'react';
import { AppStep, DraftState, ResearchAngle, ArticleStyle, GroundingSource } from './types';
import { researchTopicAngles, generateOutline, generateFullArticle } from './services/geminiService';
import StepInput from './components/StepInput';
import StepResearch from './components/StepResearch';
import StepOutline from './components/StepOutline';
import StepStyle from './components/StepStyle';
import StepResult from './components/StepResult';
import Loading from './components/Loading'; // Import new Loading component
import { PenTool } from 'lucide-react';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.INPUT_TOPIC);
  const [isLoading, setIsLoading] = useState(false);
  const [researchAngles, setResearchAngles] = useState<ResearchAngle[]>([]);
  
  const [draft, setDraft] = useState<DraftState>({
    topic: '',
    targetAudience: '',
    selectedAngle: null,
    outline: '',
    style: null,
    customStyleLinks: '',
    finalContent: '',
    researchSources: [],
    articleSources: []
  });

  const handleTopicSubmit = async (topic: string, audience: string) => {
    setIsLoading(true);
    setDraft(prev => ({ ...prev, topic, targetAudience: audience }));
    try {
      const { angles, sources } = await researchTopicAngles(topic, audience);
      setResearchAngles(angles);
      setDraft(prev => ({ ...prev, researchSources: sources }));
      setCurrentStep(AppStep.RESEARCH);
    } catch (error) {
      alert("调研主题失败，请重试。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAngleSelect = async (angle: ResearchAngle) => {
    setIsLoading(true);
    setDraft(prev => ({ ...prev, selectedAngle: angle }));
    try {
      const outline = await generateOutline(draft.topic, draft.targetAudience, angle.title, angle.description);
      setDraft(prev => ({ ...prev, outline, selectedAngle: angle }));
      setCurrentStep(AppStep.OUTLINE);
    } catch (error) {
      alert("生成大纲失败。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOutlineConfirm = (updatedOutline: string) => {
    setDraft(prev => ({ ...prev, outline: updatedOutline }));
    setCurrentStep(AppStep.STYLE);
  };

  const handleStyleSelect = async (style: ArticleStyle, customLinks: string) => {
    setIsLoading(true);
    setDraft(prev => ({ ...prev, style, customStyleLinks: customLinks }));
    try {
      const { text, sources } = await generateFullArticle(
        draft.topic, 
        draft.targetAudience, 
        draft.outline, 
        style,
        customLinks
      );
      setDraft(prev => ({ ...prev, finalContent: text, articleSources: sources, style, customStyleLinks: customLinks }));
      setCurrentStep(AppStep.RESULT);
    } catch (error) {
      alert("生成文章失败。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setDraft({
      topic: '',
      targetAudience: '',
      selectedAngle: null,
      outline: '',
      style: null,
      customStyleLinks: '',
      finalContent: '',
      researchSources: [],
      articleSources: []
    });
    setResearchAngles([]);
    setCurrentStep(AppStep.INPUT_TOPIC);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 relative">
      
      {/* Global Loading Overlay */}
      {isLoading && <Loading />}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2" onClick={handleRestart} role="button">
            <div className="bg-indigo-600 p-2 rounded-lg">
               <PenTool className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">CopyCraft AI</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <span className={currentStep === AppStep.INPUT_TOPIC ? 'text-indigo-600' : ''}>1. 主题</span>
            <span className={currentStep === AppStep.RESEARCH ? 'text-indigo-600' : ''}>2. 标题</span>
            <span className={currentStep === AppStep.OUTLINE ? 'text-indigo-600' : ''}>3. 大纲</span>
            <span className={currentStep === AppStep.STYLE ? 'text-indigo-600' : ''}>4. 风格</span>
            <span className={currentStep === AppStep.RESULT ? 'text-indigo-600' : ''}>5. 成文</span>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-12">
        <div className="max-w-7xl mx-auto h-full">
          {currentStep === AppStep.INPUT_TOPIC && (
            <StepInput onNext={handleTopicSubmit} isLoading={isLoading} />
          )}
          
          {currentStep === AppStep.RESEARCH && (
            <StepResearch 
              topic={draft.topic} 
              angles={researchAngles} 
              sources={draft.researchSources}
              onSelect={handleAngleSelect}
              isLoading={isLoading}
            />
          )}

          {currentStep === AppStep.OUTLINE && (
            <StepOutline
              initialOutline={draft.outline}
              onNext={handleOutlineConfirm}
              onBack={() => setCurrentStep(AppStep.RESEARCH)}
              isLoading={isLoading}
            />
          )}

          {currentStep === AppStep.STYLE && (
            <StepStyle 
              onSelect={handleStyleSelect}
              onBack={() => setCurrentStep(AppStep.OUTLINE)}
              isLoading={isLoading}
            />
          )}

          {currentStep === AppStep.RESULT && (
            <StepResult 
              content={draft.finalContent} 
              sources={draft.articleSources}
              onRestart={handleRestart}
            />
          )}
        </div>
      </main>
      
      {/* Simple Footer */}
      <footer className="border-t border-slate-200 py-6 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} CopyCraft AI. 由 Google Gemini 驱动。</p>
      </footer>
    </div>
  );
};

export default App;