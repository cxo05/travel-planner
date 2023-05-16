import { useSession } from 'next-auth/react'
import PlaceList from '../../components/placeList'

import dayjs from 'dayjs'
import { Calendar, dayjsLocalizer } from 'react-big-calendar'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Button } from 'primereact/button'

import { Prisma } from '@prisma/client';
import useSWR from 'swr'
import { useRouter } from 'next/router'
import fetcher from '../../lib/fetcher'
import { useMemo } from 'react'

import temData from '../../components/temporaryData'

const planWithItems = Prisma.validator<Prisma.PlanArgs>()({
  include: { Items: true },
})

type PlanWithItems = Prisma.PlanGetPayload<typeof planWithItems>

const djLocalizer = dayjsLocalizer(dayjs)

const PlanPage = () => {
  const { data: session } = useSession()

  const router = useRouter()
  const { id } = router.query

  const { defaultDate, max } = useMemo(
    () => ({
      defaultDate: new Date(2015, 3, 1),
      max: dayjs().endOf('day').subtract(1, 'hours').toDate(),
    }),
    []
  )

  const { data, error } = useSWR<PlanWithItems>(id ? `/api/plan/${id}` : null, fetcher)
  if (error) return <div>An error occured. {error.message}</div>
  if (!data) return <div>Loading ...</div>

  return (
    <main>
      <div>
        {session && session.user ? (
          <DndProvider backend={HTML5Backend}>
            <div className='inline-flex'>
              <Button icon="pi pi-home" rounded onClick={() => { window.location.href = "/"; }} />
              <div className="font-medium text-2xl pl-4">{data.title}</div>
            </div>
            <div style={{ height: "700px" }}>
              <Calendar
                defaultDate={dayjs().toDate()}
                events={temData}
                localizer={djLocalizer}
                step={60}
                views={{
                  month: true,
                  week: true,
                  agenda: true
                }} />
            </div>
            <div className="container absolute bottom-0">
              <div className="" style={{ boxShadow: "0 -5px 5px -5px #333", backgroundColor: "white" }}>
                {/* <PlaceList places={data.Items}></PlaceList> */}
                <PlaceList></PlaceList>
              </div>
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