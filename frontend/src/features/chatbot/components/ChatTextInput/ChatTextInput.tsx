import { Button, Flex, TextInput, createStyles } from '@mantine/core';
import { Dispatch, SetStateAction, type FC } from 'react';

const useStyles = createStyles(() => ({
  chatTextInputWrapper: {
    position: 'absolute',
    bottom: '25px',
    left: '50%',
    botttom: 0,
    transform: 'translateX(-50%)',
    maxWidth: 600,
    width: '100%',
    boxSizing: 'border-box',
  },
  boxShadow: {
    boxShadow: '0px 0px 15px -5px #cccccc',
    width: '100%',
  },
}));

export type ChatTextInputProps = {
  inputText: string;
  setInputText: Dispatch<SetStateAction<string>>;
  onSubmit: () => void;
  loading: boolean;
};

export const ChatTextInput: FC<ChatTextInputProps> = ({
  inputText,
  setInputText,
  onSubmit,
  loading,
}) => {
  const { classes } = useStyles();

  return (
    <Flex px={20} align="center" justify="center" className={classes.chatTextInputWrapper} gap="md">
      <TextInput
        className={classes.boxShadow}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <Button onClick={onSubmit} variant="default" disabled={loading || inputText === ''}>
        Submit
      </Button>
    </Flex>
  );
};
