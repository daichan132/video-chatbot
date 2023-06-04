import { type FC, useEffect } from 'react';
import { ActionIcon, Box, Button, Center, Flex, Loader, Stack, Text } from '@mantine/core';
import { AiOutlinePlus } from 'react-icons/ai';
import { BsChatLeft, BsTrash } from 'react-icons/bs';
import router from 'next/router';
import { shallow } from 'zustand/shallow';
import { css } from '@emotion/react';
import { useMutateChat } from '../hooks/useMutateChat';
import { useQueryAllChats } from '../hooks/useQueryAllChats';
import useChatStore from '../../../stores/chatStore';

export const Sidebar: FC = () => {
  const id = useChatStore((state) => state.id, shallow);
  const title = useChatStore((state) => state.title, shallow);
  const { addChatMutation, deleteChatMutation } = useMutateChat();
  const { data: chats, isLoading, refetch } = useQueryAllChats();
  useEffect(() => {
    if (deleteChatMutation.isSuccess || addChatMutation.isSuccess) refetch();
  }, [deleteChatMutation.isSuccess, addChatMutation.isSuccess, refetch]);
  useEffect(() => {
    if (title) refetch();
  }, [title, refetch]);
  return (
    <Stack>
      <Button
        variant="default"
        h={50}
        leftIcon={<AiOutlinePlus />}
        onClick={() => {
          addChatMutation.mutate();
        }}
      >
        add chat
      </Button>
      <Stack spacing={10} pt="md">
        {isLoading && (
          <Center h="100%">
            <Loader color="gray" size="sm" />
          </Center>
        )}
        {Array.isArray(chats) &&
          chats?.map((chat) => (
            <Box key={chat.id} w="100%" sx={{ position: 'relative' }}>
              <Button
                variant={chat.id === id ? 'light' : 'default'}
                css={css`
                  .mantine-Button-inner {
                    margin-right: ${chat.id === id ? 20 : 0}px;
                  }
                `}
                w="100%"
                h={40}
                leftIcon={<BsChatLeft />}
                onClick={() => {
                  router.push(`/c/${chat.id}`);
                }}
              >
                <Text mr={100} weight="normal" w="100%" size="sm">
                  {chat.id === id ? title : chat.title}
                </Text>
              </Button>
              <Flex wrap="nowrap" sx={{ position: 'absolute', right: 10, zIndex: 10, top: 6 }}>
                {chat.id === id && (
                  <ActionIcon
                    onClick={() => {
                      deleteChatMutation.mutate(id);
                    }}
                  >
                    <BsTrash size={15} />
                  </ActionIcon>
                )}
              </Flex>
            </Box>
          ))}
      </Stack>
    </Stack>
  );
};
