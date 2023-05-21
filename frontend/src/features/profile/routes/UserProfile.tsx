import { Suspense, type FC } from 'react';
import { Menu } from '@mantine/core';
import { supabase } from '@/utils/supabase';
import { IoLogOutOutline, IoSettingsOutline } from 'react-icons/io5';
import { useDisclosure } from '@mantine/hooks';
import useSupabaseStore from '@/stores/supabaseStore';
import { useQueryClient } from 'react-query';
import { useDownloadUrl } from '@/hooks/useDownloadUrl';
import { useQueryProfile } from '../hooks/useQueryProfile';
import { UserButton } from '../components/UserButton';
import { SettingsModal } from '../components/SettingsModal';

export const UserProfile: FC = () => {
  const queryClient = useQueryClient();
  const { data: profile, refetch } = useQueryProfile();
  const { fullUrl: avatarUrl } = useDownloadUrl(profile?.avatar_url, 'avatars');

  const resetProfile = useSupabaseStore((state) => state.resetEditedProfile);
  const signOut = () => {
    resetProfile();
    supabase.auth.signOut();
    queryClient.removeQueries(['profile']);
  };
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <UserButton image={avatarUrl || ''} name={profile?.username || ''} />
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item icon={<IoSettingsOutline size={20} />} onClick={open}>
            Settings
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item icon={<IoLogOutOutline size={20} />} onClick={signOut}>
            Log out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Suspense fallback={<div />}>
        <SettingsModal opened={opened} close={close} refetch={refetch} />
      </Suspense>
    </>
  );
};
