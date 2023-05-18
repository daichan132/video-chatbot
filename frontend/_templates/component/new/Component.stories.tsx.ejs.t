---
to: <%= path %>/<%= name%>.stories.tsx
---
import type { Meta, StoryObj } from '@storybook/react';

import { <%= name %> } from '.';

const meta: Meta<typeof <%= name %>> = {
  title: '<%= name %>',
  component: <%= name %>,
};

export default meta;
type Story = StoryObj<typeof <%= name %>>;

export const Default: Story = {
  render: () => <<%= name %> />,
};
