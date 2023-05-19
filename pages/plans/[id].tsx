import { useSession } from 'next-auth/react'
import PlaceList from '../../components/placeList'

import dayjs from 'dayjs'
import { Calendar, Views, dayjsLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Button } from 'primereact/button'

import { useRouter } from 'next/router'

import temData from '../../components/temporaryData'
import { useMemo } from 'react'
import { usePlan } from '../../lib/swr'

const djLocalizer = dayjsLocalizer(dayjs)

const PlanPage = () => {
  const { data: session } = useSession()

  const router = useRouter()
  const { id } = router.query

  const { defaultView } = useMemo(
    () => ({
      defaultView: Views.WEEK,
    }),
    []
  )

  const { plan, isLoading, isError } = usePlan(id)

  if (isLoading) return <div>Loading ...</div>
  if (isError) return <div>An error occured</div>

  const DnDCalendar = withDragAndDrop(Calendar)

  return (
    <main>
      <div>
        {session && session.user ? (
          <DndProvider backend={HTML5Backend}>
            <div className='inline-flex'>
              <Button icon="pi pi-home" rounded onClick={() => { window.location.href = "/"; }} />
              <div className="font-medium text-2xl pl-4">{plan?.title}</div>
            </div>
            <div style={{ height: "700px" }}>
              <DnDCalendar
                defaultDate={dayjs().toDate()}
                events={temData}
                localizer={djLocalizer}
                step={60}
                views={{
                  month: true,
                  week: true,
                  agenda: true
                }}
                defaultView={defaultView}
                draggableAccessor={(event) => true}
                dayLayoutAlgorithm={'no-overlap'}
              />
            </div>
            <div className="container absolute bottom-0">
              <div className="" style={{ boxShadow: "0 -5px 5px -5px #333", backgroundColor: "white" }}>
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