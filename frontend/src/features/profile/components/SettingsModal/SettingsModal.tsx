import useSupabaseStore from 'src/stores/supabaseStore';
import {
  Avatar,
  Modal,
  TextInput,
  Text,
  Stack,
  Button,
  Loader,
  Grid,
  ActionIcon,
  useMantineColorScheme,
} from '@mantine/core';
import { useEffect, type FC } from 'react';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useDownloadUrl } from 'src/hooks/useDownloadUrl';
import { TbMoonStars, TbSunLow } from 'react-icons/tb';
import { useUser } from '@supabase/auth-helpers-react';
import { useUploadAvatarImg } from '../../hooks/useUploadAvatarImg';
import { useMutateProfile } from '../../hooks/useMutateProfile';

type SettingsModalType = {
  opened: boolean;
  close: () => void;
  refetch: () => void;
};
export const SettingsModal: FC<SettingsModalType> = ({ opened, close, refetch }) => {
  const editedProfile = useSupabaseStore((state) => state.editedProfile);
  const { fullUrl: avatarUrl, isLoading } = useDownloadUrl(editedProfile.avatar_url, 'avatars');
  const user = useUser();

  const { useMutateUploadAvatarImg } = useUploadAvatarImg();
  const { updateProfileMutation } = useMutateProfile();

  const update = useSupabaseStore((state) => state.updateEditedProfile);
  const updateProfile = () => {
    updateProfileMutation.mutate({
      id: user?.id,
      username: editedProfile.username,
      avatar_url: editedProfile.avatar_url,
    });
  };
  useEffect(() => {
    if (updateProfileMutation.isSuccess) {
      refetch();
    }
  }, [refetch, updateProfileMutation.isSuccess]);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  return (
    <Modal opened={opened} onClose={close} centered size="lg">
      <Stack spacing="xl">
        <TextInput
          placeholder="Your name"
          label="UserName"
          value={editedProfile.username || ''}
          onChange={(e) => update({ ...editedProfile, username: e.target.value })}
        />
        <Grid>
          <Grid.Col span="content">
            {isLoading ? <Loader size={56} /> : <Avatar src={avatarUrl} size={56} />}
          </Grid.Col>
          <Grid.Col span="auto">
            <Dropzone
              loading={useMutateUploadAvatarImg.isLoading}
              accept={IMAGE_MIME_TYPE}
              onDrop={(files) => useMutateUploadAvatarImg.mutate(files)}
              h="100%"
              sx={(theme) => ({
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: 0,
                backgroundColor:
                  theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
              })}
            >
              <Text>Drop Icon image here</Text>
            </Dropzone>
          </Grid.Col>
        </Grid>

        <ActionIcon
          variant="outline"
          color={dark ? 'yellow' : 'blue'}
          onClick={() => toggleColorScheme()}
          title="Toggle color scheme"
        >
          {dark ? <TbSunLow size="1.1rem" /> : <TbMoonStars size="1.1rem" />}
        </ActionIcon>
        <Button
          type="submit"
          variant="default"
          onClick={updateProfile}
          disabled={updateProfileMutation.isLoading || !editedProfile.username}
        >
          {updateProfileMutation.isLoading ? 'Loading ...' : 'Update'}
        </Button>
      </Stack>
    </Modal>
  );
};
