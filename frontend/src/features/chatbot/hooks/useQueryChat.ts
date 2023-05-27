import { useQuery } from 'react-query';
import { Tables } from 'src/types/customSupabase';
import { supabase } from '@/lib/supabase';

export const useQueryChat = (chatId: string) => {
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

  return useQuery<Tables['chats']['Row'], Error>({
    queryKey: [`chat-${chatId}`],
    queryFn: getChat,
    staleTime: Infinity,
  });
};
