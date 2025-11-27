import React, { useEffect, useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';

const messages = [
  "正在分析您的写作需求...",
  "正在搜集微信公众号、小红书的热门数据...",
  "正在构建文章逻辑框架...",
  "正在模仿目标风格进行撰写...",
  "正在优化排版和阅读体验...",
  "即将完成，请稍候..."
];

const Loading: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev < messages.length - 1 ? prev + 1 : prev));
    }, 2500); // Change message every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-indigo-100 max-w-md w-full text-center space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-75 blur-md"></div>
          <div className="relative bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-indigo-200">
             <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900">AI 正在创作中</h3>
          <div className="h-6 overflow-hidden">
             <p className="text-slate-500 text-sm animate-pulse transition-all duration-500">
               {messages[msgIndex]}
             </p>
          </div>
        </div>

        <div className="flex justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <div 
              key={i} 
              className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" 
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;