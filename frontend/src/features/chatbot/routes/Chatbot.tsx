import { createStyles } from '@mantine/core';
import { Tables } from 'src/types/customSupabase';
import { useChatSocket } from '../hooks/useChatSocket';
import { ChatDialog } from '../components/ChatDialog';
import { ChatTextInput } from '../components/ChatTextInput';

const useStyles = createStyles(() => ({
  viewHeight: { height: '100vh', width: '100%', overflow: 'hidden' },
  container: { position: 'relative', height: '100%', width: '100%' },
}));

type ChatbotType = {
  currentChat: Tables['chats']['Row'];
  initialMessages: Tables['messages']['Row'][];
};

export const Chatbot = ({ currentChat, initialMessages }: ChatbotType) => {
  const { classes } = useStyles();
  const { inputText, setInputText, messages, onSubmit, loading } = useChatSocket(
    'ws://localhost:8000/chat',
    currentChat.id
  );
  return (
    <div className={classes.viewHeight}>
      <div className={classes.container}>
        <div>{currentChat?.id}</div>
        <ChatDialog messages={messages} />
        <ChatTextInput
          inputText={inputText}
          setInputText={setInputText}
          onSubmit={onSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
};
