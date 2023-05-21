import useSupabaseStore from '@/stores/supabaseStore';
import { Avatar, Modal, TextInput, Text, Stack, Button } from '@mantine/core';
import { useEffect, type FC } from 'react';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useDownloadUrl } from '@/hooks/useDownloadUrl';
import { useUploadAvatarImg } from '../../hooks/useUploadAvatarImg';
import { useMutateProfile } from '../../hooks/useMutateProfile';

type SettingsModalType = {
  opened: boolean;
  close: () => void;
  refetch: () => void;
};
export const SettingsModal: FC<SettingsModalType> = ({ opened, close, refetch }) => {
  const session = useSupabaseStore((state) => state.session);
  const editedProfile = useSupabaseStore((state) => state.editedProfile);
  const { fullUrl: avatarUrl } = useDownloadUrl(editedProfile.avatar_url, 'avatars');

  const { useMutateUploadAvatarImg } = useUploadAvatarImg();
  const { updateProfileMutation } = useMutateProfile();

  const update = useSupabaseStore((state) => state.updateEditedProfile);
  const updateProfile = () => {
    updateProfileMutation.mutate({
      id: session?.user?.id,
      username: editedProfile.username,
      avatar_url: editedProfile.avatar_url,
    });
  };
  useEffect(() => {
    if (updateProfileMutation.isSuccess) {
      refetch();
    }
  }, [refetch, updateProfileMutation.isSuccess]);
  return (
    <Modal opened={opened} onClose={close} centered size="lg">
      <Stack>
        <TextInput
          placeholder="Your name"
          label="UserName"
          value={editedProfile.username || ''}
          onChange={(e) => update({ ...editedProfile, username: e.target.value })}
        />
        <Avatar src={avatarUrl} size={80} />
        <Dropzone
          loading={useMutateUploadAvatarImg.isLoading}
          accept={IMAGE_MIME_TYPE}
          onDrop={(files) => useMutateUploadAvatarImg.mutate(files)}
        >
          <Text align="center">Drop Icon image here</Text>
        </Dropzone>
        <Button
          type="submit"
          onClick={updateProfile}
          disabled={updateProfileMutation.isLoading || !editedProfile.username}
        >
          {updateProfileMutation.isLoading ? 'Loading ...' : 'Update'}
        </Button>
      </Stack>
    </Modal>
  );
};
