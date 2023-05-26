/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueryClient, useMutation } from 'react-query';
import { supabase } from '@/utils/supabase';
import useSupabaseStore from '@/stores/supabaseStore';
import useChatStore from '@/stores/chatStore';
import router from 'next/router';

export const useMutateChat = () => {
  const queryClient = useQueryClient();
  const session = useSupabaseStore((state) => state.session);
  const model = useChatStore((state) => state.model);
  const system_prompt = useChatStore((state) => state.system_prompt);
  const advanced_settings = useChatStore((state) => state.advanced_settings);

  const addChatMutation = useMutation(
    async () => {
      const { data, error } = await supabase
        .from('chats')
        .insert({
          owner: session?.user.id,
          model,
          system_prompt,
          advanced_settings: JSON.stringify(advanced_settings),
          title: 'New Conversation',
        })
        .select(`*`)
        .single();
      if (error) throw new Error(error.message);
      router.push(`/c/${data.id}`);
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
  const deleteChatMutation = useMutation(
    async (chatId: string) => {
      const { data, error } = await supabase.from('chats').delete().eq('id', chatId);
      if (error) throw new Error(error.message);
      router.push(`/c`);
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
  return { addChatMutation, deleteChatMutation };
};
