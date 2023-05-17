/* eslint-disable react/no-children-prop */
import { Flex, ThemeIcon, createStyles } from '@mantine/core';
import { FaGithub } from 'react-icons/fa';
import { AiOutlineUser } from 'react-icons/ai';
import ReactMarkdown from 'react-markdown';
import { Message } from '../../types';

const useStyles = createStyles((theme, speakerId: number) => ({
  container: {
    width: '100%',
    backgroundColor: speakerId ? '#fff' : '#f7f7f7',
    padding: '30px 20px',
    borderBottom: '1px solid #d6d6d6',
  },
  flexWrapper: { maxWidth: 800, margin: '0 auto' },
  icon: { transform: 'translate(0, 30%)' },
  text: {},
}));

export const ChatMessage = ({ message }: { message: Message }) => {
  const { classes } = useStyles(message.speakerId);
  return (
    <div className={classes.container}>
      <Flex gap="sm" wrap="nowrap" className={classes.flexWrapper}>
        <ThemeIcon size="lg" variant="default" className={classes.icon}>
          {message.speakerId ? <AiOutlineUser /> : <FaGithub />}
        </ThemeIcon>
        <div className={classes.text}>
          <ReactMarkdown>{message.text}</ReactMarkdown>
        </div>
      </Flex>
    </div>
  );
};
