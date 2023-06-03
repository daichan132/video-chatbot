/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueryClient, useMutation } from 'react-query';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/customSupabase';
import { ffmpeg } from '@/lib/ffmpeg';
import { fetchFile } from '@ffmpeg/ffmpeg';

const MAX_FILE_SIZE = 25000000;

interface UpdateNodsPageType {
  nods_page: Tables['nods_page']['Update'];
  chatId: string;
}
interface TranscriptType {
  file: File;
  chatId: string;
}

export const useMutateNodsPage = () => {
  const queryClient = useQueryClient();

  const addNodsPageMutation = useMutation(
    async (nods_page: Tables['nods_page']['Insert']) => {
      const { data, error } = await supabase
        .from('nods_page')
        .insert(nods_page)
        .select('*')
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: (res) => {
        if (res) queryClient.setQueryData(['chat'], res);
      },
      onError: (err: any) => {
        alert(err.message);
      },
    }
  );

  const updateNodsPageMutation = useMutation(
    async (input: UpdateNodsPageType) => {
      const { nods_page, chatId } = input;
      const { data, error } = await supabase
        .from('nods_page')
        .update(nods_page)
        .eq('chat', chatId)
        .select('*')
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: (res) => {
        if (res) queryClient.setQueryData(['chat'], res);
      },
      onError: (err: any) => {
        alert(err.message);
      },
    }
  );

  const transcriptMutation = useMutation(
    async (input: TranscriptType) => {
      const { file, chatId } = input;
      ffmpeg.FS('writeFile', file.name, await fetchFile(file));
      await ffmpeg.run(
        '-i',
        file.name,
        '-vn',
        '-ar',
        '16000',
        '-ac',
        '1',
        '-b:a',
        '96k',
        '-f',
        'mp3',
        'output.mp3'
      );
      const readData = ffmpeg.FS('readFile', 'output.mp3');
      const audioBlob = new Blob([readData.buffer], { type: 'audio/mp3' });
      if (audioBlob.size > MAX_FILE_SIZE) {
        throw new Error('too large data');
      }

      const audio_file = new File([audioBlob], 'audio.mp3', {
        type: audioBlob.type,
        lastModified: Date.now(),
      });
      const formData = new FormData();
      formData.append('file', audio_file);
      const response = await fetch(`/api/openai/whisper`, {
        method: 'POST',
        body: formData,
      });
      const response_data = await response.json();
      const { data } = response_data;
      updateNodsPageMutation.mutate({
        nods_page: {
          meta: {
            ...data,
            segments: data.segments.map((segment: any) => ({
              id: segment.id,
              start: segment.start,
              end: segment.end,
              text: segment.text,
              seek: segment.seek,
            })),
          },
        },
        chatId,
      });
    },
    {
      onError: (err: any) => {
        alert(err.message);
      },
    }
  );

  return { addNodsPageMutation, updateNodsPageMutation, transcriptMutation };
};
