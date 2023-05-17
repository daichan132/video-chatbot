import { Button, Flex, TextInput, createStyles } from '@mantine/core';
import { Dispatch, SetStateAction, type FC } from 'react';

const useStyles = createStyles(() => ({
  boxShadow: { boxShadow: '0px 0px 15px -5px #cccccc' },
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
    <Flex w="95%" maw={800} gap="md" m="0 auto">
      <TextInput
        className={classes.boxShadow}
        w="100%"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <Button onClick={onSubmit} variant="default" disabled={loading || inputText === ''}>
        Submit
      </Button>
    </Flex>
  );
};
