import { v4 as uuidv4 } from 'uuid';
import { Tables } from '@/types/customSupabase';
import { useState } from 'react';
import { useMutateMessage } from './useMutateMessage';

export const useChat = (
  currentChat: Tables['chats']['Row'],
  initialMessages: Tables['messages']['Row'][]
) => {
  const [inputText, setInputText] = useState<string>('');
  const [messages, setMessages] = useState<Tables['messages']['Row'][]>(initialMessages);
  const { addMessageMutation } = useMutateMessage();

  const addMessageFunc = async () => {
    const newMessage: Tables['messages']['Row'] = {
      content: inputText,
      role: 'user',
      chat: currentChat.id,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      owner: currentChat.owner,
    };
    setMessages((prev) => [...prev, newMessage]);
    addMessageMutation.mutate([newMessage]);
    try {
      const response = await fetch('/api/openai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          history: messages,
          question: newMessage,
        }),
      });
      const data = await response.json();

      const resMessage: Tables['messages']['Row'] = {
        content: data.res,
        role: 'system',
        chat: currentChat.id,
        id: uuidv4(),
        created_at: new Date().toISOString(),
        owner: currentChat.owner,
      };
      setMessages((prev) => [...prev, resMessage]);
      addMessageMutation.mutate([resMessage]);
    } catch (e: any) {
      console.warn(e.message);
    }
  };
  return { inputText, setInputText, messages, addMessageFunc };
};
