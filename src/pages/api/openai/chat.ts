/* eslint-disable no-console */
import type { NextApiRequest, NextApiResponse } from 'next';
import { LLMChain } from 'langchain/chains';
import { Tables } from '@/types/customSupabase';
import { PromptTemplate } from 'langchain';
import { OpenAI } from 'langchain/llms/openai';
import chat from '../../../defer/chat';

const QA_PROMPT = `あなたは役立つAIアシスタントです。以下の「動画の内容」と「私(User)とあなた(AI)の会話履歴」を利用して、最後にある質問に回答してください。
質問に対しての解答のみを見やすさを重視したMarkdown形式で答えるようにして下さい。

{input}

Markdown形式の答え:`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { history, question, context } = req.body;
    const data = await chat(history, question, context);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    res.status(200).json(data);
  } catch (e: any) {
    console.log(e.message);
    res.status(500).json(e);
  }
}
