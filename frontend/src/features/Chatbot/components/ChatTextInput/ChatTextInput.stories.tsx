import type { Meta, StoryObj } from '@storybook/react';

import { useState } from 'react';
import { ChatTextInput } from '.';

const meta: Meta<typeof ChatTextInput> = {
  title: 'ChatTextInput',
  component: ChatTextInput,
};

export default meta;
type Story = StoryObj<typeof ChatTextInput>;

const ChatTextInputWithHooks = ({ initText }: { initText: string }) => {
  const [inputText, setInputText] = useState(initText);

  return (
    <ChatTextInput
      inputText={inputText}
      setInputText={setInputText}
      onSubmit={() => undefined}
      loading={false}
    />
  );
};

export const Default: Story = {
  render: () => <ChatTextInputWithHooks initText="initial" />,
};
