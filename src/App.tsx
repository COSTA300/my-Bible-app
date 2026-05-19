/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  BookOpen, 
  HandHeart, 
  PenTool, 
  Scale, 
  Settings,
  ChevronRight,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { cn } from './lib/utils';
import { Translation, Level } from './types';
import { TRANSLATIONS, LEVELS } from './constants';
import { useAuth } from './contexts/AuthContext';
import LearnView from './components/LearnView';
import PrayView from './components/PrayView';
import HomeView from './components/HomeView';
import SanctuaryView from './components/SanctuaryView';
import GrowthView from './components/GrowthView';
import LoginView from './components/LoginView';

type View = 'home' | 'learn' | 'pray' | 'sanctuary' | 'growth' | 'settings';

export default function App() {
  const { user, username, loading: authLoading, logout } = useAuth();
  const [activeView, setActiveView] = useState<View>('home');
  const [level, setLevel] = useState<Level>('Beginner');
  const [translation, setTranslation] = useState<Translation>('NIV');
  const [autoQuery, setAutoQuery] = useState<string | null>(null);

  const handleNavigate = (view: View, query?: string) => {
    if (query) setAutoQuery(query);
    setActiveView(view);
  };

  const navItems = [
    { icon: Home, label: 'Home', id: 'home' as View },
    { icon: BookOpen, label: 'Learn', id: 'learn' as View },
    { icon: HandHeart, label: 'Pray', id: 'pray' as View },
    { icon: PenTool, label: 'Journal', id: 'sanctuary' as View },
    { icon: Scale, label: 'Growth', id: 'growth' as View },
  ];

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-sanctuary-bg">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-sanctuary-gold font-serif text-2xl"
        >
          God's child
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-sanctuary-bg shadow-xl overflow-hidden font-sans border-x border-gray-100">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div>
          <h1 className="font-serif text-2xl font-bold text-sanctuary-olive tracking-tight">God's child</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-sanctuary-gold font-semibold">Peace, {username || 'friend'}</p>
        </div>
        <button 
          onClick={() => setActiveView('settings')}
          className="p-2 hover:bg-sanctuary-paper rounded-full transition-colors"
          id="settings-button"
        >
          <Settings size={20} className="text-sanctuary-olive" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 pb-24 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {activeView === 'home' && <HomeView onNavigate={handleNavigate} />}
            {activeView === 'learn' && <LearnView level={level} translation={translation} initialQuery={autoQuery} onQueryHandled={() => setAutoQuery(null)} />}
            {activeView === 'pray' && <PrayView />}
            {activeView === 'sanctuary' && <SanctuaryView />}
            {activeView === 'growth' && <GrowthView />}
            {activeView === 'settings' && (
              <div className="space-y-8" id="settings-view">
                <h2 className="font-serif text-3xl font-bold text-sanctuary-olive">Settings</h2>
                
                <section className="p-6 bg-white rounded-3xl border border-sanctuary-paper space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-sanctuary-paper rounded-full flex items-center justify-center text-sanctuary-gold">
                      <UserIcon size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sanctuary-olive">{username}</h3>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">{user.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => logout()}
                    className="w-full py-3 bg-red-50 text-red-500 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                    id="logout-button"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </section>

                <section className="space-y-4">
                  <h3 className="text-xs uppercase tracking-widest text-sanctuary-gold font-bold">Scripture Level</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {LEVELS.map(l => (
                      <button
                        key={l}
                        onClick={() => setLevel(l)}
                        className={cn(
                          "py-3 rounded-xl border-2 transition-all text-sm font-medium",
                          level === l 
                            ? "bg-sanctuary-olive text-white border-sanctuary-olive shadow-md" 
                            : "bg-white border-sanctuary-paper text-sanctuary-olive hover:border-sanctuary-gold"
                        )}
                        id={`level-${l.toLowerCase()}`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-xs uppercase tracking-widest text-sanctuary-gold font-bold">Preferred Translation</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {TRANSLATIONS.map(t => (
                      <button
                        key={t}
                        onClick={() => setTranslation(t)}
                        className={cn(
                          "py-3 px-4 rounded-xl border-2 transition-all text-left flex items-center justify-between",
                          translation === t 
                            ? "bg-sanctuary-olive text-white border-sanctuary-olive shadow-md" 
                            : "bg-white border-sanctuary-paper text-sanctuary-olive hover:border-sanctuary-gold"
                        )}
                        id={`translation-${t.replace(/\s+/g, '-').toLowerCase()}`}
                      >
                        <span className="text-sm font-medium">{t}</span>
                        {translation === t && <ChevronRight size={16} />}
                      </button>
                    ))}
                  </div>
                </section>

                <div className="pt-8">
                  <button 
                    onClick={() => setActiveView('home')}
                    className="w-full py-4 bg-sanctuary-gold text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
                    id="back-button"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-md border-t border-sanctuary-paper px-4 pb-6 pt-3 flex justify-around items-center z-10">
        {navItems.map(({ icon: Icon, label, id }) => (
          <button
            key={id}
            onClick={() => setActiveView(id)}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-2xl transition-all",
              activeView === id ? "text-sanctuary-olive" : "text-gray-400 opacity-60 hover:opacity-100"
            )}
            id={`nav-${id}`}
          >
            <div className={cn(
              "p-1.5 rounded-xl transition-all",
              activeView === id ? "bg-sanctuary-paper shadow-sm" : ""
            )}>
              <Icon size={20} strokeWidth={activeView === id ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

