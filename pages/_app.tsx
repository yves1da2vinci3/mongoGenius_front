import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { AppProps } from 'next/app';
import Head from 'next/head';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { theme } from '../theme';

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>MongoGenius - Générateur de données MongoDB</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ColorSchemeScript />
      <MantineProvider theme={theme} defaultColorScheme="auto">
        <ModalsProvider labels={{ confirm: 'Confirmer', cancel: 'Annuler' }}>
          <Notifications position="top-right" />
          <Component {...pageProps} />
        </ModalsProvider>
      </MantineProvider>
    </>
  );
}

export default App;
