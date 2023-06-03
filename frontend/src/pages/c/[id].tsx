/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/rules-of-hooks */
import { Chatbot, useQueryChat, useQueryMessages } from 'src/features/chatbot';
import { useRouter } from 'next/router';
import { createGetLayout } from 'src/components/layout';
import { AspectRatio, Box, Flex, Skeleton, createStyles } from '@mantine/core';
import { VideoPlayer, VideoPost, useDownloadVideo, useQueryNodsPage } from '@/features/videoPlayer';
import { ReactNode } from 'react';

const useStyles = createStyles(() => ({
  viewHeight: {
    height: '100vh',
    width: '100%',
  },
}));

const ChatPage = () => {
  const { classes } = useStyles();

  const router = useRouter();
  const { data: currentChat, isLoading: isChatLoading } = useQueryChat(router.query?.id as string);
  const { data: messages, isLoading: isMessagesLoading } = useQueryMessages(
    router.query?.id as string
  );
  const {
    data: nods_page,
    isLoading: isNodesPageLoading,
    refetch,
  } = useQueryNodsPage(router.query?.id as string);
  const { fullUrl: videoUrl, isLoading: isDownloadLoading } = useDownloadVideo(
    nods_page?.video_url || null
  );

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
  const videoComponent = (): ReactNode => {
    if (nods_page?.video_url) {
      if (isDownloadLoading) {
        return (
          <AspectRatio ratio={16 / 9} w="100%" maw={700}>
            <Skeleton w="100%" h="100%" visible />
          </AspectRatio>
        );
      }
      if (videoUrl) {
        return <VideoPlayer src={videoUrl} />;
      }
    } else if (currentChat && !isNodesPageLoading) {
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
