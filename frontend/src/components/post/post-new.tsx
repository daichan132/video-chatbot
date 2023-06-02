import { useState, useEffect } from 'react';
// import { useSupabase } from '../supabase-provider';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { Container, FileInput, Text } from '@mantine/core';

const ffmpeg = createFFmpeg({
  corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js',
  log: true,
});
const MAX_FILE_SIZE = 25000000;

const PostNew = () => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const load = async () => {
      await ffmpeg.load();
    };
    if (!ffmpeg.isLoaded()) {
      load();
    }
  }, []);

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
      // postsテーブル追加
      // const { data: insertData, error: insertError } = await supabase
      //   .from('posts')
      //   .insert({
      //     prompt: transcript,
      //     content,
      //   })
      //   .select();

      // if (insertError) {
      //   alert(insertError.message);
      //   setLoading(false);
      //   return;
      // }
    } catch (error) {
      console.warn(error);
    }
    setLoading(false);
  };

  const [file, setValue] = useState<File | null>(null);
  return (
    <Container w="100%" pt={200}>
      <FileInput
        value={file}
        onChange={(value) => {
          setValue(value);
          if (value) {
            handleChange(value);
          }
        }}
        placeholder="Upload videos"
      />
      {file && (
        <Text size="sm" align="center" mt="sm">
          Picked file: {file.name}
        </Text>
      )}
      {loading && <div>loading</div>}
    </Container>
  );
};

export default PostNew;
