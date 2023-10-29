import { OpenAI } from 'openai';
import { defer } from '@defer/client';

interface Segment {
  id: number;
  start: number;
  end: number;
  text: string;
  // other fields omitted for simplicity
}

async function generate_embeddings(segments: Segment[]) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const getEmbedding = async (segment: Segment) => {
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: segment.text,
    });
    return embeddingResponse.data;
  };

  return Promise.all(
    segments.map(async (segment) => {
      const data = await getEmbedding(segment);
      const { embedding } = data[0];
      return { segment, embedding };
    })
  );
}

export default defer(generate_embeddings);
