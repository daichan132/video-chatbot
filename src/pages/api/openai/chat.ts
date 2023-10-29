/* eslint-disable no-console */
import type { NextApiRequest, NextApiResponse } from 'next';
import chat from '../../../defer/chat';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { history, question, context } = req.body;
    const data = await chat(history, question, context);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
}
