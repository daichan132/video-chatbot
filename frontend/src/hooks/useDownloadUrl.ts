import { useState, useEffect } from 'react';
import useSupabaseStore from '@/stores/supabaseStore';
import { supabase } from '../utils/supabase';

export const useDownloadUrl = (filePath: string | undefined, key: 'avatars' | 'posts') => {
  const session = useSupabaseStore((state) => state.session);
  const [isLoading, setIsLoading] = useState(false);
  const [fullUrl, setFullUrl] = useState('');
  const bucketName = key === 'avatars' ? 'avatars' : 'posts';
  useEffect(() => {
    if (filePath) {
      const download = async () => {
        setIsLoading(true);
        const { data, error } = await supabase.storage
          .from(bucketName)
          .download(`${session?.user.id}/${filePath}`);
        if (error) {
          setIsLoading(false);
          throw error;
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        setFullUrl(URL.createObjectURL(data!));
        setIsLoading(false);
      };
      download();
    }
  }, [filePath, bucketName, session?.user.id]);

  return { isLoading, fullUrl, setFullUrl };
};
