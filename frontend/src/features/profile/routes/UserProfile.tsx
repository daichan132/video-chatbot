import { type FC } from 'react';
import { Box, Center, Loader, Menu } from '@mantine/core';
import { supabase } from '@/lib/supabase';
import { IoLogOutOutline, IoSettingsOutline } from 'react-icons/io5';
import { useDisclosure } from '@mantine/hooks';
import useSupabaseStore from 'src/stores/supabaseStore';
import { QueryCache } from 'react-query';
import { useDownloadUrl } from 'src/hooks/useDownloadUrl';
import router from 'next/router';
import { useQueryProfile } from '../hooks/useQueryProfile';
import { UserButton } from '../components/UserButton';
import { SettingsModal } from '../components/SettingsModal';

export const UserProfile: FC = () => {
  const { data: profile, refetch, isLoading: isLoadingProfile } = useQueryProfile();
  const { fullUrl: avatarUrl, isLoading: isLoadingDownload } = useDownloadUrl(
    profile?.avatar_url || null,
    'avatars'
  );

  const resetProfile = useSupabaseStore((state) => state.resetEditedProfile);
  const queryCache = new QueryCache();
  const signOut = async () => {
    resetProfile();
    queryCache.clear();
    await supabase.auth.signOut();
    router.reload();
  };
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Box h={50}>
            {isLoadingDownload || isLoadingProfile ? (
              <Center h="100%">
                <Loader color="gray" size="sm" />
              </Center>
            ) : (
              <UserButton image={avatarUrl} name={profile?.username || ''} />
            )}
          </Box>
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
      <SettingsModal opened={opened} close={close} refetch={refetch} />
    </>
  );
};
