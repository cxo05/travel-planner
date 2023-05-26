import { useSession } from 'next-auth/react'
import PlaceList from '../../components/placeList'

import dayjs from 'dayjs'
import { Calendar, EventProps, Views, dayjsLocalizer } from 'react-big-calendar'
import withDragAndDrop, { DragFromOutsideItemArgs, withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { useRouter } from 'next/router'

import { useCallback, useMemo, useState } from 'react'
import { usePlan, useCalendarEvents, CalendarEvent } from '../../lib/swr'
import { Category, ScheduledItem } from '@prisma/client'
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

  // const { plan, isLoading: isLoadingPlan, isError: isErrorPlan } = usePlan(id)

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

  const EventComponent = ({ event }: EventProps<CalendarEvent>) => {
    let icon;
    switch (event.category) {
      case Category.SIGHTSEEING:
        icon =
          <span className="material-symbols-outlined px-1">
            landscape
          </span>
        break;
      case Category.ACTIVITIES:
        // Maybe an icon
        break;
      case Category.FOOD:
        icon =
          <span className="material-symbols-outlined px-1">
            restaurant
          </span>
        break;
    }

    return (
      <div className='h-full flex flex-col items-center justify-center'>
        {icon}
        <span>{event.title}</span>
      </div>
    )
  }

  const eventPropGetter = (event: CalendarEvent) => ({
    ...(event.category == Category.FOOD && {
      className: 'bg-teal-400',
    }),
    ...(event.category == Category.SIGHTSEEING && {
      className: 'bg-lime-500',
    }),
  })

  if (isLoadingItem) return <div>Loading ...</div>
  if (isErrorItem) return <div>An error occured</div>

  const DnDCalendar = withDragAndDrop<CalendarEvent>(Calendar)

  const placeListHeight = '275px'

  return (
    <main style={{ height: `calc(800px + ${placeListHeight})` }}>
      <div className='h-full'>
        {session && session.user ? (
          <DndProvider backend={HTML5Backend}>
            <div style={{ height: "800px" }}>
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
                components={{
                  event: EventComponent,
                }}
                eventPropGetter={eventPropGetter}
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
            <div className="container fixed bottom-0" style={{ height: `${placeListHeight}` }}>
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