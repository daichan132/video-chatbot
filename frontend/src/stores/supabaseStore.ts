import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';
import { devtools } from 'zustand/middleware';
import { EditedProfile } from '@/types';

type State = {
  session: Session | null;
  setSession: (payload: Session | null) => void;
  editedProfile: EditedProfile;
  updateEditedProfile: (payload: EditedProfile) => void;
  resetEditedProfile: () => void;
};
const useSupabaseStore = create<State>()(
  devtools((set) => ({
    session: null,
    setSession: (payload) => set({ session: payload }, false, 'setSession'),
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
  }))
);

export default useSupabaseStore;
