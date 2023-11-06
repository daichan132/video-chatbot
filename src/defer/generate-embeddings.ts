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
  console.log(segments);
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const getEmbedding = async (segment: Segment) => {
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: segment.text,
    });
    return embeddingResponse.data;
  };

  const res = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const segment of segments) {
    console.log(segment);
    // eslint-disable-next-line no-await-in-loop
    const data = await getEmbedding(segment);
    const { embedding } = data[0];
    console.log(embedding);
    res.push({ segment, embedding });
  }
  return res;
}

export default defer(generate_embeddings, {
  concurrency: 1,
  retry: 5,
});
