import 'vidstack/styles/defaults.css';

import { MediaOutlet, MediaPlayer } from '@vidstack/react';

import React from 'react';

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
    <MediaPlayer title={title} src={src} poster={poster} controls>
      {/* ^ remove `controls` attribute if you're designing a custom UI */}
      <MediaOutlet />
    </MediaPlayer>
  );
};
