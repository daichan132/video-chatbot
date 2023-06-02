import { useState } from 'react';
// import { useSupabase } from '../supabase-provider';
import { fetchFile } from '@ffmpeg/ffmpeg';
import { Container, FileInput, Text } from '@mantine/core';
import { ffmpeg } from '@/lib/ffmpeg';
import { Dropzone } from '@mantine/dropzone';
import { VideoPlayer } from './VideoPlayer';

const MAX_FILE_SIZE = 25000000;

export const VideoPost = () => {
  const [loading, setLoading] = useState(false);

  const handleChange = async (file: File) => {
    setLoading(true);
    try {
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
        setLoading(false);
        return;
      }

      const audio_file = new File([audioBlob], 'audio.mp3', {
        type: audioBlob.type,
        lastModified: Date.now(),
      });
      const formData = new FormData();
      formData.append('file', audio_file);
      const response = await fetch(`/api/openai/whisper`, {
        method: 'POST',
        body: formData,
      });
      const response_data = await response.json();
      const transcript = response_data.transcript.trim();
      console.log(transcript);
    } catch (error) {
      console.warn(error);
    }
    setLoading(false);
  };

  const [file, setValue] = useState<File | null>(null);
  return (
    <Container w="100%">
      <Dropzone
        onDrop={(value) => {
          if (value.length) {
            setValue(value[0]);
            handleChange(value[0]);
          }
        }}
      >
        <Text align="center">Drop video here</Text>
      </Dropzone>
      {file && <VideoPlayer src={URL.createObjectURL(file)} />}
      {loading && <div>loading</div>}
    </Container>
  );
};
