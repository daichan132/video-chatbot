import { getExecution } from '@defer/client';
import type { NextApiRequest, NextApiResponse } from 'next';

// 長い非同期処理は実行IDを指定してポーリング
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const executionId = req.query.id;
  const ret = await getExecution(executionId as string);
  res.status(200).json({ res: ret });
};

export default handler;
