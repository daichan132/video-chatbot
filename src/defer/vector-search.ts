import type { NextApiRequest, NextApiResponse } from 'next';
import GPT3Tokenizer from 'gpt3-tokenizer';
import { SupabaseClient, createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { Database, Json } from '@/types/supabase';
import { OpenAI } from 'openai';
import { defer } from '@defer/client';

// openai APIを用いた長い非同期処理
async function vector_search(question: string) {
  const sanitizedQuery = question.trim();
  console.log('serverless funcation called');

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const getEmbedding = async (content: string) => {
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: content,
    });
    return embeddingResponse.data;
  };

  const data = await getEmbedding(sanitizedQuery);
  const { embedding } = data[0];
  return embedding;
}

export default defer(vector_search);
