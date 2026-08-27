import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/layout/Layout';

import { LoadingProvider } from '../components/GlobalLoader';
import { GoogleOAuthProvider } from '@react-oauth/google';
import SecretAdminAccess from '../components/SecretAdminAccess';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'dummy-client-id';
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LoadingProvider>
        <Layout>
          <SecretAdminAccess />
          <Component {...pageProps} />
        </Layout>
      </LoadingProvider>
    </GoogleOAuthProvider>
  );
}

export default MyApp;
