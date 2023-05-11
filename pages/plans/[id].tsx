import { useSession } from 'next-auth/react'
import PlaceList from '../../components/placeList'
import TimeLine from '../../components/timeline'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Button } from 'primereact/button'

import { Prisma } from '@prisma/client';
import useSWR from 'swr'
import { useRouter } from 'next/router'
import fetcher from '../../lib/fetcher'

const planWithItems = Prisma.validator<Prisma.PlanArgs>()({
  include: { Items: true },
})

type PlanWithItems = Prisma.PlanGetPayload<typeof planWithItems>

const PlanPage = () => {
  const { data: session } = useSession()

  const router = useRouter()
  const { id } = router.query

  const { data, error } = useSWR<PlanWithItems>(id ? `/api/plan/${id}` : null, fetcher)

  if (error) return <div>An error occured.</div>
  if (!data) return <div>Loading ...</div>

  var tem = new Array();
  var startDate = new Date(data.startDate);
  // var endDate = new Date(plan!.endDate);
  // while (startDate <= endDate) {
  //   tem.push(new Date(startDate));
  //   startDate.setDate(startDate.getDate() + 1);
  // }

  return (
    <main>
      <div>
        {session && session.user ? (
          <DndProvider backend={HTML5Backend}>
            <div className='inline-flex'>
              <Button icon="pi pi-home" rounded onClick={() => { window.location.href = "/"; }} />
              <div className="font-medium text-2xl pl-4">{data.title}</div>
            </div>
            <div>
              <TimeLine dates={tem}></TimeLine>
            </div>
            <div style={{ boxShadow: "0 -5px 5px -5px #333", position: "sticky", bottom: "0", backgroundColor: "white" }}>
              <PlaceList places={data.Items}></PlaceList>
            </div>
          </DndProvider>
        ) : (
          <p>You need to sign in to save your progress</p>
        )}
      </div>
    </main >
  )
}

export default PlanPage