import { useQuery } from 'react-query';
import { Tables } from 'src/types/customSupabase';
import { supabase } from '@/lib/supabase';

export const useQueryNodsPage = (chatId: string) => {
  const getNodsPage = async (): Promise<Tables['nods_page']['Row'] | undefined> => {
    if (!chatId) return undefined;
    const { data, error, status } = await supabase
      .from('nods_page')
      .select('*')
      .eq('chat', chatId)
      .returns<Tables['nods_page']['Row'][]>()
      .single();
    if (error && status !== 406) {
      throw new Error(error.message);
    }

    return data as Tables['nods_page']['Row'];
  };
  const queryInstance = useQuery<Tables['nods_page']['Row'] | undefined, Error>({
    queryKey: [`nods-page-${chatId}`],
    queryFn: getNodsPage,
    cacheTime: 0,
    staleTime: 0,
  });
  return queryInstance;
};
