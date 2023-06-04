/* eslint-disable no-console */
import type { NextApiRequest, NextApiResponse } from 'next';
import { LLMChain } from 'langchain/chains';
import { Tables } from '@/types/customSupabase';
import { PromptTemplate } from 'langchain';
import { OpenAI } from 'langchain/llms/openai';

const QA_PROMPT = `あなたは役立つAIアシスタントです。以下の「動画の内容」と「私(User)とあなた(AI)の会話履歴」を利用して、最後にある質問に回答してください。
質問に対しての解答のみを見やすさを重視したMarkdown形式で答えるようにして下さい。

{input}

Markdown形式の答え:`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { question, history, context } = req.body;

  try {
    const llm = new OpenAI({ temperature: 0.8, modelName: 'gpt-3.5-turbo' });

    const pastMessages = history.map((m: Tables['messages']['Row']) => {
      if (m.role === 'user') {
        return `User: ${m.content}`;
      }
      return `AI: ${m.content}`;
    });

    const chat_history = pastMessages.slice(-3).join('\n-----\n');
    const qa_prompt = new PromptTemplate({
      inputVariables: ['input'],
      template: QA_PROMPT,
    });
    const chain = new LLMChain({ llm, prompt: qa_prompt });
    const result = await chain.call({
      input: `
「動画の内容」
${context}

「会話履歴」
${chat_history}

「質問」: ${question.content}
`,
    });
    console.log(`
「動画の内容」
${context}

「会話履歴」
${chat_history}

「質問」: ${question.content}
`);
    res.status(200).json({ res: result.text });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log(e.message);
    res.status(500).json(e);
  }
}
