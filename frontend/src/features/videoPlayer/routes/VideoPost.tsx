/* eslint-disable no-console */
import { useEffect } from 'react';
import { Container, Text } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { useUploadVideo } from '../hooks/useUploadVideo';
import { useMutateHandler } from '../hooks/useMutateHandler';

export const VideoPost = ({ nodsPageId, refetch }: { nodsPageId: number; refetch: () => void }) => {
  const { useMutateUploadVideo } = useUploadVideo();
  const { transcriptMutation, summarisedVttMutation } = useMutateHandler();
  useEffect(() => {
    if (
      useMutateUploadVideo.isSuccess &&
      transcriptMutation.isSuccess &&
      summarisedVttMutation.isSuccess
    ) {
      refetch();
    }
  }, [
    refetch,
    useMutateUploadVideo.isSuccess,
    transcriptMutation.isSuccess,
    summarisedVttMutation.isSuccess,
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
        loading={
          useMutateUploadVideo.isLoading ||
          transcriptMutation.isLoading ||
          summarisedVttMutation.isLoading
        }
      >
        <Text align="center">Drop video here</Text>
      </Dropzone>
    </Container>
  );
};
