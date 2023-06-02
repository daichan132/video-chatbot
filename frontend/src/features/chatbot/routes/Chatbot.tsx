import { createStyles } from '@mantine/core';
import { Tables } from '@/types/customSupabase';
import { ChatDialog } from '../components/ChatDialog';
import { ChatTextInput } from '../components/ChatTextInput';
import { useChat } from '../hooks/useChat';

const useStyles = createStyles(() => ({
  container: { position: 'relative', height: '100%', width: '100%' },
}));

export const Chatbot = ({
  currentChat,
  initialMessages = [],
}: {
  currentChat: Tables['chats']['Row'];
  initialMessages?: Tables['messages']['Row'][];
}) => {
  const { classes } = useStyles();
  const loading = false;
  const { inputText, setInputText, messages, addMessageFunc } = useChat(
    currentChat,
    initialMessages
  );

  return (
    <div className={classes.container}>
      <ChatDialog messages={messages} />
      <ChatTextInput
        inputText={inputText}
        setInputText={setInputText}
        onSubmit={() => {
          addMessageFunc();
          setInputText('');
        }}
        loading={loading}
      />
    </div>
  );
};
