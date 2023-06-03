import { useQuery } from 'react-query';
import { Tables } from 'src/types/customSupabase';
import { supabase } from '@/lib/supabase';

export const useQueryAllChats = () => {
  const getChats = async (): Promise<Tables['chats']['Row'][]> => {
    const { data, error, status } = await supabase
      .from('chats')
      .select('*, messages(count)')
      .order('created_at', { ascending: false });
    if (error && status !== 406) {
      throw new Error(error.message);
    }
    return data as Tables['chats']['Row'][];
  };
  return useQuery<Tables['chats']['Row'][], Error>({
    queryKey: ['chats'],
    queryFn: getChats,
    staleTime: Infinity,
  });
};
