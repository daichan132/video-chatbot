import type { NextApiRequest, NextApiResponse } from 'next';
import GPT3Tokenizer from 'gpt3-tokenizer';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { Configuration, OpenAIApi } from 'openai';

export default async function handler(req: NextApiRequest, response: NextApiResponse) {
  const supabaseServerClient = createPagesServerClient<Database>({
    req,
    res: response,
  });
  const { page_id, question } = req.body;
  try {
    const sanitizedQuery = question.trim();

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const getEmbedding = async (content: string) => {
      const embeddingResponse = await openai.createEmbedding({
        model: 'text-embedding-ada-002',
        input: content,
      });
      return embeddingResponse.data;
    };

    const { data: emb_res_data } = await getEmbedding(question);
    const { embedding } = emb_res_data[0];
    console.log(embedding);

    const { error: matchError, data: pageSections } = await supabaseServerClient.rpc(
      'match_page_sections',
      {
        embedding: embedding as unknown as string,
        match_threshold: 0.78,
        match_count: 2,
        min_content_length: 5,
        page_id_in: page_id as number,
      }
    );
    console.log(pageSections);

    const tokenizer = new GPT3Tokenizer({ type: 'gpt3' });
    let tokenCount = 0;
    let contextText = '';

    if (pageSections == null) {
      throw new Error('pageSections is null');
    }
    for (let i = 0; i < pageSections.length; i += 1) {
      const { segment } = pageSections[i];
      if (segment) {
        const { text } = segment;
        const encoded = tokenizer.encode(content);
        tokenCount += encoded.text.length;

        if (tokenCount >= 1500) {
          break;
        }

        contextText += `${content.trim()}\n---\n`;
      }
    }
    response.status(200).json(contextText);
  } catch (err) {
    response.status(500).json(err);
  }
}
