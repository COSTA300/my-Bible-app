export type Level = "Beginner" | "Intermediate" | "Advanced";
export type Translation = "NIV" | "KJV" | "ESV" | "NLT" | "The Message" | "NASB";

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface JournalEntry {
  id: string;
  content: string;
  timestamp: number;
  response?: string;
}
