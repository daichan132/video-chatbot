/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueryClient, useMutation } from 'react-query';
import { supabase } from '@/lib/supabase';
import router from 'next/router';
import { useUser } from '@supabase/auth-helpers-react';
import { useMutateNodsPage } from '@/features/videoPlayer';
import { Tables } from '@/types/customSupabase';
import { shallow } from 'zustand/shallow';
import useChatStore from '../../../stores/chatStore';

export const useMutateChat = () => {
  const queryClient = useQueryClient();
  const model = useChatStore((state) => state.model);
  const system_prompt = useChatStore((state) => state.system_prompt);
  const user = useUser();
  const { addNodsPageMutation } = useMutateNodsPage();
  const id = useChatStore((state) => state.id, shallow);

  const addChatMutation = useMutation(
    async () => {
      const { data, error } = await supabase
        .from('chats')
        .insert({
          owner: user?.id,
          model,
          system_prompt,
          title: 'New Conversation',
        })
        .select(`*`)
        .single();
      if (error) throw new Error(error.message);
      addNodsPageMutation.mutate({ chat: data.id, owner: user?.id });
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
  const updateChatMutation = useMutation(
    async (chat: Tables['chats']['Update']) => {
      const { error } = await supabase.from('chat').update(chat).eq('id', id);

      if (error) throw new Error(error.message);
    },
    {
      onError: (err: any) => {
        alert(err.message);
      },
    }
  );
  return { addChatMutation, deleteChatMutation, updateChatMutation };
};
