import Head from 'next/head';
import { ReactNode } from 'react';
import Navbar from './navbar'

type Props = {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Head>
        <title>Travel Planner</title>
        <meta name="description" content="Travel Planner" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="container mx-auto mt-8 h-full">{children}</main>
    </>
  )
}