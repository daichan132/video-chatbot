/* eslint-disable no-shadow */
import { Auth } from '@/components/elements';
import { Layout } from '@/components/layout';
import { Chatbot } from '@/features/Chatbot';
import useStore from '@/stores/supabaseStore';
import { supabase } from '@/utils/supabase';
import { useEffect } from 'react';

const Home = () => {
  const session = useStore((state) => state.session);
  const setSession = useStore((state) => state.setSession);
  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, [setSession]);
  return <Layout>{!session ? <Auth /> : <Chatbot />}</Layout>;
};

export default Home;
