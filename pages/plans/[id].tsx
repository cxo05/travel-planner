import { useSession } from 'next-auth/react'
import PlaceList from '../../components/placeList'

import dayjs from 'dayjs'
import { Calendar, Views, dayjsLocalizer } from 'react-big-calendar'
import withDragAndDrop, { DragFromOutsideItemArgs, withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Button } from 'primereact/button'

import { useRouter } from 'next/router'

import { useCallback, useMemo, useState } from 'react'
import { usePlan, useCalendarEvents, CalendarEvent } from '../../lib/swr'
import { ScheduledItem } from '@prisma/client'
import { mutate } from 'swr'

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

  const { plan, isLoading: isLoadingPlan, isError: isErrorPlan } = usePlan(id)

  const { calendarEvents, isLoading: isLoadingItem, isError: isErrorItem } = useCalendarEvents(id)

  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent>()
  //const [displayDragItemInCell, setDisplayDragItemInCell] = useState(true)

  const handleDragStart = useCallback((event: CalendarEvent) => {
    console.log(event)
    setDraggedEvent(event)
  }, [])

  //const dragFromOutsideItem = () => { return draggedEvent }

  // const handleDisplayDragItemInCell = useCallback(
  //   () => setDisplayDragItemInCell((prev) => !prev),
  //   []
  // )

  const onEventDrop: withDragAndDropProps<CalendarEvent>['onEventDrop'] =
    ({ event, start, end }) => {
      console.log("Moving scheduled Event");
      fetch(`/api/scheduledItem/${event.scheduledItemId}`, {
        body: JSON.stringify({ startDate: start, endDate: end }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'PUT'
      }).then((res) => {
        console.log(res);
        return res.json() as Promise<ScheduledItem>
      }).then((data) => {
        mutate(`/api/scheduledItem?planId=${id}`)
      })
    }

  const onEventResize: withDragAndDropProps<CalendarEvent>['onEventResize'] =
    ({ event, start, end }) => {
      console.log("Resizing scheduled Event");
      fetch(`/api/scheduledItem/${event.scheduledItemId}`, {
        body: JSON.stringify({ startDate: start, endDate: end }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'PUT'
      }).then((res) => {
        console.log(res);
        return res.json() as Promise<ScheduledItem>
      }).then((data) => {
        mutate(`/api/scheduledItem?planId=${id}`)
      })
    }

  const onDropFromOutside = useCallback(
    ({ start, end, allDay: isAllDay }: DragFromOutsideItemArgs) => {
      console.log("onDropFromOutside");
      console.log(draggedEvent);

      fetch(`/api/scheduledItem?planId=${id}`, {
        body: JSON.stringify({ itemId: draggedEvent?.itemId, startDate: start, endDate: end }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }).then((res) => {
        setDraggedEvent(undefined)
        return res.json() as Promise<ScheduledItem>
      }).then((data) => {
        console.log(data)
        mutate(`/api/scheduledItem?planId=${id}`)
      })
    },
    [draggedEvent, setDraggedEvent, id]
  )

  if (isLoadingPlan || isLoadingItem) return <div>Loading ...</div>
  if (isErrorPlan || isErrorItem) return <div>An error occured</div>

  const DnDCalendar = withDragAndDrop<CalendarEvent>(Calendar)

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
                events={calendarEvents}
                localizer={djLocalizer}
                step={60}
                views={{
                  month: true,
                  week: true,
                  agenda: true
                }}
                defaultView={defaultView}
                dayLayoutAlgorithm={'no-overlap'}
                // dragFromOutsideItem={
                //   displayDragItemInCell ? dragFromOutsideItem : undefined
                // }
                onDropFromOutside={onDropFromOutside}
                //onDragOver={customOnDragOver}
                onEventDrop={onEventDrop}
                onEventResize={onEventResize}
                handleDragStart={handleDragStart}
                resizable
              />
            </div>
            <div className="container absolute bottom-0">
              <div className="" style={{ boxShadow: "0 -5px 5px -5px #333", backgroundColor: "white" }}>
                <PlaceList handleDragStart={handleDragStart}></PlaceList>
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