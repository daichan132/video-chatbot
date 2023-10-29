import type { NextApiRequest, NextApiResponse } from 'next';
import generate_title from '../../../defer/generate-title';

export default async function handler(req: NextApiRequest, response: NextApiResponse) {
  try {
    const { vttText } = req.body;
    const data = await generate_title(vttText);
    response.status(200).json(data);
  } catch (err) {
    response.status(500).json(err);
  }
}
