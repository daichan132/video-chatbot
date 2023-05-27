import { useQuery } from 'react-query';
import useSupabaseStore from 'src/stores/supabaseStore';
import { Tables } from 'src/types/customSupabase';
import { supabase } from '@/lib/supabase';
import { useMutateProfile } from './useMutateProfile';

export const useQueryProfile = () => {
  const session = useSupabaseStore((state) => state.session);
  const editedProfile = useSupabaseStore((state) => state.editedProfile);
  const update = useSupabaseStore((state) => state.updateEditedProfile);
  const { createProfileMutation } = useMutateProfile();
  const getProfile = async (): Promise<Tables['profiles']['Row']> => {
    const { data, error, status } = await supabase.from('profiles').select('*').single();
    if (error && status === 406) {
      if (session?.user) {
        createProfileMutation.mutate({
          id: session?.user.id,
          username: session?.user?.email?.match(/(.*)@/)?.[1],
          avatar_url: '',
        });
      }
      update({
        ...editedProfile,
        username: session?.user.email || null,
      });
    }
    if (error && status !== 406) {
      throw new Error(error.message);
    }
    return data as Tables['profiles']['Row'];
  };
  return useQuery<Tables['profiles']['Row'], Error>({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: Infinity,
    onSuccess: (data) => {
      if (data) {
        update({
          username: data.username,
          avatar_url: data.avatar_url,
        });
      }
    },
  });
};
