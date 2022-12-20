import Head from 'next/head'
import { SessionProvider } from 'next-auth/react';

import '../styles/globals.css'
import Navbar from '../components/ui/Navbar';

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <title>SIB</title>
      </Head>
      <div className="flex flex-col h-screen">
        <header className="bg-slate-800 drop-shadow-md py-4 px-12">
          <Navbar />
        </header>
        <main className="flex h-full py-4 bg-slate-400">
          <Component {...pageProps} />
        </main>
      </div>
    </SessionProvider>
  )
}

export default MyApp
