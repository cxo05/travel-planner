import type { GetServerSideProps, NextPage } from 'next'
import { getSession, useSession } from "next-auth/react"

import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { AvatarGroup } from 'primereact/avatargroup';

import prisma from '../lib/prisma';
import { Plan } from '@prisma/client';
import { useState } from 'react';
import { useRouter } from 'next/router';

interface Plans {
  plans: Plan[]
}

const Home: NextPage<Plans> = ({ plans }) => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)

  const router = useRouter();

  async function handleNewPlan() {
    setLoading(true)
    fetch('/api/plan', {
      body: JSON.stringify({ title: 'New Plan', userId: session?.user.id }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    }).then((res) => {
      return res.json() as Promise<Plan>
    }).then((data) => {
      router.push(`/plans/${data.id}`)
    })
  }

  const footer = (
    <AvatarGroup>
      <Avatar image={session?.user.image} shape="circle" />
      {/* TODO Add other collaborators */}
      {/* <Avatar label="+2" shape="circle" size="large" style={{ backgroundColor: '#9c27b0', color: '#ffffff' }} /> */}
    </AvatarGroup>
  );

  return (
    <main className='container mx-auto p-3'>
      <p className='text-xl py-4'>Your Plans</p>
      {session && session.user ? (
        <div className="grid auto-rows-fr grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5">
          {plans.map((obj) => (
            <Card className="hover:bg-slate-200" key={obj.id} title={obj.title} footer={footer} onClick={() => router.push(`/plans/${obj.id}`)}>
              <p>{new Date(obj.startDate).toDateString()}</p>
              {obj.endDate ? <p>{new Date(obj.endDate).toDateString()}</p> : <></>}
            </Card>
          ))}
          <div className='grid p-card bg-slate-300 hover:bg-slate-400 place-content-center min-h-[130px]' onClick={() => handleNewPlan()}>
            {loading ?
              <i className='pi pi-spin pi-spinner text-4xl'></i> :
              <i className='pi pi-plus text-4xl'></i>}
          </div>
        </div>
      ) : (
        <p>You need to sign in to save your progress</p>
      )}
    </main >
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  const plans = await prisma.plan.findMany({
    where: {
      userId: String(session?.user.id),
    }
  })

  return {
    props: {
      plans: JSON.parse(JSON.stringify(plans))
    }
  }
}