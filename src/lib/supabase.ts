import { Database } from 'src/types/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const supabase = createClientComponentClient<Database>();
