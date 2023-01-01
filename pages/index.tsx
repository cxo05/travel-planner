import type { NextPage } from 'next'
import Head from 'next/head'
import { useSession } from "next-auth/react"
import Navbar from '../components/navbar'
import PlaceList from '../components/placeList'
import DatePicker from '../components/datePicker'
import { useState } from 'react'
import TimeLine from '../components/timeline'
import useSwr from 'swr'
import fetcher from '../lib/fetcher'

import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";


const Home: NextPage = () => {
  const { data: session } = useSession()

  let [daysNum, setDaysNum] = useState(0)

  const places = ['ONE', 'TWO', 'THREE', '4', '5', '6', '7', '8'];

  const { data, error, isLoading } = useSwr(`/api/user/${session?.user.id}`, fetcher)

  return (
    <div className="container mx-auto">
      <Head>
        <title>Travel Planner</title>
        <meta name="description" content="Travel Planner" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar></Navbar>
      <main>
        <div>

        </div>
        <div>
          {session && session.user ? (
            <>
              <div>
                <p>Select Days</p>
                <DatePicker getDaysNum={setDaysNum}></DatePicker>
                <TimeLine daysNum={daysNum}></TimeLine>
              </div>
              <PlaceList places={places}></PlaceList>
            </>
          ) : (
            <p>You need to sign in to save your progress</p>
          )}
        </div>
      </main >
    </div >
  )
}

export default Home