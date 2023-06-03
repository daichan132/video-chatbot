/* eslint-disable no-console */
import { useEffect } from 'react';
import { Container, Text } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { useUploadVideo } from '../hooks/useUploadVideo';
import { useMutateNodsPage } from '../hooks/useMutateNodsPage';

export const VideoPost = ({ chatId, refetch }: { chatId: string; refetch: () => void }) => {
  const { useMutateUploadVideo } = useUploadVideo();
  const { transcriptMutation } = useMutateNodsPage();
  useEffect(() => {
    if (useMutateUploadVideo.isSuccess) {
      refetch();
    }
  }, [refetch, useMutateUploadVideo.isSuccess]);

  // const handleClick = async (page_id: number) => {
  //   const response = await fetch('/api/openai/generate-embeddings', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       page_id,
  //     }),
  //   });
  //   const data = await response.json();
  //   console.log(data);
  // };

  return (
    <Container w="100%">
      <Dropzone
        onDrop={(value) => {
          if (value.length) {
            useMutateUploadVideo.mutate({ files: [value[0]], chatId });
            transcriptMutation.mutate({ file: value[0], chatId });
          }
        }}
        loading={useMutateUploadVideo.isLoading}
      >
        <Text align="center">Drop video here</Text>
      </Dropzone>
    </Container>
  );
};
