import { useQuery } from 'react-query';
import { Tables } from 'src/types/customSupabase';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import useChatStore from '../store/chatStore';

export const useQueryMessages = (chatId: string) => {
  const setMessages = useChatStore((state) => state.setMessages, shallow);
  const getMessages = async (): Promise<Tables['messages']['Row'][]> => {
    const { data, error, status } = await supabase
      .from('messages')
      .select('*')
      .eq('chat', chatId)
      .order('created_at', { ascending: true })
      .order('role', { ascending: false })
      .returns<Tables['messages']['Row'][]>();
    if (error && status !== 406) {
      throw new Error(error.message);
    }
    return data as Tables['messages']['Row'][];
  };
  const queryInstance = useQuery<Tables['messages']['Row'][], Error>({
    queryKey: [`messages-${chatId}`],
    queryFn: getMessages,
    staleTime: Infinity,
  });
  useEffect(() => {
    if (queryInstance.data) {
      setMessages(queryInstance.data);
    }
  }, [queryInstance.data, setMessages]);
  return queryInstance;
};
