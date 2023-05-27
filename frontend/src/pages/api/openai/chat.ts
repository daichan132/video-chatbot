import { supabase } from '@/lib/supabase';
import { OpenAIStream } from '@/utils/openaiStream';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const payload = req.body;
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // only accept post requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
  }
  if (!session) {
    res.status(401).json({ error: 'Not authorized!' });
  }
  const stream = await OpenAIStream(payload);
  res.status(200).json(stream);
}
