import { createStyles } from '@mantine/core';
import { shallow } from 'zustand/shallow';
import { useState } from 'react';
import { Tables } from '@/types/customSupabase';
import { ChatDialog } from '../components/ChatDialog';
import { ChatTextInput } from '../components/ChatTextInput';
import { useChat } from '../hooks/useChat';
import useChatStore from '../store/chatStore';

const useStyles = createStyles(() => ({
  viewHeight: { height: '100vh', width: '100%', overflow: 'hidden' },
  container: { position: 'relative', height: '100%', width: '100%' },
}));

export const Chatbot = () => {
  const { classes } = useStyles();
  // const { inputText, setInputText, messages, onSubmit, loading } = useChatSocket(
  //   'ws://localhost:8000/chat'
  // );
  const [inputText, setInputText] = useState<string>('');
  const messages: Tables['messages']['Row'][] = [];
  const loading = false;
  const id = useChatStore((state) => state.id, shallow);
  const { addMessage } = useChat(inputText);

  return (
    <div className={classes.viewHeight}>
      <div className={classes.container}>
        <div>{id}</div>
        <ChatDialog messages={messages} />
        <ChatTextInput
          inputText={inputText}
          setInputText={setInputText}
          onSubmit={() => {
            addMessage();
          }}
          loading={loading}
        />
      </div>
    </div>
  );
};
