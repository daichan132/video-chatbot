import { createStyles } from '@mantine/core';
import { useChatSocket } from '../hooks/useChatSocket';
import { ChatDialog } from '../components/ChatDialog';
import { ChatTextInput } from '../components/ChatTextInput';

const useStyles = createStyles(() => ({
  container: { position: 'relative', height: '100%', width: '100%' },
}));

export const Chatbot = () => {
  const { classes } = useStyles();
  const { inputText, setInputText, messages, onSubmit, loading } = useChatSocket(
    'ws://localhost:8000/chat'
  );
  return (
    <div className={classes.container}>
      <ChatDialog messages={messages} />
      <ChatTextInput
        inputText={inputText}
        setInputText={setInputText}
        onSubmit={onSubmit}
        loading={loading}
      />
    </div>
  );
};
