import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Tables } from '@/types/customSupabase';

type ChatState = {
  setChat: (payload: Tables['chats']['Row']) => void;
  resetChat: () => void;
} & Tables['chats']['Row'];

const useChatStore = create<ChatState>()(
  devtools(
    (set) => ({
      id: '',
      title: null,
      advanced_settings: null,
      created_at: null,
      model: null,
      owner: null,
      system_prompt: null,
      setChat: (payload) =>
        set(
          {
            ...payload,
          },
          false,
          'setChat'
        ),
      resetChat: () => set({}, false, 'resetChat'),
    }),
    { name: 'chat-state' }
  )
);
export default useChatStore;
