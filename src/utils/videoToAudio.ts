import { ffmpeg } from '@/lib/ffmpeg';
import { fetchFile } from '@ffmpeg/ffmpeg';

const MAX_FILE_SIZE = 25000000;

export const videoToAudio = async (file: File) => {
  ffmpeg.FS('writeFile', file.name, await fetchFile(file));
  await ffmpeg.run(
    '-i',
    file.name,
    '-vn',
    '-ar',
    '16000',
    '-ac',
    '1',
    '-b:a',
    '96k',
    '-f',
    'mp3',
    'output.mp3'
  );
  const readData = ffmpeg.FS('readFile', 'output.mp3');
  const audioBlob = new Blob([readData.buffer], { type: 'audio/mp3' });
  if (audioBlob.size > MAX_FILE_SIZE) {
    throw new Error('too large data');
  }

  const audio_file = new File([audioBlob], 'audio.mp3', {
    type: audioBlob.type,
    lastModified: Date.now(),
  });
  const formData = new FormData();
  formData.append('file', audio_file);
  return formData;
};
