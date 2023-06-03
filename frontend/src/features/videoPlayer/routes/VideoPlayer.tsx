import 'vidstack/styles/defaults.css';

import { MediaOutlet, MediaPlayer } from '@vidstack/react';
import { Center } from '@mantine/core';

export const VideoPlayer = ({ src, title = 'test' }: { src: string; title?: string }) => {
  return (
    <Center w="100%" maw={700}>
      <MediaPlayer title={title} src={src} controls>
        <MediaOutlet />
      </MediaPlayer>
    </Center>
  );
};
