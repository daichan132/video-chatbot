/* eslint-disable react/no-unknown-property */
import { AppProps } from 'next/app';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import Head from 'next/head';
import { Suspense, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { NextPage } from 'next';
import useSupabaseStore from 'src/stores/supabaseStore';
import { supabase } from '@/lib/supabase';
import router from 'next/router';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      suspense: true,
    },
  },
});

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  const setSession = useSupabaseStore((state) => state.setSession);
  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session && router.asPath === '/') router.push(`/c`);
    });
  }, [setSession]);

  return (
    <>
      <Head>
        <title>chatbot</title>
        <meta name="description" content="chatbot" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
          <QueryClientProvider client={queryClient}>
            <Suspense fallback={<div />}>{getLayout(<Component {...pageProps} />)}</Suspense>
            <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
          </QueryClientProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
};
App.getInitialProps = async () => ({ pageProps: {} });
export default App;
