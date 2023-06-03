import { ActionIcon, AppShell, Box, rem } from '@mantine/core';
import { useState } from 'react';
import { AiOutlineRight, AiOutlineLeft } from 'react-icons/ai';
import { CustomNavbar } from './CustomNavbar';

type LayoutProps = { children: React.ReactNode };
const Layout = ({ children }: LayoutProps) => {
  const [visible, setVisible] = useState(true);

  return (
    <AppShell padding={0} navbar={visible ? <CustomNavbar /> : <div />}>
      <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
        <ActionIcon
          sx={{ position: 'absolute', bottom: rem(14), left: rem(20), zIndex: 100 }}
          onClick={() => setVisible(!visible)}
          size="lg"
          variant="default"
          radius="md"
        >
          {visible ? <AiOutlineLeft /> : <AiOutlineRight />}
        </ActionIcon>
        {children}
      </Box>
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
