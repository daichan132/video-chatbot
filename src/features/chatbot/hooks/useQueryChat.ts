import { useQuery } from 'react-query';
import { Tables } from 'src/types/customSupabase';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import useChatStore from '../store/chatStore';

export const useQueryChat = (chatId: string) => {
  const setChat = useChatStore((state) => state.setChat, shallow);

  const getChat = async (): Promise<Tables['chats']['Row']> => {
    if (!chatId)
      return {
        id: '',
        title: null,
        created_at: null,
        model: null,
        owner: null,
        system_prompt: null,
      };
    const { data, error, status } = await supabase
      .from('chats')
      .select('*, messages(count)')
      .eq('id', chatId)
      .single();
    if (error && status !== 406) {
      throw new Error(error.message);
    }
    return data as Tables['chats']['Row'];
  };

  const queryInstance = useQuery<Tables['chats']['Row'], Error>({
    queryKey: [`chat-${chatId}`],
    queryFn: getChat,
    staleTime: Infinity,
  });
  useEffect(() => {
    if (queryInstance.data) {
      setChat(queryInstance.data);
    }
  }, [queryInstance.data, setChat]);

  return queryInstance;
};
