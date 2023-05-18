import { Box, ScrollArea, Stack } from '@mantine/core';
import { type FC } from 'react';
import React from 'react';
import { ChatMessage } from './ChatMessage';
import { Message } from '../../types';

export type ChatDialogProps = { messages: Message[] };

export const ChatDialog: FC<ChatDialogProps> = ({ messages }) => {
  return (
    <ScrollArea
      h="100vh"
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
            key={`${message.text}-${i}`}
          >
            <ChatMessage message={message} />
          </React.Fragment>
        ))}
        <Box h={140} />
      </Stack>
    </ScrollArea>
  );
};
