/* eslint-disable no-console */
import type { NextApiRequest, NextApiResponse } from 'next';
import { LLMChain } from 'langchain/chains';
import { BufferWindowMemory, ChatMessageHistory } from 'langchain/memory';
import { Tables } from '@/types/customSupabase';
import { PromptTemplate } from 'langchain';
import { HumanChatMessage, AIChatMessage } from 'langchain/schema';
import { OpenAI } from 'langchain/llms/openai';

const QA_PROMPT = `あなたは役に立つAIアシスタントです。以下では会話履歴と質問が渡されます。最後の質問に答えてください。

会話履歴：{chat_history}
質問：{question}

マークダウン形式での回答：`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { question, history } = req.body;

  try {
    const llm = new OpenAI({ temperature: 0.8, modelName: 'gpt-3.5-turbo' });

    const pastMessages = history.map((m: Tables['messages']['Row']) => {
      if (m.role === 'user') {
        return new HumanChatMessage(m.content as string);
      }
      return new AIChatMessage(m.content as string);
    });
    const memory = new BufferWindowMemory({
      k: 5,
      chatHistory: new ChatMessageHistory(pastMessages),
      memoryKey: 'chat_history',
    });
    const qa_prompt = new PromptTemplate({
      inputVariables: ['chat_history', 'question'],
      template: QA_PROMPT,
    });
    const chain = new LLMChain({
      llm,
      prompt: qa_prompt,
      memory,
    });
    const result = await chain.call({ question: question.content });
    console.log(result);
    res.status(200).json({ res: result.text });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    res.status(500).json(e);
  }
}
