import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';
import { devtools } from 'zustand/middleware';

type State = {
  session: Session | null;
  setSession: (payload: Session | null) => void;
};
const useStore = create<State>()(
  devtools((set) => ({
    session: null,
    setSession: (payload) => set({ session: payload }, false, 'setSession'),
  }))
);

export default useStore;
