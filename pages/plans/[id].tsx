import { useSession } from 'next-auth/react'
import PlaceList from '../../components/placeList'

import dayjs from 'dayjs'
import { Calendar, Views, dayjsLocalizer } from 'react-big-calendar'
import withDragAndDrop, { DragFromOutsideItemArgs, withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop'

import { useRouter } from 'next/router'

import { useCallback, useState } from 'react'
import { usePlan, useCalendarEvents, CalendarEvent } from '../../lib/swr'
import { Category, ScheduledItem } from '@prisma/client'
import { mutate } from 'swr'
import EventComponent from '../../components/Calendar/customEvent'
import ToolbarComponent from '../../components/Calendar/customToolbar'

const djLocalizer = dayjsLocalizer(dayjs)

const DnDCalendar = withDragAndDrop<CalendarEvent>(Calendar)

const PlanPage = () => {
  const { data: session } = useSession()

  const router = useRouter()
  const { id } = router.query

  // const { plan, isLoading: isLoadingPlan, isError: isErrorPlan } = usePlan(id)

  const { calendarEvents, isLoading: isLoadingItem, isError: isErrorItem } = useCalendarEvents(id)

  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent>()
  const dragFromOutsideItem = useCallback(() => draggedEvent, [draggedEvent])

  const handleDragStart = (event: CalendarEvent) => { setDraggedEvent(event) }

  const onEventDrop: withDragAndDropProps<CalendarEvent>['onEventDrop'] =
    ({ event, start, end }) => {
      fetch(`/api/scheduledItem/${event.scheduledItemId}`, {
        body: JSON.stringify({ startDate: start, endDate: end }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'PUT'
      }).then((res) => {
        return res.json() as Promise<ScheduledItem>
      }).then((data) => {
        mutate(`/api/scheduledItem?planId=${id}`)
      })
    }

  const onEventResize: withDragAndDropProps<CalendarEvent>['onEventResize'] =
    ({ event, start, end }) => {
      fetch(`/api/scheduledItem/${event.scheduledItemId}`, {
        body: JSON.stringify({ startDate: start, endDate: end }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'PUT'
      }).then((res) => {
        return res.json() as Promise<ScheduledItem>
      }).then((data) => {
        mutate(`/api/scheduledItem?planId=${id}`)
      })
    }

  const onDropFromOutside = useCallback(
    ({ start, end, allDay: isAllDay }: DragFromOutsideItemArgs) => {
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
        mutate(`/api/scheduledItem?planId=${id}`)
      })
    },
    [draggedEvent, setDraggedEvent, id]
  )

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

  const placeListHeight = '275px'

  return (
    <main style={{ height: `calc(800px + ${placeListHeight})` }}>
      <div className='h-full'>
        {session && session.user ? (
          <>
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
                defaultView={Views.WEEK}
                dayLayoutAlgorithm={'no-overlap'}
                components={{
                  event: EventComponent,
                  toolbar: (props) => {
                    let combinedProps = { ...props, planId: id };
                    return (<ToolbarComponent
                      {...combinedProps}
                    />)
                  }
                }}
                eventPropGetter={eventPropGetter}
                //@ts-ignore
                dragFromOutsideItem={dragFromOutsideItem}
                onDropFromOutside={onDropFromOutside}
                onEventDrop={onEventDrop}
                onEventResize={onEventResize}
                resizable
              />
            </div>
            <div
              className="container fixed bottom-0 z-40"
              style={{ height: `${placeListHeight}` }}
              onDragOver={(e) => { e.stopPropagation() }}
              onDrop={(e) => { e.stopPropagation() }}
            >
              <div style={{ boxShadow: "0 -5px 5px -5px #333", backgroundColor: "white" }}>
                <PlaceList handleDragStart={handleDragStart}></PlaceList>
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

export default PlanPage