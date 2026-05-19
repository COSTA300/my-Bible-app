import { useState } from 'react';
import { Level, Translation } from '../types';

export function useMentor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const askMentor = async (params: {
    mode: 'teach' | 'pray' | 'journal' | 'accountability' | 'general';
    userMessage: string;
    context?: any;
    level?: Level;
    translation?: Translation;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      return data.text;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { askMentor, loading, error };
}
