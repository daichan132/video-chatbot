/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from 'react-query';
import { convertToVTT } from '@/utils/segmentsToVTT';
import { videoToAudio } from '@/utils/videoToAudio';
import { Segment, Tables } from '@/types/customSupabase';
import { compressSegments } from '@/utils/compressSegments';
import { supabase } from '@/lib/supabase';
import { shallow } from 'zustand/shallow';
import useChatStore from '@/stores/chatStore';
import { api_call_post, api_call_post_formdata } from '@/lib/apicall';
import { Json } from '@/types/supabase';
import { useUploadVtt } from './useUploadVtt';
import { useMutateNodsPage } from './useMutateNodsPage';

interface TranscriptType {
  file: File;
  nodsPageId: number;
}
interface SummarizedVttType {
  vttText: string;
  nodsPageId: number;
}
interface compressSegmentsType {
  segments: Segment[];
  nodsPageId: number;
}

interface Result {
  segment: Segment;
  embedding: number[];
}

export const useMutateHandler = () => {
  const { useMutateUploadVtt } = useUploadVtt();
  const { updateNodsPageMutation } = useMutateNodsPage();
  const id = useChatStore((state) => state.id, shallow);
  const setTitle = useChatStore((state) => state.setTitle, shallow);

  const updateChatMutation = useMutation(
    async (chat: Tables['chats']['Update']) => {
      const { error } = await supabase.from('chats').update(chat).eq('id', id);

      if (error) throw new Error(error.message);
    },
    {
      onError: (err: any) => {
        alert(err.message);
      },
    }
  );
  const summarisedVttMutation = useMutation(
    async (input: SummarizedVttType) => {
      const { vttText, nodsPageId } = input;
      // const response = await fetch('/api/openai/summarize-to-chapter', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     vttText,
      //   }),
      // });
      // const resp_summerize: string = await response.json();
      const resp_summerize = (await api_call_post(
        '/api/openai/summarize-to-chapter',
        JSON.stringify({
          vttText,
        })
      )) as string;
      const blob = new Blob([resp_summerize], { type: 'text/vtt' });
      const file = new File([blob], 'text.vtt', { type: 'text/vtt' });
      useMutateUploadVtt.mutate({ files: [file], nodsPageId });
      return vttText;
    },
    {
      onError: (err: any) => {
        alert(err.message);
      },
    }
  );

  const videoTitleMutation = useMutation(
    async (vttText: string) => {
      // const response = await fetch('/api/openai/generate-title', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     vttText,
      //   }),
      // });
      // const title: string = await response.json();
      const title = (await api_call_post(
        '/api/openai/generate-title',
        JSON.stringify({
          vttText,
        })
      )) as string;

      updateChatMutation.mutate({ title });
      setTitle(title);
    },
    {
      onError: (err: any) => {
        alert(err.message);
      },
    }
  );

  const compressSegmentsMutation = useMutation(
    async (input: compressSegmentsType) => {
      const { segments, nodsPageId } = input;
      const body = JSON.stringify({
        segments,
      });
      console.log(body);
      const resultList = (await api_call_post('/api/openai/generate-embeddings', body)) as Result[];
      console.log(resultList);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      resultList.forEach(async (result_) => {
        const row: Tables['nods_page_section']['Insert'] = {
          page_id: nodsPageId,
          content: result_.segment.text,
          embedding: result_.embedding as unknown as string,
          owner: user?.id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          segment: result_.segment as any,
        };
        await supabase.from('nods_page_section').insert(row).select().limit(1).single();
      });
      const vttText = convertToVTT(segments);
      return vttText;
    },
    {
      onError: (err: any) => {
        alert(err.message);
      },
    }
  );

  const transcriptMutation = useMutation(
    async (input: TranscriptType) => {
      const { file, nodsPageId } = input;
      const formData = await videoToAudio(file).then((data) => {
        return data;
      });
      // const response_transcript = await fetch(`/api/openai/whisper`, {
      //   method: 'POST',
      //   body: formData,
      // });
      // const transcript_data = await response_transcript.json();
      type wisperResponseBody = {
        task: string;
        segments: Segment[];
        duration: number;
        language: string;
        text: string;
      };

      const transcript_data = (await api_call_post_formdata(
        `/api/openai/whisper`,
        formData
      )) as wisperResponseBody;
      console.log(transcript_data);

      const segments = transcript_data?.segments.map((segment: any) => ({
        id: segment.id,
        start: segment.start,
        end: segment.end,
        text: segment.text,
        seek: segment.seek,
      }));
      updateNodsPageMutation.mutate({
        nods_page: {
          meta: transcript_data as unknown as Json,
        },
        nodsPageId,
      });
      return segments;
    },
    {
      onError: (err: any) => {
        alert(err.message);
      },
    }
  );

  return {
    transcriptMutation,
    compressSegmentsMutation,
    summarisedVttMutation,
    videoTitleMutation,
  };
};
