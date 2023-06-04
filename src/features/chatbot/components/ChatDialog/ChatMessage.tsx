/* eslint-disable react/no-children-prop */
import { Box, Flex, ThemeIcon, createStyles, Text, Stack, Accordion, Divider } from '@mantine/core';
import { AiOutlineUser } from 'react-icons/ai';
import ReactMarkdown from 'react-markdown';
import { Tables } from '@/types/customSupabase';
import React from 'react';
import { SuggestionType } from '../../hooks/useChat';

const useStyles = createStyles((theme, role: string) => ({
  container: {
    width: '100%',
    backgroundColor:
      // eslint-disable-next-line no-nested-ternary
      theme.colorScheme === 'dark'
        ? role === 'system'
          ? theme.colors.gray[8]
          : theme.colors.gray[9]
        : role === 'system'
        ? theme.colors.gray[0]
        : theme.colors.white,
    padding: '12px 16px',
    borderBottom:
      theme.colorScheme === 'dark'
        ? `1px solid ${theme.colors.gray[7]}`
        : `1px solid ${theme.colors.gray[2]}`,
  },
  flexWrapper: { margin: '0 auto' },
  icon: { transform: 'translate(0, 40%)' },
  text: {},
}));

export const ChatMessage = ({
  message,
  suggestions,
}: {
  message: Tables['messages']['Row'];
  suggestions: SuggestionType[];
}) => {
  const { classes } = useStyles(message.role || '');
  return (
    <div className={classes.container}>
      <Flex gap="sm" wrap="nowrap" p="md" className={classes.flexWrapper}>
        {message.role === 'user' ? (
          <ThemeIcon size="lg" variant="default" className={classes.icon}>
            <AiOutlineUser />
          </ThemeIcon>
        ) : (
          <div />
        )}
        <div className={classes.text}>
          <ReactMarkdown>{message.content || ''}</ReactMarkdown>
          {message.role === 'system' && suggestions.length > 0 && (
            <Accordion
              styles={{
                item: {
                  backgroundColor: 'white',
                  border: `1px solid #dedede`,
                },
              }}
            >
              <Accordion.Item value="customization">
                <Accordion.Control>もしかしてこの箇所ですか？</Accordion.Control>
                <Accordion.Panel>
                  {suggestions.map((item) => {
                    return (
                      <Stack key={`${item.start}~${item.end}`}>
                        <Box>
                          <Divider />
                          <Box p="md">
                            <Flex wrap="nowrap">
                              <Text c="blue">{`${item.start}`}</Text>
                              <Text px="xs">~</Text>
                              <Text c="blue">{`${item.end}`}</Text>
                            </Flex>
                            <Text fz="sm">{item.text}</Text>
                          </Box>
                        </Box>
                      </Stack>
                    );
                  })}
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          )}
        </div>
      </Flex>
    </div>
  );
};
