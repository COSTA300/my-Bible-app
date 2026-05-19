import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Loader2, Send, Quote, Sparkles } from 'lucide-react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc,
  doc,
  limit
} from 'firebase/firestore';
import { useMentor } from '../hooks/useMentor';
import { JournalEntry } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export default function SanctuaryView() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [input, setInput] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  const { askMentor, loading: mentorLoading, error: mentorError } = useMentor();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    const entriesRef = collection(db, 'users', user.uid, 'entries');
    const q = query(entriesRef, orderBy('timestamp', 'asc'), limit(50));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as JournalEntry[];
      setEntries(docs);
      setInitialLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/entries`);
    });

    return unsubscribe;
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries, mentorLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || mentorLoading || !user) return;

    const userInput = input;
    setInput('');

    try {
      const entriesRef = collection(db, 'users', user.uid, 'entries');
      const docRef = await addDoc(entriesRef, {
        content: userInput,
        timestamp: Date.now(),
        userId: user.uid
      });

      const response = await askMentor({
        mode: 'journal',
        userMessage: userInput,
      });

      if (response) {
        await updateDoc(doc(db, 'users', user.uid, 'entries', docRef.id), {
          response
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/entries`);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-sanctuary-gold">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-4" id="sanctuary-view">
      <header className="pb-4 border-b border-sanctuary-paper">
        <h2 className="font-serif text-3xl font-bold text-sanctuary-olive">God's child</h2>
        <p className="text-sm text-gray-500 italic">Pour out your heart. This is a private space.</p>
      </header>

      <div className="flex-1 overflow-y-auto space-y-8 pr-2">
        {entries.length === 0 && (
          <div className="py-20 text-center space-y-6">
            <div className="w-16 h-16 bg-sanctuary-paper rounded-full flex items-center justify-center mx-auto text-sanctuary-gold animate-pulse">
              <Sparkles size={32} />
            </div>
            <p className="text-sm text-sanctuary-olive/60 font-serif italic max-w-[200px] mx-auto">
              "Trust in Him at all times, ye people; pour out your heart before Him..."
            </p>
          </div>
        )}

        {entries.map((entry) => (
          <div key={entry.id} className="space-y-4">
            <div className="bg-sanctuary-paper/40 p-6 rounded-[2rem] rounded-tr-none border border-sanctuary-paper ml-8">
              <p className="text-sm text-sanctuary-olive font-serif leading-relaxed italic">{entry.content}</p>
              <p className="text-[9px] mt-3 uppercase tracking-widest text-gray-400">
                {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            
            {(entry.response || mentorLoading && entries[entries.length-1].id === entry.id) && (
              <div className="bg-white p-6 rounded-[2rem] rounded-tl-none shadow-sm border border-sanctuary-paper mr-8 relative">
                <Quote className="absolute top-4 right-4 text-sanctuary-gold opacity-20" size={32} />
                {entry.response ? (
                  <article className="markdown-body text-xs">
                    <ReactMarkdown>{entry.response}</ReactMarkdown>
                  </article>
                ) : (
                  <div className="flex gap-2 items-center text-sanctuary-gold text-xs">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="italic font-serif">A mentor is listening...</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="relative mt-4">
        {mentorError && (
          <div className="absolute -top-12 left-0 right-0 p-3 bg-red-50 text-red-600 text-[10px] rounded-xl border border-red-100 animate-in fade-in slide-in-from-bottom-2">
            {mentorError}
          </div>
        )}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Share your thoughts, feelings, or secrets..."
          rows={3}
          className="w-full p-6 bg-white border border-sanctuary-paper rounded-[2rem] shadow-lg focus:ring-2 focus:ring-sanctuary-gold focus:border-transparent outline-none text-sm resize-none pr-16 font-serif placeholder:italic"
          id="journal-input"
        />
        <button 
          type="submit"
          disabled={mentorLoading || !input.trim()}
          className="absolute right-4 bottom-6 p-4 bg-sanctuary-gold text-white rounded-2xl shadow-md disabled:opacity-50 transition-all hover:scale-105"
          id="journal-submit"
        >
          {mentorLoading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
        </button>
      </form>
    </div>
  );
}
