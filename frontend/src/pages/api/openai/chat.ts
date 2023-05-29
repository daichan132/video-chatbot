/* eslint-disable no-console */
import type { NextApiRequest, NextApiResponse } from 'next';
import { LLMChain } from 'langchain/chains';
import { BufferWindowMemory, ChatMessageHistory } from 'langchain/memory';
import { Tables } from '@/types/customSupabase';
import { PromptTemplate } from 'langchain';
import { HumanChatMessage, AIChatMessage } from 'langchain/schema';
import { OpenAI } from 'langchain/llms/openai';

const CONDENSE_PROMPT = `以下の会話とフォローアップ質問が与えられた場合、それらを単独の命令文に変換してください。
会話: {chat_history}
フォローアップ質問: {question}

単独の命令文:`;

const QA_PROMPT = `あなたは役立つAIアシスタントです。以下の質問にMarkdown形式で答えてください。
質問: {question}

Markdown形式の役立つ答え:`;

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
    const condense_memory = new BufferWindowMemory({
      k: 5,
      chatHistory: new ChatMessageHistory(pastMessages),
      memoryKey: 'chat_history',
    });
    const condense_prompt = new PromptTemplate({
      inputVariables: ['chat_history', 'question'],
      template: CONDENSE_PROMPT,
    });
    const condense_chain = new LLMChain({
      llm,
      prompt: condense_prompt,
      memory: condense_memory,
    });
    const condense_result = await condense_chain.call({ question: question.content });

    console.log(condense_result);
    const qa_prompt = new PromptTemplate({
      inputVariables: ['question'],
      template: QA_PROMPT,
    });
    const chain = new LLMChain({ llm, prompt: qa_prompt });
    const result = await chain.call({ question: condense_result.text });
    console.log(result);
    res.status(200).json({ res: result.text });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    res.status(500).json(e);
  }
}
