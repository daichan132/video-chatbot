import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { Configuration, OpenAIApi } from 'openai';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Tables } from '@/types/customSupabase';
import { Database } from '@/types/supabase';

const sources = [
  'Japanese Prime Minister Fumio Kishida on May 21 touted the achievements of the Group of Seven summit in Hiroshima, saying the leaders from the advanced economies agreed to work toward a world without nuclear weapons and to stand by Ukraine.',
  'The three-day summit took place in Kishida’s home constituency, amid lingering fears that Russia may use a nuclear weapon in its ongoing war in Ukraine.',
  'On the closing day of the summit, Ukrainian President Volodymyr Zelenskyy participated in sessions to discuss Russia’s aggression following his highly publicized arrival May 20 on a French government plane.',
  '"It is the mission of Japan, the G7 presidency this year, to demonstrate resolve to preserving peace and prosperity,” Kishida said. “There is no place more suitable than Hiroshima, symbolizing the vow for peace, to convey such determination."',
  'The Hiroshima Vision on Nuclear Disarmament released May 19 affirmed the Nuclear Non-Proliferation Treaty as the “cornerstone” for disarmament.',
  'But critics said the G7 leaders did not elaborate on detailed plans to enhance disarmament and non-proliferation efforts, with the International Campaign to Abolish Nuclear Weapons, known as ICAN, lambasting them for failing to “announce anything new or concrete.” (Kyodo)',
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabaseServerClient = createPagesServerClient<Database>({
    req,
    res,
  });
  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser();

  const { page_id } = req.body;

  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    sources.forEach(async (content) => {
      const getEmbedding = async () => {
        const embeddingResponse = await openai.createEmbedding({
          model: 'text-embedding-ada-002',
          input: content,
        });
        return embeddingResponse.data;
      };
      const { data: emb_res_data } = await getEmbedding();
      const { embedding } = emb_res_data[0];
      console.log(embedding);

      const row: Tables['nods_page_section']['Insert'] = {
        page_id,
        content,
        embedding: embedding as unknown as string,
        owner: user?.id,
      };

      const { error, data: supabase_res_data } = await supabaseServerClient
        .from('nods_page_section')
        .insert(row)
        .select()
        .limit(1)
        .single();
      if (error) {
        throw error;
      }
    });
    res.status(200).json('complete generateing embeddings');
  } catch (e: any) {
    res.status(500).json(e);
  }
}
