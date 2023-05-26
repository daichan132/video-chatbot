import type { Meta, StoryObj } from '@storybook/react';

import { UserButton } from '.';

const meta: Meta<typeof UserButton> = {
  title: 'UserButton',
  component: UserButton,
};

export default meta;
type Story = StoryObj<typeof UserButton>;

export const Default: Story = {
  render: () => <UserButton image="" name="user-name" />,
};
