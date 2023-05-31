import { useState, useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '../lib/supabase';

export const useDownloadUrl = (filePath: string | null, key: 'avatars' | 'posts') => {
  const user = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [fullUrl, setFullUrl] = useState('');
  const bucketName = key === 'avatars' ? 'avatars' : 'posts';
  useEffect(() => {
    if (filePath) {
      const download = async () => {
        setIsLoading(true);
        const { data, error } = await supabase.storage
          .from(bucketName)
          .download(`${user?.id}/${filePath}`);
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
  }, [filePath, bucketName, user?.id]);

  return { isLoading, fullUrl, setFullUrl };
};
