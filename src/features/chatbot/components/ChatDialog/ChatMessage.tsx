/* eslint-disable react/no-children-prop */
import {
  Box,
  Button,
  Collapse,
  Flex,
  Group,
  Spoiler,
  ThemeIcon,
  createStyles,
  Text,
  Stack,
} from '@mantine/core';
import { AiOutlineUser } from 'react-icons/ai';
import ReactMarkdown from 'react-markdown';
import { Tables } from '@/types/customSupabase';
import { useDisclosure } from '@mantine/hooks';

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
  suggestions: string[];
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
          {message.role === 'system' && suggestions && (
            <Spoiler maxHeight={0} showLabel="Show more" hideLabel="Hide" transitionDuration={500}>
              <Stack>
                {suggestions &&
                  suggestions.map((item) => {
                    return <p key={item}>{item}</p>;
                  })}
              </Stack>
            </Spoiler>
          )}
        </div>
      </Flex>
    </div>
  );
};
