import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface FileType {
  name: string;
  size: number;
}

export interface Message {
  agent: 'human' | 'ai';
  text: string;
}

interface ChatState {
  userId: string;
  question: string;
  history: Message[];
  files: FileType[];
  setUserId: (userId: string) => void;
  addFile: (file: FileType) => void;
  deleteFile: (id: string) => void;
  setQuestion: (question: string) => void;
  setHistory: (history: Message[]) => void;
  addToHistory: (message: Message) => void;
}

const useChatStore = create<ChatState>()(
  devtools(
    (set) => ({
      userId: 'anonymous',
      question: '',
      files: [],
      history: [],
      setUserId: (userId: string) => set({ userId }),
      addFile: (file: FileType) => set((state) => ({ files: [...state.files, file] })),
      deleteFile: (name: string) =>
        set((state) => ({ files: state.files.filter((file) => file.name !== name) })),
      setQuestion: (question: string) => set({ question }),
      setHistory: (history: Message[]) => set({ history }),
      addToHistory: (message: Message) =>
        set((state) => ({ history: [...state.history, message] })),
    }),
    { name: 'app-state' }
  )
);
export default useChatStore;
