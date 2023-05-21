import { useQuery } from 'react-query';
import useSupabaseStore from '@/stores/supabaseStore';
import { Profile } from '@/types';
import { supabase } from '@/utils/supabase';
import { useMutateProfile } from './useMutateProfile';

export const useQueryProfile = () => {
  const session = useSupabaseStore((state) => state.session);
  const editedProfile = useSupabaseStore((state) => state.editedProfile);
  const update = useSupabaseStore((state) => state.updateEditedProfile);
  const { createProfileMutation } = useMutateProfile();
  const getProfile = async (): Promise<Profile> => {
    const { data, error, status } = await supabase.from('profiles').select('*').single();
    if (error && status === 406) {
      createProfileMutation.mutate({
        id: session?.user?.id,
        username: session?.user?.email?.match(/(.*)@/)?.[1],
        avatar_url: '',
      });
      update({
        ...editedProfile,
        username: session?.user?.email,
      });
    }
    if (error && status !== 406) {
      throw new Error(error.message);
    }
    return data as Profile;
  };
  return useQuery<Profile, Error>({
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
