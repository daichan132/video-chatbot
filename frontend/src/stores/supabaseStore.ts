import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { EditedProfile } from 'src/types/customSupabase';

type State = {
  editedProfile: EditedProfile;
  updateEditedProfile: (payload: EditedProfile) => void;
  resetEditedProfile: () => void;
};
const useSupabaseStore = create<State>()(
  devtools(
    (set) => ({
      editedProfile: { username: '', favorites: '', avatar_url: '' },
      updateEditedProfile: (payload) =>
        set(
          {
            editedProfile: {
              username: payload.username,
              avatar_url: payload.avatar_url,
            },
          },
          false,
          'updateEditedProfile'
        ),
      resetEditedProfile: () =>
        set({ editedProfile: { username: '', avatar_url: '' } }, false, 'resetEditedProfile'),
    }),
    { name: 'supabase-state' }
  )
);

export default useSupabaseStore;
