import { Paper, createStyles } from '@mantine/core';
import { Tables } from '@/types/customSupabase';
import { ChatDialog } from '../components/ChatDialog';
import { ChatTextInput } from '../components/ChatTextInput';
import { useChat } from '../hooks/useChat';

const useStyles = createStyles(() => ({
  container: {
    position: 'relative',
    height: '100%',
    width: '100%',
    maxWidth: '800px',
    overflow: 'hidden',
  },
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
    <Paper className={classes.container} shadow="xl" p={0} radius="md">
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
    </Paper>
  );
};
