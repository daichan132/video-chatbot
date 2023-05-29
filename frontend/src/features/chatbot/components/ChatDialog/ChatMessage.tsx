/* eslint-disable react/no-children-prop */
import { Flex, ThemeIcon, createStyles } from '@mantine/core';
import { FaGithub } from 'react-icons/fa';
import { AiOutlineUser } from 'react-icons/ai';
import ReactMarkdown from 'react-markdown';
import { Tables } from '@/types/customSupabase';

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
        ? theme.colors.gray[1]
        : theme.colors.white,
    padding: '12px 16px',
    borderBottom:
      theme.colorScheme === 'dark'
        ? `1px solid ${theme.colors.gray[7]}`
        : `1px solid ${theme.colors.gray[2]}`,
  },
  flexWrapper: { maxWidth: 800, margin: '0 auto' },
  icon: { transform: 'translate(0, 40%)' },
  text: {},
}));

export const ChatMessage = ({ message }: { message: Tables['messages']['Row'] }) => {
  const { classes } = useStyles(message.role || '');
  return (
    <div className={classes.container}>
      <Flex gap="sm" wrap="nowrap" className={classes.flexWrapper}>
        <ThemeIcon size="lg" variant="default" className={classes.icon}>
          {message.role === 'user' ? <AiOutlineUser /> : <FaGithub />}
        </ThemeIcon>
        <div className={classes.text}>
          <ReactMarkdown>{message.content || ''}</ReactMarkdown>
        </div>
      </Flex>
    </div>
  );
};
