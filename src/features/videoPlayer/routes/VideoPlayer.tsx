import 'vidstack/styles/defaults.css';

import {
  MediaMenuButton,
  MediaOutlet,
  MediaPlayer,
  ChaptersIcon,
  MediaChaptersMenuItems,
  MediaMenu,
} from '@vidstack/react';
import { Box, Flex, Tooltip } from '@mantine/core';

export const VideoPlayer = ({
  src,
  title = 'test',
  poster = '',
  vttfile = '',
}: {
  src: string;
  title?: string;
  poster?: string;
  vttfile?: string;
}) => {
  return (
    <MediaPlayer
      title={title}
      src={src}
      poster={poster}
      crossorigin="anonymous"
      controls
      aspect-ratio={16 / 9}
      style={{ borderRadius: 10, overflow: 'hidden' }}
    >
      <MediaOutlet>
        <track src={vttfile} srcLang="en-US" kind="chapters" default />
      </MediaOutlet>
      <Box sx={{ position: 'absolute', zIndex: 1, inset: 0, pointerEvents: 'none' }}>
        <Flex sx={{ pointerEvents: 'auto' }} justify="end">
          <MediaMenu position="bottom right">
            <Tooltip label="Chapter">
              <MediaMenuButton aria-label="Chapters">
                <ChaptersIcon />
              </MediaMenuButton>
            </Tooltip>
            <MediaChaptersMenuItems />
          </MediaMenu>
        </Flex>
      </Box>
    </MediaPlayer>
  );
};
