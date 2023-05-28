import type { NextApiRequest, NextApiResponse } from 'next';
import { LLMChain } from 'langchain/chains';
import { OpenAI, PromptTemplate } from 'langchain';
import { BufferMemory } from 'langchain/memory';

const template = `あなたは役に立つAIアシスタントです。最後の質問に答えてください。
答えがわからない場合は、「わからない」と答えてください。答えをでっち上げないでください。

{chat_history}

質問：{input}
マークダウン形式での役に立つ回答：`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { question, history } = req.body;

  try {
    const llm = new OpenAI({ temperature: 0.9 });
    const memory = new BufferMemory();

    const prompt = new PromptTemplate({
      inputVariables: ['chat_history', 'question'],
      template,
    });
    const chain = new LLMChain({ llm, prompt, memory });

    const result = await chain.call({ input: question, chat_history: history });
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e);
  }
}
