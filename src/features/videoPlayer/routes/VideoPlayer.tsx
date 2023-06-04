import 'vidstack/styles/defaults.css';

import {
  MediaMenuButton,
  MediaOutlet,
  MediaPlayer,
  ChaptersIcon,
  MediaChaptersMenuItems,
  MediaMenu,
} from '@vidstack/react';
import { Box, Flex } from '@mantine/core';

export const VideoPlayer = ({
  src,
  title = 'test',
  poster = '',
  vttfile = '/sample.vtt',
}: {
  src: string;
  title?: string;
  poster?: string;
  vttfile?: string;
}) => {
  return (
    <MediaPlayer title={title} src={src} poster={poster} crossorigin="anonymous" controls>
      <MediaOutlet>
        <track src={vttfile} srcLang="en-US" kind="chapters" default />
      </MediaOutlet>
      <Box sx={{ position: 'absolute', zIndex: 1, inset: 0, pointerEvents: 'none' }}>
        <Flex sx={{ pointerEvents: 'auto' }}>
          <MediaMenu position="bottom left">
            <MediaMenuButton aria-label="Chapters">
              <ChaptersIcon />
            </MediaMenuButton>
            <MediaChaptersMenuItems />
          </MediaMenu>
        </Flex>
      </Box>
    </MediaPlayer>
  );
};
