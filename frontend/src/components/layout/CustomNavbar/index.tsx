import { Sidebar } from '@/features/chatbot';
import { UserProfile } from '@/features/profile';
import { Navbar, Stack } from '@mantine/core';

export const CustomNavbar = () => {
  return (
    <Navbar width={{ base: 240 }} p="xs">
      <Navbar.Section grow>
        <Sidebar />
      </Navbar.Section>
      <Navbar.Section>
        <Stack justify="center" spacing={0}>
          <UserProfile />
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
};
