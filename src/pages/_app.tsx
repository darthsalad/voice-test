import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head';
import "regenerator-runtime/runtime";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Speech Recognition Sample</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
