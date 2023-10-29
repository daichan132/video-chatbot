import type { NextApiRequest, NextApiResponse } from 'next';
import summarize_to_chapter from '../../../defer/summarize-to-chapter';

export default async function handler(req: NextApiRequest, response: NextApiResponse) {
  try {
    const { vttText } = req.body;
    const data = await summarize_to_chapter(vttText);
    response.status(200).json(data);
  } catch (err) {
    response.status(500).json(err);
  }
}
