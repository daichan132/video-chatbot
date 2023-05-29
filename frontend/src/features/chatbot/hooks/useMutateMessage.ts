/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueryClient, useMutation } from 'react-query';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/customSupabase';

export const useMutateMessage = () => {
  const queryClient = useQueryClient();

  const addMessageMutation = useMutation(
    async (messages: Tables['messages']['Insert'][]) => {
      const { data, error } = await supabase
        .from('messages')
        .insert(messages)
        .select('id,role,content');

      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: (res) => {
        if (res) queryClient.setQueryData(['chat'], res);
      },
      onError: (err: any) => {
        alert(err.message);
      },
    }
  );

  return { addMessageMutation };
};
