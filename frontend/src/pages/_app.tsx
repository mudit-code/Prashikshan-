import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/layout/Layout';

import { LoadingProvider } from '../components/GlobalLoader';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LoadingProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </LoadingProvider>
  );
}

export default MyApp;
