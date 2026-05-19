import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ShieldCheck, Target, AlertTriangle, Loader2, Send } from 'lucide-react';
import { useMentor } from '../hooks/useMentor';

export default function GrowthView() {
  const [reflection, setReflection] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const { askMentor, loading } = useMentor();

  const handleReflect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const result = await askMentor({
      mode: 'accountability',
      userMessage: `Help me evaluate this pattern or habit I'm struggling with: ${input}. Be honest, direct, and use scripture to guide my growth.`,
    });

    if (result) setReflection(result);
  };

  return (
    <div className="space-y-6 pb-12" id="growth-view">
      <header>
        <h2 className="font-serif text-3xl font-bold text-sanctuary-olive">Growth</h2>
        <p className="text-sm text-gray-500">Honest accountability for your spiritual health.</p>
      </header>

      {!reflection && !loading && (
        <div className="space-y-8">
          <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl flex gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl h-fit">
              <AlertTriangle size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-amber-800 text-sm">Direct & Honest</h3>
              <p className="text-xs text-amber-700/80 leading-relaxed">
                The mentor will not sugarcoat. You will receive straightforward feedback on how your habits align with Scripture.
              </p>
            </div>
          </div>

          <form onSubmit={handleReflect} className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-sanctuary-gold" htmlFor="habit-input">
              What are you evaluating?
            </label>
            <textarea
              id="habit-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., I'm struggling with consistency, or I've been feeling envious of others..."
              rows={4}
              className="w-full p-6 bg-white border border-sanctuary-paper rounded-3xl shadow-sm focus:ring-2 focus:ring-sanctuary-gold outline-none text-sm transition-all"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-full py-5 bg-sanctuary-olive text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-sanctuary-ink transition-all shadow-lg"
              id="reflect-button"
            >
              Request Accountability
              <Target size={20} />
            </button>
          </form>
        </div>
      )}

      {loading && (
        <div className="py-20 flex flex-col items-center justify-center gap-4 text-sanctuary-gold">
          <Loader2 size={48} className="animate-spin" />
          <p className="font-serif italic animate-pulse">Examining under the light of Truth...</p>
        </div>
      )}

      {reflection && !loading && (
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-sanctuary-paper relative">
            <div className="absolute top-0 right-0 p-4">
              <ShieldCheck className="text-sanctuary-gold opacity-50" size={32} />
            </div>
            <article className="markdown-body">
              <ReactMarkdown>{reflection}</ReactMarkdown>
            </article>
          </div>

          <button
            onClick={() => {
              setReflection(null);
              setInput('');
            }}
            className="w-full py-4 text-sanctuary-olive font-bold hover:bg-sanctuary-paper rounded-2xl transition-all border border-sanctuary-paper"
            id="new-reflection"
          >
            Start New Reflection
          </button>
        </div>
      )}
    </div>
  );
}
