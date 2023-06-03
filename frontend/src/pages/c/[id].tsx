/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/rules-of-hooks */
import { Chatbot, useQueryChat, useQueryMessages } from 'src/features/chatbot';
import { useRouter } from 'next/router';
import { createGetLayout } from 'src/components/layout';
import { SimpleGrid, createStyles } from '@mantine/core';
import { VideoPlayer } from '@/features/videoPlayer';
import { useUser } from '@supabase/auth-helpers-react';
// import * as fs from 'fs';

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
試験前に見返せないし、今時iPadで書き込みたい人も多いはずです
9
00:01:03,000 --> 00:01:10,000
そこで今回はこの新学期のプチイライラをプログラミングで解消していきます
10
00:01:10,000 --> 00:01:12,000
作戦はこうです
11
00:01:12,000 --> 00:01:15,000
①動画をフレームに切り出す
12
00:01:15,000 --> 00:01:20,000
②同じスライドが映っているフレームを削除する
13
00:01:20,000 --> 00:01:24,000
③スライド画像をまとめてPDFにする
14
00:01:24,000 --> 00:01:29,000
これで先生に頼らずとも授業資料が生成できちゃうわけです
15
00:01:29,000 --> 00:01:33,000
しかし問題があるのは②です
16
00:01:33,000 --> 00:01:39,000
人間なら3歳の子でも2枚の写真を見て似ているかどうかわかります
17
00:01:39,000 --> 00:01:42,000
パソコンに同じことができるでしょうか?
18
00:01:42,000 --> 00:01:50,000
実はパソコン自体は画像が似ているという概念を持っていません
19
00:01:50,000 --> 00:01:57,000
そこでパソコンを平手打ちするのではなく、似ているの基準をしっかりと作ってあげましょう
20
00:01:57,000 --> 00:02:14,000
詳しく解説はしませんが、Accelerated Casseという手法を使って画像の中の特徴的な部分を調べ、2つの画像にどれだけ同じものが映っているかを基に、画像の類似度を判定します
21
00:02:14,000 --> 00:02:19,000
それでは早速コーディングしていきましょう
22
00:02:19,000 --> 00:02:24,000
ことあるごとに言っていますが、僕はPythonという言語が好きです
23
00:02:24,000 --> 00:02:29,000
プログラミングちょっと興味あるよーっていう人には絶対Pythonをおすすめしますね
24
00:02:29,000 --> 00:02:33,000
あれ?もしかして好みを押し付けるタイプの人間だと思われてます?
25
00:02:33,000 --> 00:02:35,000
そんなことないですって
26
00:02:35,000 --> 00:02:42,000
まあアーティストはたくさんいるのに、みんなが同じ歌手の歌ばかり聞いてしまうのと同じ感覚ですよ
27
00:02:42,000 --> 00:02:45,000
友達に勧めたりもしますよね
28
00:02:45,000 --> 00:02:48,000
お、お喋りしている間に完成したようです
29
00:02:48,000 --> 00:02:54,000
でも…
30
00:02:54,000 --> 00:02:59,000
今回作ったウェブアプリはRecapiと名付けました
31
00:02:59,000 --> 00:03:09,000
オンライン授業を受ける端末は人それぞれだと思うので、WindowsでもMacでもスマホでも、ブラウザさえあれば利用できるようにしました
32
00:03:09,000 --> 00:03:13,000
皆さんも気軽に使ってみてくださいね
33
00:03:13,000 --> 00:03:22,000
試しにきっかけとなった授業の動画で挑戦してみます
34
00:03:22,000 --> 00:03:27,000
ルイージスライドを削除したPDFがあっという間に完成しました
35
00:03:27,000 --> 00:03:31,000
このスッキリ感、まさに新学期ですね
36
00:03:31,000 --> 00:03:34,000
さて、次のステージへ
37
00:03:34,000 --> 00:03:37,000
次のステージへ
38
00:03:37,000 --> 00:03:40,000
次のステージへ
39
00:03:40,000 --> 00:03:42,000
次のステージへ
40
00:03:42,000 --> 00:03:46,000
果たしてもニッチなサービスをリリースしてしまいました
41
00:03:46,000 --> 00:03:52,000
ところで、先生に言えばPDF資料もらえたんじゃない?と思った視聴者の皆さん
42
00:03:52,000 --> 00:03:54,000
鋭いですね
43
00:03:54,000 --> 00:03:56,000
それは無理です
44
00:03:56,000 --> 00:04:02,000
メールを送るのが難しい特別な事情があるんです
45
00:04:02,000 --> 00:04:05,000
それではまた次回の動画でお会いしましょう
46
00:04:05,000 --> 00:04:27,000
ご視聴ありがとうございました`;

const sampleText2 = `00:00:00,000 --> 00:00:05,000
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

  const getSummarizedVtt = async (vttText: string) => {
    const response = await fetch('/api/openai/summarize-to-chapter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vttText,
      }),
    });
    const resp_summerize = await response.json();
    console.log(resp_summerize);
  };

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
          <div className={classes.viewHeight}>
            <SimpleGrid>
              <VideoPlayer src="/free-video5-sky-cafinet.mp4" vttfile="/sample.vtt" />
              {/* {nods_page?.length ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      handleClick(nods_page[0].id);
                    }}
                  >
                    generateEmbedding
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      getMatchContext(
                        nods_page[0].id,
                        'Japanese Prime Minister Fumio Kishida on May 21 touted the achievements of the Group of Seven summit in Hiroshima, saying the leaders from the advanced economies agreed to work toward a world without nuclear weapons and to stand by Ukraine.'
                      );
                    }}
                  >
                    get match context
                  </button>
                </>
              ) : (
                <div />
              )} */}
              <button type="button" onClick={() => getSummarizedVtt(sampleText2)}>
                summarize
              </button>
              <Chatbot currentChat={currentChat} initialMessages={messages} />
            </SimpleGrid>
          </div>
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
