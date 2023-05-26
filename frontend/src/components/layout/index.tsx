import { AppShell } from '@mantine/core';
import { CustomNavbar } from './CustomNavbar';

type LayoutProps = { children: React.ReactNode };
const Layout = ({ children }: LayoutProps) => {
  return (
    <AppShell padding={0} navbar={<CustomNavbar />}>
      {children}
    </AppShell>
  );
};

export const createGetLayout = (
  layoutProps?: LayoutProps
): ((page: React.ReactElement) => React.ReactNode) => {
  return function getLayout(page: React.ReactElement) {
    return <Layout {...layoutProps}>{page}</Layout>;
  };
};
