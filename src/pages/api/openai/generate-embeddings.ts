import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { OpenAI } from 'openai';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Tables } from '@/types/customSupabase';
import { Database } from '@/types/supabase';

interface Segment {
  id: number;
  start: number;
  end: number;
  text: string;
  // other fields omitted for simplicity
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabaseServerClient = createPagesServerClient<Database>({
    req,
    res,
  });
  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser();

  const { page_id, segments } = req.body;

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    segments.forEach(async (segment: Segment) => {
      const getEmbedding = async () => {
        const embeddingResponse = await openai.embeddings.create({
          model: 'text-embedding-ada-002',
          input: segment.text,
        });
        return embeddingResponse.data;
      };
      const data = await getEmbedding();
      const { embedding } = data[0];

      const row: Tables['nods_page_section']['Insert'] = {
        page_id,
        content: segment.text,
        embedding: embedding as unknown as string,
        owner: user?.id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        segment: segment as any,
      };

      const { error } = await supabaseServerClient
        .from('nods_page_section')
        .insert(row)
        .select()
        .limit(1)
        .single();
      if (error) {
        throw error;
      }
    });
    res.status(200).json({ text: 'completed' });
  } catch (e) {
    res.status(500).json(e);
  }
}
