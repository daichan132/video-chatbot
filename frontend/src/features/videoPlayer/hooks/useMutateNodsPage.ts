/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueryClient, useMutation } from 'react-query';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/customSupabase';

interface UpdateNodsPageType {
  nods_page: Tables['nods_page']['Update'];
  nodsPageId: number;
}

export const useMutateNodsPage = () => {
  const queryClient = useQueryClient();

  const addNodsPageMutation = useMutation(
    async (nods_page: Tables['nods_page']['Insert']) => {
      const { data, error } = await supabase
        .from('nods_page')
        .insert(nods_page)
        .select('*')
        .single();

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

  const updateNodsPageMutation = useMutation(
    async (input: UpdateNodsPageType) => {
      const { nods_page, nodsPageId } = input;
      const { data, error } = await supabase
        .from('nods_page')
        .update(nods_page)
        .eq('id', nodsPageId)
        .select('*')
        .single();

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

  return { addNodsPageMutation, updateNodsPageMutation };
};
