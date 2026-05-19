import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Loader2, Send, Sparkles, Heart } from 'lucide-react';
import { useMentor } from '../hooks/useMentor';
import { motion, AnimatePresence } from 'motion/react';

export default function PrayView() {
  const [intention, setIntention] = useState('');
  const [session, setSession] = useState<string | null>(null);
  const { askMentor, loading, error } = useMentor();

  const handlePray = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intention.trim() || loading) return;

    const result = await askMentor({
      mode: 'pray',
      userMessage: intention,
    });
    if (result) {
      setSession(result);
    }
  };

  const resetSession = () => {
    setSession(null);
    setIntention('');
  };

  return (
    <div className="space-y-6 pb-12" id="pray-view">
      <header className="space-y-1">
        <h2 className="font-serif text-3xl font-bold text-sanctuary-olive">Pray</h2>
        <p className="text-sm text-gray-500">Share what is on your heart.</p>
      </header>

      <AnimatePresence mode="wait">
        {!session && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-white p-8 rounded-[2.5rem] border border-sanctuary-paper shadow-sm space-y-6">
              <div className="flex items-center gap-3 text-sanctuary-gold">
                <Heart size={20} />
                <span className="text-xs uppercase tracking-widest font-bold">Your Intention</span>
              </div>
              
              <form onSubmit={handlePray} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 text-xs rounded-2xl border border-red-100">
                    {error}
                  </div>
                )}
                <textarea
                  value={intention}
                  onChange={(e) => setIntention(e.target.value)}
                  placeholder="What would you like to pray about today? Share your thoughts, burdens, or joys..."
                  className="w-full min-h-[160px] p-0 border-none outline-none text-lg text-sanctuary-olive placeholder:text-gray-300 resize-none bg-transparent leading-relaxed"
                  required
                  id="prayer-intention-input"
                />
                
                <button
                  type="submit"
                  disabled={!intention.trim() || loading}
                  className="w-full py-4 bg-sanctuary-gold text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-sanctuary-olive transition-all shadow-lg active:scale-95 disabled:opacity-30"
                  id="start-prayer-button"
                >
                  <Sparkles size={20} />
                  Bring it to the Lord
                </button>
              </form>
            </div>

            <div className="px-6 py-4 bg-sanctuary-paper/30 rounded-3xl border border-dashed border-sanctuary-paper text-center">
              <p className="text-[11px] text-gray-400 uppercase tracking-widest leading-relaxed">
                "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God."
              </p>
            </div>
          </motion.div>
        )}

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 flex flex-col items-center justify-center gap-6 text-sanctuary-gold"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-sanctuary-gold/20 rounded-full blur-xl animate-pulse" />
              <Loader2 size={48} className="animate-spin relative z-10" />
            </div>
            <p className="font-serif italic text-lg animate-pulse">Entering the presence...</p>
          </motion.div>
        )}

        {session && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-sanctuary-paper relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-sanctuary-gold opacity-30" />
              <article className="markdown-body prose prose-stone prose-sm max-w-none">
                <ReactMarkdown>{session}</ReactMarkdown>
              </article>
              
              <button 
                onClick={resetSession}
                className="mt-12 w-full py-4 rounded-2xl bg-sanctuary-olive text-white font-bold hover:bg-sanctuary-ink transition-all shadow-md flex items-center justify-center gap-2"
                id="finish-prayer"
              >
                Amen
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
