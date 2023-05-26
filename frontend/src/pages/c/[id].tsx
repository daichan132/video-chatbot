/* eslint-disable react-hooks/rules-of-hooks */
import { useQueryChat } from '@/features/chatbot';
import { useRouter } from 'next/router';
import useChatStore from '@/stores/chatStore';
import { createGetLayout } from '@/components/layout';
import { Loader } from '@mantine/core';
import { shallow } from 'zustand/shallow';

const ChatPage = () => {
  const router = useRouter();
  const { data: currentChat, isLoading } = useQueryChat(router.query?.id as string);
  const id = useChatStore((state) => state.id, shallow);

  // if (!currentChat) {
  //   notFound();
  // }

  // const parsedCurrentChat = {
  //   ...currentChat,
  //   advanced_settings: JSON.parse(currentChat.advanced_settings as string),
  // };

  return (
    <div>
      {isLoading && <Loader />}
      {currentChat?.id && <div>{id}</div>}
    </div>
  );
};

ChatPage.getLayout = createGetLayout();
export default ChatPage;
