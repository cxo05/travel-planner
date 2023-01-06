import type { NextPage } from 'next'
import { useSession } from "next-auth/react"
import { useState } from 'react'
import useSwr from 'swr'
import fetcher from '../lib/fetcher'

import { BreadCrumb } from 'primereact/breadcrumb';

import SampleData from "./api/data.json";
import Link from 'next/link'
import { Button } from 'primereact/button'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column'

const Home: NextPage = () => {
  const { data: session } = useSession()

  let [daysNum, setDaysNum] = useState(0)

  const plans = SampleData.Plans;

  //const { data, error, isLoading } = useSwr(`/api/user/${session?.user.id}`, fetcher)

  const breadcrumbMenu = [
    {
      label: 'Plans',
      command: () => { window.location.hash = "/"; },
    },
  ];

  const home = { icon: 'pi pi-home', command: () => { window.location.hash = "/"; } }

  return (
    <main>
      <BreadCrumb model={breadcrumbMenu} home={home} />
      <div>
        {session && session.user ? (
          <>
            <DataTable selectionMode="single" value={plans} responsiveLayout="scroll"
              onRowClick={(event) => {
                window.location.href = "/plans/" + event.data.id;
              }}
            >
              <Column field="title" header="Title"></Column>
              <Column field="startDate" header="Start Date"></Column>
              <Column field="endDate" header="End Date"></Column>
            </DataTable>
          </>
        ) : (
          <p>You need to sign in to save your progress</p>
        )}
      </div>
    </main >
  )
}

export default Home