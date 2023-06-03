import 'vidstack/styles/defaults.css';

import {
  MediaGesture,
  MediaOutlet,
  MediaPlayButton,
  MediaPlayer,
  MediaSliderValue,
  MediaTimeSlider,
  MediaToggleButton,
} from '@vidstack/react';

import React, { useRef } from 'react';
import { MediaOutletElement, MediaPlayerElement } from 'vidstack';
import { Flex } from '@mantine/core';

export const VideoPlayer = ({
  src,
  title = 'test',
  poster = 'https://media-files.vidstack.io/poster.png',
  vttfile = '/sample.vtt',
}: {
  src: string;
  title?: string;
  poster?: string;
  vttfile?: string;
}) => {
  return (
    <MediaPlayer title={title} src={src} poster={poster}>
      <MediaOutlet>
        <track src={vttfile} srcLang="en-US" kind="chapters" default />
        <MediaPlayButton />
        <MediaTimeSlider>
          <div slot="preview">
            <span part="chapter-title">Capter Title</span>
            <MediaSliderValue type="pointer" format="time" />
          </div>
        </MediaTimeSlider>
      </MediaOutlet>
    </MediaPlayer>
  );
};
