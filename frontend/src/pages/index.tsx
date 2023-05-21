/* eslint-disable no-shadow */
import { Layout } from '@/components/layout';
import { Chatbot } from '@/features/chatbot';
import { LoginForm } from '@/features/auth';
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
  return (
    <div>
      {!session ? (
        <LoginForm />
      ) : (
        <Layout>
          <Chatbot />
        </Layout>
      )}
    </div>
  );
};

export default Home;
