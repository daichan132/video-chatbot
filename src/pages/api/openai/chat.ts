/* eslint-disable no-console */
import type { NextApiRequest, NextApiResponse } from 'next';
import { LLMChain } from 'langchain/chains';
import { BufferWindowMemory, ChatMessageHistory } from 'langchain/memory';
import { Tables } from '@/types/customSupabase';
import { PromptTemplate } from 'langchain';
import { HumanChatMessage, AIChatMessage } from 'langchain/schema';
import { OpenAI } from 'langchain/llms/openai';

const CONDENSE_PROMPT = `あなたはAIアシスタントです。以下には私(Human)とあなた(AI)の「会話履歴」と、私からの「質問」が与えられています。
質問に関する「会話履歴」のみを抽出した新しい会話履歴と、「質問」を与えて下さい。「会話履歴」がない場合は「質問」だけ与えて下さい。「質問」は決して変更しないでください
「会話履歴」: {chat_history}
「質問」: {question}

新しい会話履歴と「質問」:`;

const QA_PROMPT = `あなたは役立つAIアシスタントです。以下の「動画の内容」と「私(Human)とあなた(AI)の会話履歴」を利用して、最後にある質問に回答してください。
見やすさを重視した最低限のMarkdown形式で回答して下さい。

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
    「動画の内容」: ${context}
    ${condense_result.text}
    `,
    });
    console.log(`
    「動画の内容」: ${context}
    ${condense_result.text}
    `);
    res.status(200).json({ res: result.text });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log(e.message);
    res.status(500).json(e);
  }
}
