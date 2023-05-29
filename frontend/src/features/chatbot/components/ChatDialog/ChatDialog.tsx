import { Box, ScrollArea, Stack } from '@mantine/core';
import { type FC, useRef, useEffect } from 'react';
import React from 'react';
import { Tables } from '@/types/customSupabase';
import { ChatMessage } from './ChatMessage';

export type ChatDialogProps = {
  messages: Tables['messages']['Row'][];
};

export const ChatDialog: FC<ChatDialogProps> = ({ messages }) => {
  const viewport = useRef<HTMLDivElement>(null);
  const scrollToBottomSmooth = () =>
    viewport.current?.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
  const scrollToBottomAuto = () =>
    viewport.current?.scrollTo({ top: viewport.current.scrollHeight, behavior: 'auto' });

  useEffect(() => {
    scrollToBottomAuto();
  }, []);
  useEffect(() => {
    scrollToBottomSmooth();
  }, [messages]);
  return (
    <ScrollArea
      viewportRef={viewport}
      h="100%"
      type="scroll"
      styles={(theme) => ({
        scrollbar: {
          '&[data-orientation="vertical"]': {
            width: 8,
          },
          '&[data-orientation="vertical"] .mantine-ScrollArea-thumb': {
            backgroundColor: theme.colors.dark[0],
          },
        },
      })}
    >
      <Stack spacing={0}>
        {messages.map((message) => (
          <React.Fragment key={`${message.id}-${message.created_at}`}>
            <ChatMessage message={message} />
          </React.Fragment>
        ))}
        <Box h={160} />
      </Stack>
    </ScrollArea>
  );
};
