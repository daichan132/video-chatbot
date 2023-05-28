/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueryClient, useMutation } from 'react-query';
import { supabase } from '@/lib/supabase';
import useSupabaseStore from 'src/stores/supabaseStore';
import { Tables } from '@/types/customSupabase';

export const useMutateMessage = () => {
  const queryClient = useQueryClient();
  const session = useSupabaseStore((state) => state.session);

  const addMessageMutation = useMutation(
    async (messages: Tables['messages']['Row'][]) => {
      const { data, error } = await supabase
        .from('messages')
        .insert(
          messages.map((message: any) => {
            return {
              chat: message.chat,
              content: message.content,
              role: message.role,
              owner: session?.user?.id,
              embedding: message.embedding,
              token_size: message.token_size,
            };
          })
        )
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
