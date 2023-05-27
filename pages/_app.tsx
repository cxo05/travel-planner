import type { AppProps } from 'next/app'

import { SessionProvider } from "next-auth/react"
import Layout from '../components/layout'

import "primereact/resources/themes/bootstrap4-light-blue/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";

import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'

import '../styles/calendar.css'

import '../styles/globals.css'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  )
}