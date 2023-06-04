import { Box, ScrollArea, Stack } from '@mantine/core';
import { type FC, useRef, useEffect } from 'react';
import React from 'react';
import { Tables } from '@/types/customSupabase';
import { ChatMessage } from './ChatMessage';
import { SuggestionType } from '../../hooks/useChat';

export type ChatDialogProps = {
  messages: Tables['messages']['Row'][];
  suggestions: SuggestionType[];
};

export const ChatDialog: FC<ChatDialogProps> = ({ messages, suggestions }) => {
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
      w="100%"
      type="scroll"
      styles={(theme) => ({
        scrollbar: {
          '&[data-orientation="vertical"]': {
            width: 12,
          },
          '&[data-orientation="vertical"] .mantine-ScrollArea-thumb': {
            backgroundColor: theme.colors.dark[0],
          },
        },
      })}
    >
      <Stack spacing={0} w="100%">
        {messages.map((message, i) => (
          <React.Fragment key={`${message.id}-${message.created_at}`}>
            <ChatMessage
              message={message}
              suggestions={(messages.length - 1 === i && suggestions) || []}
            />
          </React.Fragment>
        ))}
      </Stack>
      <Box h={90} />
    </ScrollArea>
  );
};
