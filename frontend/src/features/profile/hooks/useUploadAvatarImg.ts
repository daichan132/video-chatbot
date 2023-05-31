/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from 'react-query';
import useSupabaseStore from 'src/stores/supabaseStore';
import { supabase } from '@/lib/supabase';
import { FileWithPath } from '@mantine/dropzone';
import { useUser } from '@supabase/auth-helpers-react';

export const useUploadAvatarImg = () => {
  const user = useUser();
  const editedProfile = useSupabaseStore((state) => state.editedProfile);
  const updateProfile = useSupabaseStore((state) => state.updateEditedProfile);
  const useMutateUploadAvatarImg = useMutation(
    async (files: FileWithPath[]) => {
      if (!files || files.length === 0) {
        throw new Error('Please select the image file');
      }
      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
      const { error } = await supabase.storage
        .from('avatars')
        .upload(`${user?.id}/${filePath}`, file);
      if (error) throw new Error(error.message);
      updateProfile({ ...editedProfile, avatar_url: filePath });
    },
    {
      onError: (err: any) => {
        alert(err.message);
      },
    }
  );

  return { useMutateUploadAvatarImg };
};
