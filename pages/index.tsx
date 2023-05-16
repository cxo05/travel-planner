import type { GetServerSideProps, NextPage } from 'next'
import { getSession, useSession } from "next-auth/react"

import { Card } from 'primereact/card';
import prisma from '../lib/prisma';
import { Plan } from '@prisma/client';
import { useState } from 'react';

interface Plans {
  plans: Plan[]
}

const Home: NextPage<Plans> = ({ plans }) => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)

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
      viewPlan(data.id)
    })
  }

  const viewPlan = (id: String) => {
    window.location.href = "/plans/" + id;
  }

  return (
    <main>
      <p className='text-xl py-4'>Your Plans</p>
      <div>
        {session && session.user ? (
          <>
            <div className="grid grid-cols-4 gap-4">
              {plans.map((obj) => (
                <Card className="hover:bg-slate-200" key={obj.id} title={obj.title} onClick={() => viewPlan(obj.id)}>
                  <p>{new Date(obj.startDate).toDateString()}</p>
                  {obj.endDate ? <p>{new Date(obj.endDate).toDateString()}</p> : <></>}
                </Card>
              ))}
              <div className='grid custom-card bg-slate-300 hover:bg-slate-600 place-content-center' onClick={() => handleNewPlan()}>
                {loading ?
                  <i className='pi pi-spin pi-spinner text-4xl'></i> :
                  <i className='pi pi-plus text-4xl'></i>}
              </div>
            </div>
          </>
        ) : (
          <p>You need to sign in to save your progress</p>
        )}
      </div>
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