/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-alert */
import { useState } from 'react';
import { useMutation } from 'react-query';
import { supabase } from '@/lib/supabase';
import router from 'next/router';

export const useMutateAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const reset = () => {
    setEmail('');
    setPassword('');
  };
  const loginMutation = useMutation(
    async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error(error.message);
      // router.push('/c');
      router.reload();
    },
    {
      onError: (err: any) => {
        alert(err.message);
        reset();
      },
    }
  );
  const registerMutation = useMutation(
    async () => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: 'http://localhost:3000/api/auth/callback' },
      });
      if (error) throw new Error(error.message);
      // router.push('/c');
      router.reload();
    },
    {
      onError: (err: any) => {
        alert(err.message);
        reset();
      },
    }
  );
  return {
    email,
    setEmail,
    password,
    setPassword,
    loginMutation,
    registerMutation,
  };
};
