/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from 'react-query';
import { supabase } from '@/lib/supabase';
import { FileWithPath } from '@mantine/dropzone';
import { useUser } from '@supabase/auth-helpers-react';
import { useMutateNodsPage } from './useMutateNodsPage';

interface UploadVideoInput {
  files: FileWithPath[];
  chatId: string;
}

export const useUploadVideo = () => {
  const user = useUser();
  const { updateNodsPageMutation } = useMutateNodsPage();
  const useMutateUploadVideo = useMutation(
    async (input: UploadVideoInput) => {
      const { files, chatId } = input;
      if (!files || files.length === 0) {
        throw new Error('Please select the video file');
      }
      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
      const { error: updateError } = await supabase.storage
        .from('videos')
        .upload(`${user?.id}/${filePath}`, file);
      if (updateError) throw new Error(updateError.message);
      updateNodsPageMutation.mutate({ nods_page: { video_url: filePath }, chatId });
    },
    {
      onError: (err: any) => {
        alert(err.message);
      },
    }
  );

  return { useMutateUploadVideo };
};
