import { useQuery } from 'react-query';
import { Tables } from '@/types';
import { supabase } from '@/utils/supabase';
import useChatStore from '@/stores/chatStore';
import { useEffect } from 'react';

export const useQueryChat = (chatId: string) => {
  const setChat = useChatStore((state) => state.setChat);

  const getChat = async (): Promise<Tables['chats']['Row']> => {
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
