import Head from 'next/head'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return <>
    <Head>
      <title>Next.js File Storage</title>
    </Head>
    <div className="flex flex-col min-h-screen">
      <header className="bg-slate-800 drop-shadow-md py-4 px-12">
        <nav>
          <ul>
            <li className="brand text-white text-2xl">Testing File Storage Systems</li>
          </ul>
        </nav>
      </header>
      <main className="flex min-h-screen bg-slate-400">
        <Component {...pageProps} />
      </main>
    </div>
  </>
}

export default MyApp
