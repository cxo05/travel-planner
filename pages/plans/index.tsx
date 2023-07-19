import type { GetServerSideProps, NextPage } from 'next'
import { getSession } from "next-auth/react"

import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { AvatarGroup } from 'primereact/avatargroup';

import prisma from '../../lib/prisma';
import { User } from '@prisma/client';
import { useState, MouseEvent } from 'react';
import { useRouter } from 'next/router';
import { PlanWithCollaborators } from '../../lib/swr';
import SharingDialog from '../../components/sharingDialog';
import PlanDialog from '../../components/planDialog';

interface Plans {
  plans: PlanWithCollaborators[]
}

const PlansPage: NextPage<Plans> = ({ plans }) => {
  const [sharePlanVisiblePopUp, setSharePlanVisiblePopUp] = useState(false);
  const [addPlanVisiblePopUp, setAddPlanVisiblePopUp] = useState(false);
  const [sharePlanId, setSharePlanId] = useState('');

  const router = useRouter();

  async function handleNewPlan() {
    setAddPlanVisiblePopUp(true)
  }

  const share = (e: MouseEvent<HTMLElement>, planId: string) => {
    e.stopPropagation()
    setSharePlanId(planId)
    setSharePlanVisiblePopUp(true)
  }

  const title = (title: string, planId: string) => (
    <p className='flex justify-between items-center'>
      {title}
      <Button icon="pi pi-share-alt" rounded text aria-label="Share" onClick={(e) => share(e, planId)} />
    </p>
  )

  const footer = (users: User[]) => (
    <AvatarGroup>
      {users.map((user) => (
        //@ts-ignore
        <Avatar key={user.id} image={user.image || ''} shape='circle' pt={{ image: { "referrerPolicy": "no-referrer" } }}></Avatar>
      ))}
      {/* <Avatar label="+2" shape="circle" size="large" style={{ backgroundColor: '#9c27b0', color: '#ffffff' }} /> */}
    </AvatarGroup>
  )

  return (
    <div className='h-full p-3'>
      <p className='text-xl py-4'>Your Plans</p>
      <div className="grid auto-rows-fr grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5">
        <PlanDialog
          visible={addPlanVisiblePopUp}
          onHide={() => {
            setAddPlanVisiblePopUp(false)
          }}
        ></PlanDialog>
        {plans.map((plan) => (
          <Card
            className="hover:bg-slate-200"
            key={plan.id}
            title={title(plan.title, plan.id)}
            footer={footer(plan.UsersOnPlan.map(u => u.user))}
            onClick={() => router.push(`/plans/${plan.id}`)}
          >
            <p>{new Date(plan.startDate).toDateString()}</p>
            {plan.endDate && <p>{new Date(plan.endDate).toDateString()}</p>}
          </Card>
        ))}
        <div className='grid p-card bg-slate-300 hover:bg-slate-400 place-content-center min-h-[130px]' onClick={() => handleNewPlan()}>
          <i className='pi pi-plus text-4xl'></i>
        </div>
      </div>
      <SharingDialog planId={sharePlanId} visible={sharePlanVisiblePopUp} onHide={() => setSharePlanVisiblePopUp(false)}></SharingDialog>
    </div>
  )
}

export default PlansPage

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const plans = await prisma.usersOnPlan.findMany({
    where: {
      userId: String(session?.user.id),
    },
    select: {
      plan: {
        include: {
          UsersOnPlan: {
            select: {
              user: true
            }
          }
        }
      },
    }
  })

  return {
    props: {
      plans: JSON.parse(JSON.stringify(plans.map(p => p.plan)))
    }
  }
}