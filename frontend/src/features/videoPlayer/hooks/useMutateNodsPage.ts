/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueryClient, useMutation } from 'react-query';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/customSupabase';
import { convertToVTT } from '@/utils/convertToVTT';
import { videoToAudio } from '@/utils/videoToAudio';

interface UpdateNodsPageType {
  nods_page: Tables['nods_page']['Update'];
  nodsPageId: number;
}
interface TranscriptType {
  file: File;
  nodsPageId: number;
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
      const { nods_page, nodsPageId } = input;
      const { data, error } = await supabase
        .from('nods_page')
        .update(nods_page)
        .eq('id', nodsPageId)
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
      const { file, nodsPageId } = input;
      const formData = await videoToAudio(file);
      const response_transcript = await fetch(`/api/openai/whisper`, {
        method: 'POST',
        body: formData,
      });
      const transcript_data = await response_transcript.json();
      const { data } = transcript_data;

      const segments = data.segments.map((segment: any) => ({
        id: segment.id,
        start: segment.start,
        end: segment.end,
        text: segment.text,
        seek: segment.seek,
      }));
      updateNodsPageMutation.mutate({
        nods_page: {
          meta: {
            ...data,
            segments,
          },
        },
        nodsPageId,
      });
      const vttText = convertToVTT(segments);

      await fetch('/api/openai/generate-embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page_id: nodsPageId,
          segments,
        }),
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
