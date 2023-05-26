import { useCallback, useEffect, useRef, useState } from 'react';
import { Message } from '../types';

export const useChatSocket = (url: string, chatId: string) => {
  const [inputText, setInputText] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([{ speakerId: 0, text: 'Hello!' }]);
  const [loading, setLoading] = useState(false);

  const addMessage = useCallback(
    (speakerId: number, text: string) => {
      setMessages((ms) => [...ms, { speakerId, text }]);
    },
    [setMessages]
  );

  const socketRef = useRef<WebSocket>();
  useEffect(() => {
    const websocket = new WebSocket(url);
    socketRef.current = websocket;

    const onMessage = (event: MessageEvent<string>) => {
      const text = JSON.parse(event.data).text ?? '';
      addMessage(0, text);
      setLoading(false);
    };
    websocket.addEventListener('message', onMessage);

    return () => {
      websocket.close();
      websocket.removeEventListener('message', onMessage);
    };
  }, [addMessage, url]);
  const onSubmit = useCallback(() => {
    setMessages((ms) => [...ms, { speakerId: 1, text: inputText }]);
    socketRef.current?.send(inputText);
    setInputText('');
    setLoading(true);
  }, [setInputText, inputText]);

  return { inputText, setInputText, messages, onSubmit, loading };
};
