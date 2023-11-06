/* eslint-disable no-console */
import { LLMChain } from 'langchain/chains';
import { Tables } from '@/types/customSupabase';
import { PromptTemplate } from 'langchain';
import { OpenAI } from 'langchain/llms/openai';
import { defer } from '@defer/client';
import { Json } from '@/types/supabase';

const QA_PROMPT = `あなたは役立つAIアシスタントです。以下の「動画の内容」と「私(User)とあなた(AI)の会話履歴」を利用して、最後にある質問に回答してください。
質問に対しての解答のみを見やすさを重視したMarkdown形式で答えるようにして下さい。

{input}

Markdown形式の答え:`;

interface Question {
  chat: string | null;
  content: string | null;
  created_at: string | null;
  id: string;
  owner: string | null;
  role: string | null;
  suggestions: Json[] | null;
}

async function chat(history: Question[], question: Question, context: string) {
  // const { question, history, context } = req.body;

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
  console.log(`
    「動画の内容」
    ${context}
    
    「会話履歴」
    ${chat_history}
    
    「質問」: ${question.content}
    `);
  const result = await chain.call({
    input: `
「動画の内容」
${context}

「会話履歴」
${chat_history}

「質問」: ${question.content}
`,
  });
  console.log(result.text);
  return result.text;
}

export default defer(chat, {
  concurrency: 1,
  retry: 5,
});
