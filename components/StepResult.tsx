import React from 'react';
import ReactMarkdown from 'react-markdown';
import { GroundingSource } from '../types';
import { Copy, RefreshCw, CheckCircle, ExternalLink, Download, FileText, ImageIcon } from 'lucide-react';

interface Props {
  content: string;
  sources: GroundingSource[];
  onRestart: () => void;
}

const StepResult: React.FC<Props> = ({ content, sources, onRestart }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadWord = () => {
    const preHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Article Export</title>
        <style>
          body { font-family: 'Calibri', sans-serif; line-height: 1.6; color: #1a1a1a; }
          h1 { font-size: 24pt; font-weight: bold; color: #111; margin-bottom: 12pt; }
          h2 { font-size: 18pt; font-weight: bold; color: #333; margin-top: 18pt; margin-bottom: 9pt; }
          h3 { font-size: 14pt; font-weight: bold; color: #444; margin-top: 12pt; margin-bottom: 6pt; }
          p { font-size: 11pt; margin-bottom: 10pt; text-align: justify; }
          ul { margin-bottom: 10pt; }
          li { margin-bottom: 5pt; }
          table { border-collapse: collapse; width: 100%; margin: 15pt 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 10pt; }
          th { background-color: #f8f9fa; font-weight: bold; }
          blockquote { 
            border: 1px dashed #6366f1; 
            background-color: #eef2ff; 
            padding: 10px; 
            margin: 15px 0; 
            color: #4338ca;
            font-style: italic;
          }
        </style>
      </head><body>
    `;
    const postHtml = "</body></html>";
    
    // Convert markdown text to HTML logic remains extracting from DOM for WYSIWYG results
    const articleElement = document.getElementById('article-content');
    const articleHtml = articleElement ? articleElement.innerHTML : content;

    const html = preHtml + articleHtml + postHtml;

    const blob = new Blob(['\ufeff', html], {
        type: 'application/msword'
    });
    
    const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
    
    const downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);

    const nav = navigator as any;
    if (nav.msSaveOrOpenBlob) {
        nav.msSaveOrOpenBlob(blob, 'article.doc');
    } else {
        downloadLink.href = url;
        downloadLink.download = 'generated_article.doc';
        downloadLink.click();
    }
    
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">预览文章</h2>
          <p className="text-slate-500 mt-1">AI 已完成创作。下方为预览模式。</p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={onRestart}
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            重写
          </button>
          
          <button
            onClick={handleDownloadWord}
            className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-medium flex items-center gap-2 text-sm transition-all"
          >
            <Download className="w-4 h-4" />
            下载 Word
          </button>

          <button
            onClick={handleCopy}
            className={`px-6 py-2 rounded-lg text-white font-medium flex items-center gap-2 text-sm transition-all ${
              copied ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? '已复制' : '复制全文'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {/* Main Content Area */}
          <div 
            id="article-content" 
            className="bg-white p-10 md:p-14 rounded-xl shadow-lg border border-slate-200 min-h-[800px]"
          >
            <div className="prose prose-slate prose-lg max-w-none">
              <ReactMarkdown
                components={{
                  // Explicit H1 styling
                  h1: ({node, ...props}) => <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-0 mb-8 pb-4 border-b border-slate-100" {...props} />,
                  // Explicit H2 styling
                  h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 flex items-center gap-2" {...props} />,
                  // Explicit H3 styling
                  h3: ({node, ...props}) => <h3 className="text-xl font-bold text-slate-700 mt-8 mb-3" {...props} />,
                  // Paragraphs with comfortable reading spacing
                  p: ({node, ...props}) => <p className="text-slate-700 leading-relaxed mb-6" {...props} />,
                  // Lists
                  ul: ({node, ...props}) => <ul className="list-disc pl-6 space-y-2 mb-6 text-slate-700" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-6 space-y-2 mb-6 text-slate-700" {...props} />,
                  // Blockquote used for Image Suggestions or Highlights
                  blockquote: ({node, ...props}) => (
                    <div className="my-8 p-4 bg-indigo-50/50 border border-indigo-100 rounded-lg flex gap-4 items-start text-indigo-800 not-italic">
                       <div className="bg-indigo-100 p-2 rounded-md flex-shrink-0 mt-1">
                          <ImageIcon className="w-5 h-5 text-indigo-600" />
                       </div>
                       <div className="text-sm font-medium">
                         <blockquote {...props} />
                       </div>
                    </div>
                  ),
                  // Table styling
                  table: ({node, ...props}) => (
                    <div className="overflow-x-auto my-8 border rounded-lg border-slate-200">
                      <table className="w-full text-sm text-left text-slate-600" {...props} />
                    </div>
                  ),
                  thead: ({node, ...props}) => <thead className="bg-slate-50 text-slate-700 font-semibold" {...props} />,
                  th: ({node, ...props}) => <th className="px-6 py-3 border-b border-slate-200" {...props} />,
                  td: ({node, ...props}) => <td className="px-6 py-4 border-b border-slate-100" {...props} />,
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 sticky top-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              文中引用来源
            </h3>
            {sources.length === 0 ? (
              <p className="text-xs text-slate-500">使用了 AI 内部知识库。</p>
            ) : (
              <ul className="space-y-3">
                {sources.map((source, idx) => (
                  <li key={idx}>
                    <a
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-600 hover:text-indigo-600 flex items-start gap-2 leading-tight group"
                    >
                      <ExternalLink className="w-3 h-3 flex-shrink-0 mt-0.5 opacity-50 group-hover:opacity-100" />
                      <span className="line-clamp-2">{source.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-6 pt-6 border-t border-slate-200">
               <p className="text-[10px] text-slate-400">
                 由 Gemini 2.5 生成。预览模式已优化阅读体验。
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepResult;