import { useQuery } from 'react-query';
import { Tables } from 'src/types/customSupabase';
import { supabase } from '@/lib/supabase';

export const useQueryMessages = (chatId: string) => {
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
  return useQuery<Tables['messages']['Row'][], Error>({
    queryKey: ['messages'],
    queryFn: getMessages,
    staleTime: Infinity,
  });
};
