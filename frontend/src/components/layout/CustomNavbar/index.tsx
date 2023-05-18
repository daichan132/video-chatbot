import { supabase } from '@/utils/supabase';
import { Navbar, Stack, Tooltip, UnstyledButton, createStyles, rem } from '@mantine/core';
import { IconType } from 'react-icons';
import { IoLogOutOutline } from 'react-icons/io5';
// import { useQueryClient } from 'react-query';

const useStyles = createStyles((theme) => ({
  link: {
    width: rem(50),
    height: rem(50),
    borderRadius: theme.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
    },
  },

  active: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    },
  },
}));

interface NavbarLinkProps {
  icon: IconType;
  label: string;
  active?: boolean;
  onClick?(): void;
}

const NavbarLink = ({ icon: Icon, label, active, onClick }: NavbarLinkProps) => {
  const { classes, cx } = useStyles();
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton onClick={onClick} className={cx(classes.link, { [classes.active]: active })}>
        <Icon size={24} />
      </UnstyledButton>
    </Tooltip>
  );
};

export const CustomNavbar = () => {
  // const queryClient = useQueryClient();
  const signOut = () => {
    supabase.auth.signOut();
    // queryClient.removeQueries('');
  };
  return (
    <Navbar width={{ base: 80 }} p="md">
      <Navbar.Section grow mt={50}>
        {' '}
      </Navbar.Section>
      <Navbar.Section>
        <Stack justify="center" spacing={0}>
          <NavbarLink icon={IoLogOutOutline} label="Logout" onClick={signOut} />
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
};
