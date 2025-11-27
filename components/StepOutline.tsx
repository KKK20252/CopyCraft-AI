import React, { useState, useEffect } from 'react';
import { ArrowRight, Edit3, Eye, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Props {
  initialOutline: string;
  onNext: (outline: string) => void;
  onBack: () => void;
  isLoading: boolean;
}

const StepOutline: React.FC<Props> = ({ initialOutline, onNext, onBack, isLoading }) => {
  const [outline, setOutline] = useState(initialOutline);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    if (initialOutline && !outline) setOutline(initialOutline);
  }, [initialOutline]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in h-[calc(100vh-140px)] flex flex-col">
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">审核大纲</h2>
          <p className="text-slate-500 text-sm">请确认文章结构。您可以切换预览模式查看效果。</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onBack}
            className="px-4 py-2 text-slate-600 hover:text-slate-900 text-sm font-medium"
          >
            返回
          </button>
          <button 
            onClick={() => onNext(outline)}
            disabled={isLoading || !outline.trim()}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {isLoading ? '生成中...' : '下一步：选择风格'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col border border-slate-200 rounded-xl shadow-sm overflow-hidden bg-white">
        {/* Toolbar */}
        <div className="bg-slate-50 border-b border-slate-200 p-2 flex items-center gap-1 px-4 flex-shrink-0">
          <button
            onClick={() => setMode('edit')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              mode === 'edit' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            编辑模式
          </button>
          <button
            onClick={() => setMode('preview')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              mode === 'preview' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Eye className="w-4 h-4" />
            预览效果
          </button>
        </div>

        {/* Content Area */}
        <div className="relative flex-grow overflow-hidden">
          {mode === 'edit' ? (
            <textarea
              value={outline}
              onChange={(e) => setOutline(e.target.value)}
              className="w-full h-full p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed text-slate-800 bg-white overflow-y-auto"
              placeholder="正在生成大纲..."
            />
          ) : (
            <div className="w-full h-full p-8 overflow-y-auto prose prose-slate prose-sm max-w-none bg-slate-50/50">
              <ReactMarkdown>{outline}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-shrink-0 bg-blue-50 text-blue-800 p-4 rounded-lg text-sm border border-blue-100 flex items-start gap-3">
        <FileText className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <strong>提示：</strong> 您可以在此处调整章节顺序。建议保留对“表格”或“图片引用”的描述，AI会在下一步自动生成对应内容。
        </div>
      </div>
    </div>
  );
};

export default StepOutline;