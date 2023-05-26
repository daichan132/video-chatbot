/* eslint-disable react-hooks/rules-of-hooks */
import { Chatbot } from '@/features/chatbot';
import { createGetLayout } from '@/components/layout';

const ChatPage = () => {
  return (
    <div>
      <Chatbot />
    </div>
  );
};

ChatPage.getLayout = createGetLayout();

export default ChatPage;
