import { useState } from 'react';
import { shallow } from 'zustand/shallow';
import { v4 as uuidv4 } from 'uuid';
import { Tables } from '@/types/customSupabase';
import useChatStore from '../store/chatStore';
import { useMutateMessage } from './useMutateMessage';

export const useChat = (inputText: string) => {
  const chatId = useChatStore((state) => state.id, shallow);
  const messages = useChatStore((state) => state.messages, shallow);
  const model = useChatStore((state) => state.model, shallow);
  const system_prompt = useChatStore((state) => state.system_prompt, shallow);
  const owner = useChatStore((state) => state.owner, shallow);

  const newMessage: Tables['messages']['Row'] = {
    content: inputText,
    role: 'user',
    chat: chatId,
    id: uuidv4(),
    created_at: String(new Date()),
    owner,
  };
  const { addMessageMutation } = useMutateMessage();

  const addMessage = async () => {
    try {
      const response = await fetch('/api/openai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          history: messages,
          newMessage,
        }),
      });
    } catch {
      console.log();
    }
  };
  return { addMessage };
};
