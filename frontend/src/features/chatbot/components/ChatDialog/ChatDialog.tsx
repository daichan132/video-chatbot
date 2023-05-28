import { Box, ScrollArea, Stack } from '@mantine/core';
import { type FC } from 'react';
import React from 'react';
import { Tables } from '@/types/customSupabase';
import { ChatMessage } from './ChatMessage';

export type ChatDialogProps = { messages: Tables['messages']['Row'][] };

export const ChatDialog: FC<ChatDialogProps> = ({ messages }) => {
  return (
    <ScrollArea
      h="100%"
      type="scroll"
      styles={(theme) => ({
        scrollbar: {
          '&[data-orientation="vertical"]': {
            width: 10,
          },
          '&[data-orientation="vertical"] .mantine-ScrollArea-thumb': {
            backgroundColor: theme.colors.dark[0],
          },
        },
      })}
    >
      <Stack spacing={0}>
        {messages.map((message, i) => (
          <React.Fragment
            // eslint-disable-next-line react/no-array-index-key
            key={`${message.id}-${message.content}-${i}`}
          >
            <ChatMessage message={message} />
          </React.Fragment>
        ))}
        <Box h={140} />
      </Stack>
    </ScrollArea>
  );
};
