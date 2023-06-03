/* eslint-disable no-console */
import type { NextApiRequest, NextApiResponse } from 'next';
import { LLMChain } from 'langchain/chains';
import { BufferWindowMemory, ChatMessageHistory } from 'langchain/memory';
import { Tables } from '@/types/customSupabase';
import { PromptTemplate } from 'langchain';
import { HumanChatMessage, AIChatMessage } from 'langchain/schema';
import { OpenAI } from 'langchain/llms/openai';

const CONDENSE_PROMPT = `以下の会話とフォローアップ質問が与えられた場合、それらを単独の質問に変換してください。
会話: {chat_history}
フォローアップ質問: {question}

単独の質問:`;

const QA_PROMPT = `あなたは役立つAIアシスタントです。以下の文脈の部分を使用して、最後にある質問に回答してください。
答えがわからない場合は、ただ「わからない」と言ってください。答えをでっち上げることはしないでください。
質問が文脈に関連していない場合は、文脈に関連してないと明言しつつ、一般的な正解を回答するようにして下さい。

{input}

Markdown形式の答え:`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { question, history, context } = req.body;

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
      inputVariables: ['input'],
      template: QA_PROMPT,
    });
    const chain = new LLMChain({ llm, prompt: qa_prompt });
    const result = await chain.call({
      input: `
    文脈: ${context}

    質問: ${condense_result.text}
    `,
    });
    res.status(200).json({ res: result.text });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log(e.message);
    res.status(500).json(e);
  }
}
