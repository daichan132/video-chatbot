/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/rules-of-hooks */
import { Chatbot, useQueryChat, useQueryMessages } from 'src/features/chatbot';
import { useRouter } from 'next/router';
import { createGetLayout } from 'src/components/layout';
import { createStyles, Box, Flex } from '@mantine/core';
import { VideoPlayer, VideoPost, useQueryNodsPage } from '@/features/videoPlayer';
import { ReactNode } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase';

const sampleText = `1
00:00:00,000 --> 00:00:05,000
よーし、10秒経ちました
2
00:00:07,000 --> 00:00:14,000
あれ?これって先生、動画しかアップロードしてくれないってこと?
3
00:00:23,000 --> 00:00:27,000
はい、どうもテク系VTuberのあずまるです
4
00:00:27,000 --> 00:00:30,000
みなさん、新年度いかがお過ごしでしょうか?
5
00:00:30,000 --> 00:00:38,000
今回はオンライン授業あるあるTUV問題を解決してみたやっていきたいと思います
6
00:00:38,000 --> 00:00:45,000
TUV問題っていうのは先生がビデオしかアップロードしない問題の略です
7
00:00:45,000 --> 00:00:57,000
ハーポとかで授業動画をオンデマンド配信する先生って結構多いんですが、ぶっちゃけ動画だけ配布してスライドを配布しないのっていじめだと思うんですよ
8
00:00:57,000 --> 00:01:03,000
試験前に見返せないし、今時iPadで書き込みたい人も多いはずです`;

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

  const getSummarizedVtt = async (vttText: string, vttfilename: string) => {
    const vttfilepath = ['public/', vttfilename].join();
    const response = await fetch('/api/openai/summarize-to-chapter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vttText,
        vttfilepath,
      }),
    });
    const resp_summerize = await response.json();
    console.log(resp_summerize);
    const blob = new Blob([resp_summerize], { type: 'text/vtt' });
    const file = new File([blob], 'text.vtt', { type: 'text/vtt' });
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;
    const uploadVttFile = async () => {
      const { error } = await supabase.storage
        .from('vttfiles')
        .upload(`${user?.id}/${filePath}`, file);
      // console.log('complete upload vtt');
      const { data, error: error_update_vtt } = await supabase
        .from('nods_page')
        .update({ vtt_url: filePath })
        .eq('chat', currentChat?.id)
        .select('*')
        .single();
      // console.log('complete update column');
    };
    uploadVttFile();
  };

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
            <button type="button" onClick={() => getSummarizedVtt(sampleText, 'output.vtt')}>
              get vtt file
            </button>
            <Chatbot currentChat={currentChat} initialMessages={messages} />
          </Flex>
        </div>
      )}
    </div>
  );
};

ChatPage.getLayout = createGetLayout();
export default ChatPage;
