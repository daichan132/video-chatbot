import { Sidebar } from '@/features/chatbot';
import { UserProfile } from '@/features/profile';
import { Divider, Navbar, Stack } from '@mantine/core';

export const CustomNavbar = () => {
  return (
    <Navbar width={{ base: 240 }} p="xs">
      <Navbar.Section grow>
        <Sidebar />
      </Navbar.Section>
      <Divider pb="xs" />
      <Navbar.Section>
        <Stack justify="center" spacing={0}>
          <UserProfile />
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
};
