import { AppShell } from '@mantine/core';
import { CustomNavbar } from './CustomNavbar';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppShell padding={0} navbar={<CustomNavbar />}>
      {children}
    </AppShell>
  );
};
