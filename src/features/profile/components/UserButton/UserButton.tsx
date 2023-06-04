import { UnstyledButton, UnstyledButtonProps, Avatar, Text, Flex } from '@mantine/core';
import { forwardRef } from 'react';

interface UserButtonProps extends UnstyledButtonProps {
  image: string;
  name: string;
  icon?: React.ReactNode;
}

export const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(function UserButton(
  { image, name, ...others }: UserButtonProps,
  ref
) {
  return (
    <UnstyledButton
      ref={ref}
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        padding: 10,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
        borderRadius: 5,

        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1],
        },
      })}
      {...others}
    >
      <Flex gap="md" justify="flex-start" align="center" direction="row">
        <Avatar src={image} size={28} />
        <Flex gap="md" justify="flex-start" align="center" direction="row">
          <Text
            size="sm"
            weight={500}
            sx={{ textOverflow: 'ellipsis', overflow: 'hidden', width: 150 }}
          >
            {name}
          </Text>
        </Flex>
      </Flex>
    </UnstyledButton>
  );
});
