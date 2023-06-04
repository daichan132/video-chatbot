import { v4 as uuidv4 } from 'uuid';
import { Tables } from '@/types/customSupabase';
import { useState } from 'react';
import { useMutateMessage } from './useMutateMessage';

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
      // similar text data
      const res_vector_search = await fetch('/api/openai/vector-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page_id,
          question: newMessage.content,
        }),
      });
      const { contextText, resultList } = await res_vector_search.json();
      const response = await fetch('/api/openai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          history: messages,
          question: newMessage,
          context: contextText,
        }),
      });
      const data = await response.json();
      const suggestionList = [];
      for (let i = 0; i < resultList.length; i += 1) {
        if (resultList[i].similarity > 0.8)
          suggestionList.push({
            start: formatSecondsToHMS(resultList[i].segment.start),
            end: formatSecondsToHMS(resultList[i].segment.end),
            text: resultList[i].segment.text,
          });
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
    } catch (e: any) {
      console.warn(e.message);
    }
  };
  return { inputText, setInputText, messages, addMessageFunc, suggestions };
};
