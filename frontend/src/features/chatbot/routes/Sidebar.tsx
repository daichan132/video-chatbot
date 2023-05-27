import { memo, type FC, useEffect } from 'react';
import { ActionIcon, Box, Button, Flex, Loader, Stack, Text } from '@mantine/core';
import { AiOutlinePlus } from 'react-icons/ai';
import { BsChatLeft, BsTrash } from 'react-icons/bs';
import router from 'next/router';
import { shallow } from 'zustand/shallow';
import useChatStore from 'src/stores/chatStore';
import { css } from '@emotion/react';
import { useMutateChat } from '../hooks/useMutateChat';
import { useQueryChats } from '../hooks/useQueryChats';

export const Sidebar: FC = memo(function Sidebar() {
  const id = useChatStore((state) => state.id, shallow);
  const { addChatMutation, deleteChatMutation } = useMutateChat();
  const { data: chats, isLoading, refetch } = useQueryChats();
  useEffect(() => {
    refetch();
  }, [id, refetch]);
  useEffect(() => {
    if (deleteChatMutation.isSuccess) refetch();
  }, [deleteChatMutation.isSuccess, refetch]);
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
        {isLoading && <Loader />}
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
                  {chat.title}
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
});
