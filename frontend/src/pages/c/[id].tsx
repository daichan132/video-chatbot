/* eslint-disable react-hooks/rules-of-hooks */
import { Chatbot, useQueryChat, useQueryMessages, useQueryPageId } from 'src/features/chatbot';
import { useRouter } from 'next/router';
import { createGetLayout } from 'src/components/layout';
import { SimpleGrid, createStyles } from '@mantine/core';
import { VideoPlayer } from '@/features/videoPlayer';
import { useUser } from '@supabase/auth-helpers-react';

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
  const { data: nods_page } = useQueryPageId(router.query?.id as string);
  if (nods_page !== undefined && nods_page.length > 0) {
    const pageId = nods_page[0].id;
    console.log(pageId);
  }

  const handleClick = async (page_id: number) => {
    const response = await fetch('/api/openai/generate-embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page_id,
      }),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div>
      {isChatLoading || isMessagesLoading || !currentChat || !messages ? (
        <div />
      ) : (
        <div key={currentChat.id}>
          <div className={classes.viewHeight}>
            <SimpleGrid>
              <VideoPlayer src="/free-video5-sky-cafinet.mp4" />
              {nods_page?.length ? (
                <button
                  type="button"
                  onClick={() => {
                    handleClick(nods_page[0].id);
                  }}
                >
                  generateEmbedding
                </button>
              ) : (
                <div />
              )}
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
