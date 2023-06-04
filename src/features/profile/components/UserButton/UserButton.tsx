import { UnstyledButton, UnstyledButtonProps, Group, Avatar, Text, Flex } from '@mantine/core';
import { forwardRef } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';

interface UserButtonProps extends UnstyledButtonProps {
  image: string;
  name: string;
  icon?: React.ReactNode;
}

export const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(function UserButton(
  { image, name, icon, ...others }: UserButtonProps,
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
      <Group spacing={6}>
        <Avatar src={image} size={28} />
        {/* <div style={{ flex: 1 }}> */}
        <Flex gap="md" justify="flex-start" align="center" direction="row">
          <Text
            size="sm"
            weight={500}
            sx={{ textOverflow: 'ellipsis', overflow: 'hidden', width: '60%' }}
          >
            {name}
          </Text>
          {icon || <BsThreeDotsVertical size="0.9rem" />}
        </Flex>
        {/* </div> */}

        {/* {icon || <BsThreeDotsVertical size="0.9rem" />} */}
      </Group>
    </UnstyledButton>
  );
});
