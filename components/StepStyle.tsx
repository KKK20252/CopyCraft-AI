import React, { useState } from 'react';
import { ArticleStyle } from '../types';
import { UserCheck, BookOpen, Building2, Coffee, Feather, Link as LinkIcon, Sparkles } from 'lucide-react';

interface Props {
  onSelect: (style: ArticleStyle, customLinks: string) => void;
  onBack: () => void;
  isLoading: boolean;
}

const StepStyle: React.FC<Props> = ({ onSelect, onBack, isLoading }) => {
  const [customLinks, setCustomLinks] = useState('');
  const [selectedStyleId, setSelectedStyleId] = useState<ArticleStyle | null>(null);
  
  const styles = [
    {
      id: ArticleStyle.SENIOR,
      label: "学姐/学长分享",
      desc: "亲切、经验之谈、使用第一人称，口语化且实用。",
      icon: UserCheck,
      color: "bg-orange-50 text-orange-600"
    },
    {
      id: ArticleStyle.EXPERT,
      label: "行业专家",
      desc: "权威、注重数据、使用专业术语、深度分析。",
      icon: BookOpen,
      color: "bg-blue-50 text-blue-600"
    },
    {
      id: ArticleStyle.OFFICIAL,
      label: "官方严谨",
      desc: "客观、中立、结构非常严谨，适合新闻稿。",
      icon: Building2,
      color: "bg-slate-100 text-slate-600"
    },
    {
      id: ArticleStyle.NEIGHBOR,
      label: "邻家朋友",
      desc: "友好、温暖、对话式、易读，注重情感连接。",
      icon: Coffee,
      color: "bg-green-50 text-green-600"
    },
    {
      id: ArticleStyle.STORYTELLING,
      label: "故事叙述",
      desc: "以叙事为驱动，通过特定场景或旅程吸引读者。",
      icon: Feather,
      color: "bg-purple-50 text-purple-600"
    }
  ];

  const handleGenerate = () => {
    // If no preset selected but links exist, use CUSTOM. Otherwise use selected.
    // If neither (validated by disabled button), this won't fire.
    const finalStyle = selectedStyleId || ArticleStyle.CUSTOM;
    onSelect(finalStyle, customLinks);
  };

  const isReady = selectedStyleId !== null || customLinks.trim().length > 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12 flex flex-col h-full">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">定调风格</h2>
        <p className="text-slate-600">选择预设风格，或者直接粘贴参考链接让我们模仿。</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 flex-grow">
        {/* Left: Presets */}
        <div className="space-y-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs">A</span>
                选择预设风格 (可选)
            </h3>
            <div className="grid gap-3">
                {styles.map((s) => (
                <button
                    key={s.id}
                    onClick={() => setSelectedStyleId(selectedStyleId === s.id ? null : s.id)}
                    disabled={isLoading}
                    className={`group relative flex items-center text-left p-4 border rounded-xl transition-all duration-200 ${
                        selectedStyleId === s.id 
                        ? 'bg-indigo-50 border-indigo-500 shadow-md ring-1 ring-indigo-500' 
                        : 'bg-white border-slate-200 hover:border-indigo-300'
                    }`}
                >
                    <div className={`p-3 rounded-lg mr-4 transition-transform ${selectedStyleId === s.id ? 'scale-110' : ''} ${s.color}`}>
                        <s.icon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className={`text-base font-bold ${selectedStyleId === s.id ? 'text-indigo-900' : 'text-slate-900'}`}>{s.label}</h3>
                        <p className="text-xs text-slate-500">{s.desc}</p>
                    </div>
                    {selectedStyleId === s.id && (
                        <div className="absolute top-3 right-3 w-3 h-3 bg-indigo-500 rounded-full"></div>
                    )}
                </button>
                ))}
            </div>
        </div>

        {/* Right: Custom Links */}
        <div className="space-y-4">
             <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs">B</span>
                模仿特定账号/文章 (可选)
            </h3>
            <div className={`bg-white border rounded-2xl p-6 shadow-sm h-full flex flex-col transition-colors ${customLinks.trim() ? 'border-indigo-400' : 'border-slate-200'}`}>
                <div className="flex items-center gap-2 mb-4 text-indigo-600">
                    <LinkIcon className="w-5 h-5" />
                    <span className="font-medium">参考链接</span>
                </div>
                <p className="text-sm text-slate-500 mb-4">
                    粘贴您想模仿的公众号、小红书或知乎文章链接。AI 将自动提取其行文逻辑和语气。
                </p>
                <textarea
                    value={customLinks}
                    onChange={(e) => setCustomLinks(e.target.value)}
                    placeholder="例如：
https://mp.weixin.qq.com/s/...
https://www.xiaohongshu.com/explore/..."
                    className="flex-grow w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm resize-none mb-4 font-mono leading-relaxed"
                />
                <div className="bg-indigo-50 text-indigo-700 text-xs p-3 rounded-lg">
                    提示：如果您不选择左侧风格，我们将完全依据您提供的链接进行创作。
                </div>
            </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 pt-6">
        <button 
          onClick={onBack}
          disabled={isLoading}
          className="text-slate-500 hover:text-slate-800 font-medium px-6 py-2 transition-colors"
        >
          返回大纲
        </button>
        
        <button
          onClick={handleGenerate}
          disabled={isLoading || !isReady}
          className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 shadow-lg transition-all transform ${
            isReady 
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white hover:-translate-y-1 hover:shadow-indigo-200' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          {isLoading ? '生成中...' : '开始生成文章'}
        </button>
      </div>
    </div>
  );
};

export default StepStyle;