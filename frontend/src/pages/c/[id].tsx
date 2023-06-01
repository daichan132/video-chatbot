/* eslint-disable react-hooks/rules-of-hooks */
import { Chatbot, useQueryChat, useQueryMessages } from 'src/features/chatbot';
import { useRouter } from 'next/router';
import { createGetLayout } from 'src/components/layout';
import { SimpleGrid, createStyles } from '@mantine/core';
import { VideoPlayer } from '@/features/videoPlayer';

const useStyles = createStyles(() => ({
  viewHeight: { height: '100vh', width: '100%', overflow: 'hidden' },
}));

const ChatPage = () => {
  const { classes } = useStyles();

  const router = useRouter();
  const { data: currentChat, isLoading: isChatLoading } = useQueryChat(router.query?.id as string);
  const { data: messages, isLoading: isMessagesLoading } = useQueryMessages(
    router.query?.id as string
  );

  return (
    <div>
      {isChatLoading || isMessagesLoading || !currentChat || !messages ? (
        <div />
      ) : (
        <div key={currentChat.id}>
          <div className={classes.viewHeight}>
            <SimpleGrid>
              <VideoPlayer src="/free-video5-sky-cafinet.mp4" />
              <Chatbot currentChat={currentChat} initialMessages={messages} />
            </SimpleGrid>
          </div>
        </div>
      )}
    </div>
  );
};

ChatPage.getLayout = createGetLayout();
export default ChatPage;
