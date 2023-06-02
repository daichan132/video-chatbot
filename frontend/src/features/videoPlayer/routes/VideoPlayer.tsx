import 'vidstack/styles/defaults.css';

import { MediaOutlet, MediaPlayer } from '@vidstack/react';
import { Center } from '@mantine/core';

export const VideoPlayer = ({
  src,
  title = 'test',
  poster = 'https://media-files.vidstack.io/poster.png',
}: {
  src: string;
  title?: string;
  poster?: string;
}) => {
  return (
    <Center w="100%" maw={700}>
      <MediaPlayer title={title} src={src} poster={poster} controls>
        <MediaOutlet />
      </MediaPlayer>
    </Center>
  );
};
