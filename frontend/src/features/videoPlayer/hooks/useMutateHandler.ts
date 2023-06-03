/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from 'react-query';
import { convertToVTT } from '@/utils/convertToVTT';
import { videoToAudio } from '@/utils/videoToAudio';
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

export const useMutateHandler = () => {
  const { useMutateUploadVtt } = useUploadVtt();
  const { updateNodsPageMutation } = useMutateNodsPage();

  const summarisedVttMutation = useMutation(
    async (input: SummarizedVttType) => {
      const { vttText, nodsPageId } = input;
      const response = await fetch('/api/openai/summarize-to-chapter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vttText,
        }),
      });
      const resp_summerize: string = await response.json();
      const blob = new Blob([resp_summerize], { type: 'text/vtt' });
      const file = new File([blob], 'text.vtt', { type: 'text/vtt' });
      useMutateUploadVtt.mutate({ files: [file], nodsPageId });
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
      summarisedVttMutation.mutate({ vttText, nodsPageId });

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

  return { transcriptMutation };
};
