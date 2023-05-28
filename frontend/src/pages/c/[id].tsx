/* eslint-disable react-hooks/rules-of-hooks */
import { Chatbot, useQueryChat, useQueryMessages } from 'src/features/chatbot';
import { useRouter } from 'next/router';
import { createGetLayout } from 'src/components/layout';
import { Loader } from '@mantine/core';

const ChatPage = () => {
  const router = useRouter();
  const { data: currentChat, isLoading: isChatLoading } = useQueryChat(router.query?.id as string);
  const { data: messages, isLoading: isMessagesLoading } = useQueryMessages(
    router.query?.id as string
  );

  return (
    <div>
      {isChatLoading || isMessagesLoading || !currentChat || !messages ? <Loader /> : <Chatbot />}
    </div>
  );
};

ChatPage.getLayout = createGetLayout();
export default ChatPage;
