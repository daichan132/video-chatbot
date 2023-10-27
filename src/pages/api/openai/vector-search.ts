import type { NextApiRequest, NextApiResponse } from 'next';
import GPT3Tokenizer from 'gpt3-tokenizer';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { Database, Json } from '@/types/supabase';
import { OpenAI } from 'openai';
import { Segment } from '@/types/customSupabase';

export default async function handler(req: NextApiRequest, response: NextApiResponse) {
  const supabaseServerClient = createPagesServerClient<Database>({
    req,
    res: response,
  });
  const { page_id, question } = req.body;
  try {
    const sanitizedQuery = question.trim();

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const getEmbedding = async (content: string) => {
      const embeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: content,
      });
      return embeddingResponse.data;
    };

    const data = await getEmbedding(sanitizedQuery);
    const { embedding } = data[0];

    const { data: pageSections } = await supabaseServerClient.rpc('match_page_sections', {
      embedding: embedding as unknown as string,
      match_threshold: 0.78,
      match_count: 10,
      min_content_length: 5,
      page_id_in: page_id as number,
    });

    const tokenizer = new GPT3Tokenizer({ type: 'gpt3' });
    let tokenCount = 0;
    let contextText = '';

    if (pageSections == null) {
      throw new Error('pageSections is null');
    }

    const resultList: {
      id: number;
      page_id: number;
      segment: Json;
      similarity: number;
    }[] = [];

    for (let i = 0; i < pageSections.length; i += 1) {
      const { segment } = pageSections[i];
      resultList.push(pageSections[i]);
      if (segment) {
        const { text } = segment as unknown as Segment; // TODO:fix type
        const encoded = tokenizer.encode(text);
        tokenCount += encoded.text.length;
        if (tokenCount >= 1500) {
          break;
        }

        contextText += `${text.trim()}\n---\n`;
      }
    }
    response.status(200).json({ contextText, resultList });
  } catch (err) {
    response.status(500).json(err);
  }
}
