import React, { useState } from 'react';
import { ResearchAngle, GroundingSource } from '../types';
import { ExternalLink, Sparkles, ArrowRight, Globe, CheckCircle2 } from 'lucide-react';

interface Props {
  topic: string;
  angles: ResearchAngle[];
  sources: GroundingSource[];
  onSelect: (angle: ResearchAngle) => void;
  isLoading: boolean;
}

const StepResearch: React.FC<Props> = ({ topic, angles, sources, onSelect, isLoading }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (angle: ResearchAngle) => {
    setSelectedId(angle.id);
    // Slight delay to show selection effect before moving next
    setTimeout(() => {
        onSelect(angle);
    }, 300);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">选择标题</h2>
        <p className="text-slate-600">
          为您生成了10个高价值的“干货”标题，请选择一个作为文章主题。
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        
        {/* Main List */}
        <div className="flex-grow space-y-3">
            {angles.map((angle, index) => {
            const isSelected = selectedId === angle.id;
            return (
                <button
                key={angle.id}
                onClick={() => handleSelect(angle)}
                disabled={isLoading}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group relative overflow-hidden ${
                    isSelected 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg transform scale-[1.01]' 
                    : 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-md'
                }`}
                >
                <div className="flex items-start gap-4">
                    <span className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                    }`}>
                        {index + 1}
                    </span>
                    <div className="flex-grow">
                        <h3 className={`text-lg font-bold mb-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                            {angle.title}
                        </h3>
                        <p className={`text-sm ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                            {angle.description}
                        </p>
                    </div>
                    <div className={`self-center ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                        {isSelected ? <CheckCircle2 className="w-6 h-6 text-white" /> : <ArrowRight className="w-5 h-5 text-indigo-500" />}
                    </div>
                </div>
                </button>
            );
            })}
        </div>

        {/* Sidebar Sources */}
        <div className="md:w-80 flex-shrink-0">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 sticky top-6">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4">
                    <Globe className="w-4 h-4 text-indigo-600" />
                    信息来源参考
                </div>
                {sources.length > 0 ? (
                <div className="space-y-3">
                    {sources.slice(0, 8).map((source, idx) => (
                        <a 
                        key={idx}
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-2 rounded-lg bg-white border border-slate-100 hover:border-indigo-300 transition-colors text-xs text-slate-600 hover:text-indigo-700 leading-snug"
                        >
                        <div className="flex items-start gap-2">
                            <ExternalLink className="w-3 h-3 flex-shrink-0 mt-0.5 opacity-50" />
                            <span className="line-clamp-2">{source.title}</span>
                        </div>
                        </a>
                    ))}
                    {sources.length > 8 && (
                        <p className="text-xs text-center text-slate-400 mt-2">...以及更多全网数据</p>
                    )}
                </div>
                ) : (
                <div className="flex flex-col items-center justify-center py-8 text-slate-400 text-sm">
                    <div className="animate-pulse flex space-x-2 mb-2">
                        <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                        <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                        <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                    </div>
                    分析全网数据中...
                </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default StepResearch;