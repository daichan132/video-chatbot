import { useQuery } from 'react-query';
import { Tables } from 'src/types/customSupabase';
import { supabase } from '@/lib/supabase';

export const useQueryPageId = (chatId: string) => {
  const getPageId = async (): Promise<Tables['nods_page']['Row'][]> => {
    if (!chatId) return [];
    const { data, error, status } = await supabase
      .from('nods_page')
      .select('*')
      .eq('chat', chatId)
      .returns<Tables['nods_page']['Row'][]>();
    if (error && status !== 406) {
      throw new Error(error.message);
    }

    return data as Tables['nods_page']['Row'][];
  };
  const queryInstance = useQuery<Tables['nods_page']['Row'][], Error>({
    queryKey: [`nods-page-${chatId}`],
    queryFn: getPageId,
    cacheTime: 0,
    staleTime: 0,
  });
  return queryInstance;
};
