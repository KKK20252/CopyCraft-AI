import React, { useState } from 'react';
import { ArrowRight, Search, Users } from 'lucide-react';

interface Props {
  onNext: (topic: string, audience: string) => void;
  isLoading: boolean;
}

const StepInput: React.FC<Props> = ({ onNext, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && audience.trim()) {
      onNext(topic, audience);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="w-full max-w-2xl text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            您想写什么主题的软文？
          </h1>
          <p className="text-lg text-slate-600">
            AI 将根据您的目标受众，研究市场趋势并撰写专业内容。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 max-w-xl mx-auto space-y-4">
          
          {/* Topic Input */}
          <div className="relative group text-left">
            <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">主题方向</label>
            <div className="relative flex items-center bg-white rounded-lg shadow-sm ring-1 ring-slate-900/10 focus-within:ring-2 focus-within:ring-indigo-600">
              <div className="pl-4 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                className="w-full p-3 pl-3 text-base bg-transparent border-0 focus:ring-0 text-slate-900 placeholder:text-slate-400 focus:outline-none"
                placeholder="例如：日本留学、JLPT备考技巧..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={isLoading}
                autoFocus
              />
            </div>
          </div>

          {/* Audience Input */}
          <div className="relative group text-left">
            <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">面向用户（目标受众）</label>
            <div className="relative flex items-center bg-white rounded-lg shadow-sm ring-1 ring-slate-900/10 focus-within:ring-2 focus-within:ring-indigo-600">
              <div className="pl-4 text-slate-400">
                <Users className="w-5 h-5" />
              </div>
              <input
                type="text"
                className="w-full p-3 pl-3 text-base bg-transparent border-0 focus:ring-0 text-slate-900 placeholder:text-slate-400 focus:outline-none"
                placeholder="例如：高中生家长、职场白领、零基础日语爱好者..."
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!topic.trim() || !audience.trim() || isLoading}
            className="w-full mt-4 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
          >
            {isLoading ? '分析中...' : '开始调研'}
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="mt-8 flex flex-wrap justify-center gap-2 text-sm text-slate-500">
          <span>热门组合：</span>
          <button onClick={() => {setTopic('日本旅游攻略'); setAudience('亲子游家庭');}} className="hover:text-indigo-600 underline decoration-dotted">日本旅游 + 亲子家庭</button>
          <button onClick={() => {setTopic('日语 N1 备考'); setAudience('大三/大四学生');}} className="hover:text-indigo-600 underline decoration-dotted">JLPT + 大学生</button>
          <button onClick={() => {setTopic('职业转型'); setAudience('30岁职场人');}} className="hover:text-indigo-600 underline decoration-dotted">职业转型 + 职场人</button>
        </div>
      </div>
    </div>
  );
};

export default StepInput;