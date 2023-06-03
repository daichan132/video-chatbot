import type { Meta, StoryObj } from '@storybook/react';
import { ChatDialog } from '.';

type T = typeof ChatDialog;

export default {
  title: 'ChatDialog',
  component: ChatDialog,
  args: {},
} as Meta<T>;

type Story = StoryObj<typeof ChatDialog>;

export const Default: Story = {
  render: () => <ChatDialog messages={[]} />,
};
