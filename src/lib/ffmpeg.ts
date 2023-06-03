import { createFFmpeg } from '@ffmpeg/ffmpeg';

export const ffmpeg = createFFmpeg({
  corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js',
  log: true,
});
