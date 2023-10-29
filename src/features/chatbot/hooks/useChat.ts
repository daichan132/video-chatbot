import { v4 as uuidv4 } from 'uuid';
import { Tables, Segment } from '@/types/customSupabase';
import { useState } from 'react';
import GPT3Tokenizer from 'gpt3-tokenizer';
import { supabase } from '@/lib/supabase';
import { Json } from '@/types/supabase';
import OpenAI from 'openai';
import { useMutateMessage } from './useMutateMessage';
import { api_call_post } from '../../../lib/apicall';

export type SuggestionType = {
  start: string;
  end: string;
  text: string;
};
function formatSecondsToHMS(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const hoursStr = hours.toString().padStart(2, '0');
  const minutesStr = minutes.toString().padStart(2, '0');
  const secondsStr = remainingSeconds.toString().padStart(2, '0');

  if (hoursStr === '00') {
    return `${minutesStr}:${secondsStr}`;
  }
  return `${hoursStr}:${minutesStr}:${secondsStr}`;
}

export const useChat = (
  currentChat: Tables['chats']['Row'],
  initialMessages: Tables['messages']['Row'][],
  page_id: number | undefined
) => {
  const [inputText, setInputText] = useState<string>('');
  const [messages, setMessages] = useState<Tables['messages']['Row'][]>(initialMessages);
  const { addMessageMutation } = useMutateMessage();
  const [suggestions, setSuggestions] = useState<SuggestionType[]>([]);

  const addMessageFunc = async () => {
    const newMessage: Tables['messages']['Row'] = {
      content: inputText,
      role: 'user',
      chat: currentChat.id,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      owner: currentChat.owner,
      suggestions: null,
    };
    setMessages((prev) => [...prev, newMessage]);
    addMessageMutation.mutate([newMessage]);
    try {
      const embedding = (await api_call_post(
        '/api/openai/vector-search',
        JSON.stringify({
          question: newMessage.content,
        })
      )) as OpenAI.Embeddings.Embedding[];

      const { data: pageSections } = await supabase.rpc('match_page_sections', {
        embedding: embedding as unknown as string,
        match_threshold: 0.78,
        match_count: 10,
        min_content_length: 5,
        page_id_in: page_id as number,
      });

      const tokenizer = new GPT3Tokenizer({ type: 'gpt3' });
      let tokenCount = 0;
      let contextText = '';
      // const contextText = '';

      if (pageSections == null) {
        throw new Error('pageSections is null');
      }

      const resultList: {
        id: number;
        page_id: number;
        segment: Json;
        similarity: number;
      }[] = [];

      for (let i = 0; i < pageSections.length; i += 1) {
        const { segment } = pageSections[i];
        resultList.push(pageSections[i]);
        if (segment) {
          const { text } = segment as unknown as Segment; // TODO:fix type
          const encoded = tokenizer.encode(text);
          tokenCount += encoded.text.length;
          if (tokenCount >= 1500) {
            break;
          }

          contextText += `${text.trim()}\n---\n`;
        }
      }

      const data = await api_call_post(
        '/api/openai/chat',
        JSON.stringify({
          history: messages,
          question: newMessage,
          context: contextText,
        })
      );

      const suggestionList = [];
      for (let i = 0; i < resultList.length; i += 1) {
        if (resultList[i].similarity > 0.8) {
          if (resultList[i].segment) {
            suggestionList.push({
              start: formatSecondsToHMS(resultList[i].segment?.start),
              end: formatSecondsToHMS(resultList[i].segment?.end),
              text: resultList[i].segment?.text,
            });
          }
        }
      }
      setSuggestions(suggestionList);
      const resMessage: Tables['messages']['Row'] = {
        content: [data.res].join('\n'),
        role: 'system',
        chat: currentChat.id,
        id: uuidv4(),
        created_at: new Date().toISOString(),
        owner: currentChat.owner,
        suggestions: resultList, // TODO: テーブル再定義（質問の根拠になる動画の箇所をsuggest）
      };
      setMessages((prev) => [...prev, resMessage]);
      addMessageMutation.mutate([resMessage]);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else if (typeof error === 'string') {
        console.log(error);
      } else {
        console.log('unexpected error');
      }
    }
  };
  return { inputText, setInputText, messages, addMessageFunc, suggestions };
};
