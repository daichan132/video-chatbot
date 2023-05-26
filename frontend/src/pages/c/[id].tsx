/* eslint-disable react-hooks/rules-of-hooks */
import { Chatbot, useQueryChat, useQueryMessages } from '@/features/chatbot';
import { useRouter } from 'next/router';
import { createGetLayout } from '@/components/layout';
import { Loader } from '@mantine/core';
import { useEffect } from 'react';
import useChatStore from '@/stores/chatStore';

const ChatPage = () => {
  const router = useRouter();
  const { data: currentChat, isLoading: isChatLoading } = useQueryChat(router.query?.id as string);
  const { data: messages, isLoading: isMessagesLoading } = useQueryMessages(
    router.query?.id as string
  );

  const setChat = useChatStore((state) => state.setChat);
  useEffect(() => {
    if (currentChat)
      setChat({
        ...currentChat,
        advanced_settings: JSON.parse(currentChat?.advanced_settings as string),
      });
  }, [currentChat, setChat]);

  return (
    <div>
      {isChatLoading || isMessagesLoading || !currentChat || !messages ? (
        <Loader />
      ) : (
        <Chatbot currentChat={currentChat} initialMessages={messages} />
      )}
    </div>
  );
};

ChatPage.getLayout = createGetLayout();
export default ChatPage;
