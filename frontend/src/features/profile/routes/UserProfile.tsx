import { type FC } from 'react';
import { Loader, Menu } from '@mantine/core';
import { supabase } from '@/utils/supabase';
import { IoLogOutOutline, IoSettingsOutline } from 'react-icons/io5';
import { useDisclosure } from '@mantine/hooks';
import useSupabaseStore from '@/stores/supabaseStore';
import { useQueryClient } from 'react-query';
import { useDownloadUrl } from '@/hooks/useDownloadUrl';
import useChatStore from '@/stores/chatStore';
import router from 'next/router';
import { useQueryProfile } from '../hooks/useQueryProfile';
import { UserButton } from '../components/UserButton';
import { SettingsModal } from '../components/SettingsModal';

export const UserProfile: FC = () => {
  const queryClient = useQueryClient();
  const { data: profile, refetch, isLoading: isLoadingProfile } = useQueryProfile();
  const { fullUrl: avatarUrl, isLoading: isLoadingDownload } = useDownloadUrl(
    profile?.avatar_url || null,
    'avatars'
  );

  const resetProfile = useSupabaseStore((state) => state.resetEditedProfile);
  const resetChat = useChatStore((state) => state.resetChat);

  const signOut = () => {
    resetProfile();
    resetChat();
    supabase.auth.signOut();
    queryClient.removeQueries('profile');
    queryClient.removeQueries('messages');
    router.push('/');
  };
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <div>
            {isLoadingDownload ||
              isLoadingProfile ||
              (!(avatarUrl && profile?.username) ? (
                <Loader />
              ) : (
                <UserButton image={avatarUrl} name={profile.username} />
              ))}
          </div>
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
