/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import { useEffect } from 'react';
import { Container, Text } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { useUploadVideo } from '../hooks/useUploadVideo';
import { useMutateHandler } from '../hooks/useMutateHandler';

export const VideoPost = ({ nodsPageId, refetch }: { nodsPageId: number; refetch: () => void }) => {
  const { useMutateUploadVideo } = useUploadVideo();
  const {
    transcriptMutation,
    compressSegmentsMutation,
    summarisedVttMutation,
    videoTitleMutation,
  } = useMutateHandler();
  const loading =
    useMutateUploadVideo.isLoading ||
    transcriptMutation.isLoading ||
    compressSegmentsMutation.isLoading;

  useEffect(() => {
    if (!transcriptMutation.isSuccess) return;
    const segments = transcriptMutation.data;
    console.log(segments);
    console.log('compressSegmentsMutaion called');
    compressSegmentsMutation.mutate({ segments, nodsPageId });
  }, [transcriptMutation.isSuccess]);

  useEffect(() => {
    if (!compressSegmentsMutation.isSuccess) return;
    const vttText = compressSegmentsMutation.data;
    summarisedVttMutation.mutate({ vttText, nodsPageId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compressSegmentsMutation.isSuccess]);

  useEffect(() => {
    if (!summarisedVttMutation.isSuccess) return;
    const vttText = summarisedVttMutation.data;
    videoTitleMutation.mutate(vttText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summarisedVttMutation.isSuccess]);

  useEffect(() => {
    if (
      useMutateUploadVideo.isSuccess &&
      transcriptMutation.isSuccess &&
      compressSegmentsMutation.isSuccess &&
      !loading
    ) {
      refetch();
    }
  }, [
    refetch,
    useMutateUploadVideo.isSuccess,
    transcriptMutation.isSuccess,
    compressSegmentsMutation.isSuccess,
    loading,
  ]);

  return (
    <Container w="100%">
      <Dropzone
        onDrop={(value) => {
          if (value.length) {
            useMutateUploadVideo.mutate({ files: [value[0]], nodsPageId });
            transcriptMutation.mutate({ file: value[0], nodsPageId });
          }
        }}
        loading={loading}
      >
        <Text align="center">Drop video here</Text>
      </Dropzone>
    </Container>
  );
};
