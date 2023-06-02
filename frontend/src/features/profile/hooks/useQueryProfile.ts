import { useQuery } from 'react-query';
import useSupabaseStore from 'src/stores/supabaseStore';
import { Tables } from 'src/types/customSupabase';
import { supabase } from '@/lib/supabase';
import { useUser } from '@supabase/auth-helpers-react';
import { useMutateProfile } from './useMutateProfile';

export const useQueryProfile = () => {
  const editedProfile = useSupabaseStore((state) => state.editedProfile);
  const update = useSupabaseStore((state) => state.updateEditedProfile);
  const { createProfileMutation } = useMutateProfile();
  const user = useUser();
  const getProfile = async (): Promise<Tables['profiles']['Row']> => {
    const { data, error, status } = await supabase.from('profiles').select('*').single();
    if (error && status === 406) {
      if (user) {
        createProfileMutation.mutate({
          id: user.id,
          username: user?.email?.match(/(.*)@/)?.[1],
          avatar_url: '',
        });
      }
      update({
        ...editedProfile,
        username: user?.email || null,
      });
    }
    if (error && status !== 406) {
      throw new Error(error.message);
    }
    return data as Tables['profiles']['Row'];
  };
  return useQuery<Tables['profiles']['Row'], Error>({
    queryKey: [`profile-${user?.id}`],
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
