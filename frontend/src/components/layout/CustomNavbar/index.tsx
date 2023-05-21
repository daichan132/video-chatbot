import { UserProfile } from '@/features/profile';
import { Navbar, Stack } from '@mantine/core';
import { Suspense } from 'react';

export const CustomNavbar = () => {
  return (
    <Navbar width={{ base: 240 }} p="xs">
      <Navbar.Section grow mt={50}>
        {' '}
      </Navbar.Section>
      <Navbar.Section>
        <Stack justify="center" spacing={0}>
          <Suspense fallback={<div />}>
            <UserProfile />
          </Suspense>
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
};
