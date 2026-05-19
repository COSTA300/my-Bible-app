import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Search, Loader2, Send, Info } from 'lucide-react';
import { useMentor } from '../hooks/useMentor';
import { Level, Translation } from '../types';
import { cn } from '../lib/utils';

interface LearnViewProps {
  level: Level;
  translation: Translation;
  initialQuery?: string | null;
  onQueryHandled?: () => void;
}

export default function LearnView({ level, translation, initialQuery, onQueryHandled }: LearnViewProps) {
  const [query, setQuery] = useState(initialQuery || '');
  const [content, setContent] = useState<string | null>(null);
  const { askMentor, loading } = useMentor();

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      handleStudy(initialQuery);
      onQueryHandled?.();
    }
  }, [initialQuery]);

  const handleStudy = async (directQuery?: string | React.FormEvent) => {
    const studyQuery = typeof directQuery === 'string' ? directQuery : query;
    if (directQuery && typeof directQuery !== 'string') directQuery.preventDefault();
    
    if (!studyQuery.trim()) return;

    const result = await askMentor({
      mode: 'teach',
      userMessage: `I want to study: ${studyQuery}`,
      level,
      translation
    });

    if (result) setContent(result);
  };

  return (
    <div className="space-y-6 pb-12" id="learn-view">
      <header className="space-y-1">
        <h2 className="font-serif text-3xl font-bold text-sanctuary-olive">Learn</h2>
        <p className="text-sm text-gray-500">Tiered teaching to grow your understanding.</p>
      </header>

      <div className="flex gap-2">
        <div className="px-3 py-1 bg-sanctuary-olive/10 text-sanctuary-olive rounded-full text-[10px] font-bold uppercase tracking-wider">{level}</div>
        <div className="px-3 py-1 bg-sanctuary-gold/10 text-sanctuary-gold rounded-full text-[10px] font-bold uppercase tracking-wider">{translation}</div>
      </div>

      <form onSubmit={handleStudy} className="relative group">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a passage or topic..."
          className="w-full pl-12 pr-14 py-4 bg-white border border-sanctuary-paper rounded-2xl shadow-sm focus:ring-2 focus:ring-sanctuary-gold focus:border-transparent transition-all outline-none"
          id="learn-input"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-sanctuary-gold transition-colors" size={20} />
        <button 
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-sanctuary-olive text-white rounded-xl disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
          id="learn-submit"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
        </button>
      </form>

      {!content && !loading && (
        <div className="p-8 border-2 border-dashed border-sanctuary-paper rounded-3xl text-center space-y-4">
          <div className="w-12 h-12 bg-sanctuary-paper rounded-full flex items-center justify-center mx-auto text-sanctuary-gold">
            <Info size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sanctuary-olive">How to Read the Bible</h3>
            <p className="text-sm text-gray-400">Enter any passage to start an interactive deep-dive tailored to your spiritual level.</p>
          </div>
        </div>
      )}

      {content && (
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-sanctuary-paper">
          <article className="markdown-body text-sm leading-relaxed">
            <ReactMarkdown>{content}</ReactMarkdown>
          </article>
          
          <div className="mt-8 pt-6 border-t border-sanctuary-paper">
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest text-center">Interactive Mentor Feedback Available Below</p>
            <div className="mt-4 p-4 bg-sanctuary-bg rounded-2xl border border-sanctuary-paper italic text-xs text-sanctuary-olive/70">
              "This experience is designed to teach you how to see the context and heart behind every word. What stands out to you most in this passage?"
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
