import { Database } from 'src/types/supabase';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_API_KEY as string
);
