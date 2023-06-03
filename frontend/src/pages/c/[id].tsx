/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/rules-of-hooks */
import { Chatbot, useQueryChat, useQueryMessages } from 'src/features/chatbot';
import { useRouter } from 'next/router';
import { createGetLayout } from 'src/components/layout';
import { createStyles, Box, Flex } from '@mantine/core';
import { VideoPlayer, VideoPost, useQueryNodsPage } from '@/features/videoPlayer';
import { ReactNode } from 'react';
import { useUser } from '@supabase/auth-helpers-react';

const useStyles = createStyles(() => ({
  viewHeight: {
    height: '100vh',
    width: '100%',
  },
}));

const ChatPage = () => {
  const { classes } = useStyles();

  const router = useRouter();
  const user = useUser();
  const { data: currentChat, isLoading: isChatLoading } = useQueryChat(router.query?.id as string);
  const { data: messages, isLoading: isMessagesLoading } = useQueryMessages(
    router.query?.id as string
  );
  const {
    data: nods_page,
    isLoading: isNodesPageLoading,
    refetch,
  } = useQueryNodsPage(router.query?.id as string);

  // const getMatchContext = async (page_id: number, question: string) => {
  //   const response = await fetch('/api/openai/vector-search', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       page_id,
  //       question,
  //     }),
  //   });
  //   const data = await response.json();
  //   console.log(data);
  // };

  // const getSummarizedVtt = async (vttText: string) => {
  //   const response = await fetch('/api/openai/summarize-to-chapter', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       vttText,
  //     }),
  //   });
  //   const resp_summerize = await response.json();
  //   console.log(resp_summerize);
  // };

  const videoComponent = (): ReactNode => {
    if (nods_page?.video_url && user?.id) {
      return (
        <VideoPlayer src="https://ohekoozhoqokxzrdjjwt.supabase.co/storage/v1/object/public/videos/4de4af68-c677-4d8c-a71d-4aa3f2baa469/0.6090836913241744.mp4" />
      );
    }
    if (currentChat && !isNodesPageLoading) {
      return <VideoPost chatId={currentChat.id} refetch={() => refetch()} />;
    }
    return <Box w="100%" maw={700} bg="dark" />;
  };
  return (
    <div>
      {isChatLoading || isMessagesLoading || !currentChat || !messages ? (
        <div />
      ) : (
        <div key={currentChat.id}>
          <Flex
            className={classes.viewHeight}
            p="md"
            gap="md"
            direction={{ base: 'column', lg: 'row' }}
            style={{ overflow: 'auto' }}
            justify="center"
            align="center"
          >
            {videoComponent()}
            <Chatbot currentChat={currentChat} initialMessages={messages} />
          </Flex>
        </div>
      )}
    </div>
  );
};

ChatPage.getLayout = createGetLayout();
export default ChatPage;
