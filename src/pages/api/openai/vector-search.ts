import type { NextApiRequest, NextApiResponse } from 'next';
import vector_search from '../../../defer/vector-search';

// deferを用いて、実行IDのみ最初に返してバックグラウンド実行
// 結果を取得するには/api/openai/[executionId]のエンドポイントにポーリング
export default async function handler(req: NextApiRequest, response: NextApiResponse) {
  const { question } = req.body;
  const data = await vector_search(question);
  response.status(200).json(data);
}
