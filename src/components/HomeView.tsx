import { useMemo } from 'react';
import { motion } from 'motion/react';
import { BookMarked, Sparkles, Heart, Zap } from 'lucide-react';
import { WELCOME_MESSAGES, PASSAGE_SUGGESTIONS } from '../constants';

interface HomeViewProps {
  onNavigate: (view: any, query?: string) => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  const welcome = useMemo(() => WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)], []);

  // Generate 5 random suggestions based on the current date
  const dailySuggestions = useMemo(() => {
    const today = new Date().toDateString();
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
      hash = ((hash << 5) - hash) + today.charCodeAt(i);
      hash |= 0;
    }
    
    const shuffled = [...PASSAGE_SUGGESTIONS].sort((a, b) => {
      const hashA = (hash ^ a.length) % 100;
      const hashB = (hash ^ b.length) % 100;
      return hashA - hashB;
    });
    
    return shuffled.slice(0, 5);
  }, []);

  return (
    <div className="space-y-8" id="home-view">
      <section className="relative h-48 rounded-[2.5rem] overflow-hidden group shadow-lg">
        <img 
          src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=1000"
          alt="Peaceful sanctuary"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sanctuary-ink/80 via-sanctuary-ink/20 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <p className="text-[10px] uppercase tracking-[0.3em] text-sanctuary-gold font-bold mb-1">Peace be with you</p>
          <h2 className="font-serif text-2xl font-bold text-white leading-tight">
            {welcome}
          </h2>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => onNavigate('learn')}
          className="p-4 bg-white rounded-3xl border border-sanctuary-paper shadow-sm hover:shadow-md transition-all text-left flex flex-col gap-3 group"
          id="quick-learn"
        >
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit group-hover:scale-110 transition-transform">
            <BookMarked size={24} />
          </div>
          <div>
            <h3 className="font-bold text-sm">Today's Bread</h3>
            <p className="text-xs text-gray-400">Deep study for you</p>
          </div>
        </button>

        <button 
          onClick={() => onNavigate('pray')}
          className="p-4 bg-white rounded-3xl border border-sanctuary-paper shadow-sm hover:shadow-md transition-all text-left flex flex-col gap-3 group"
          id="quick-pray"
        >
          <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl w-fit group-hover:scale-110 transition-transform">
            <Heart size={24} />
          </div>
          <div>
            <h3 className="font-bold text-sm">Breathe</h3>
            <p className="text-xs text-gray-400">Guided prayer</p>
          </div>
        </button>
      </div>

      <section className="space-y-4">
        <h3 className="text-xs uppercase tracking-widest text-sanctuary-gold font-bold flex items-center gap-2">
          <Sparkles size={14} /> Suggestions for you
        </h3>
        <div className="space-y-3">
          {dailySuggestions.map((passage, i) => (
            <button
              key={passage}
              onClick={() => onNavigate('learn', passage)}
              className="w-full p-4 bg-sanctuary-paper/50 rounded-2xl flex items-center justify-between group hover:bg-sanctuary-paper transition-colors"
              id={`suggestion-${i}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-sanctuary-gold border border-sanctuary-paper">
                  {i + 1}
                </div>
                <span className="font-medium text-sanctuary-olive">{passage}</span>
              </div>
              <Zap size={16} className="text-sanctuary-gold opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </section>

      <section className="p-6 bg-sanctuary-olive rounded-[2rem] text-white space-y-4 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="font-serif text-xl font-bold">Spiritual Check-in</h3>
          <p className="text-white/80 text-sm leading-relaxed">
            "For where your treasure is, there your heart will be also."
          </p>
          <button 
            onClick={() => onNavigate('growth')}
            className="mt-2 py-2 px-6 bg-white text-sanctuary-olive rounded-full text-xs font-bold hover:bg-sanctuary-paper transition-colors"
            id="start-growth-check"
          >
            Reflect Now
          </button>
        </div>
        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      </section>
    </div>
  );
}
