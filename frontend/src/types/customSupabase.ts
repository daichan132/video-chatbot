import { Database } from './supabase';

export type Profile = {
  id: string | null;
  updated_at: string;
  created_at: string;
  username: string | null;
  avatar_url: string | null;
};
export type EditedProfile = {
  username: string | null;
  avatar_url: string | null;
};

export type Tables = Database['public']['Tables'];