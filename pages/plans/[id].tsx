import { getSession } from 'next-auth/react'
import PlaceList from '../../components/placeList'

import dayjs from 'dayjs'
import { Calendar, Views, dayjsLocalizer } from 'react-big-calendar'
import withDragAndDrop, { DragFromOutsideItemArgs, withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop'

import { useRouter } from 'next/router'

import { Sidebar } from 'primereact/sidebar';

import { useCallback, useEffect, useState } from 'react'
import { useCalendarEvents, CalendarEvent } from '../../lib/swr'
import { Category, ScheduledItem } from '@prisma/client'
import { mutate } from 'swr'
import EventComponent from '../../components/Calendar/customEvent'
import ToolbarComponent from '../../components/Calendar/customToolbar'
import { Button } from 'primereact/button'
import { GetServerSideProps } from 'next'
import { useJsApiLoader } from '@react-google-maps/api'
import { UndoRedoContext, useCustomReducer } from '../../lib/useUndoRedo'

const djLocalizer = dayjsLocalizer(dayjs)

const DnDCalendar = withDragAndDrop<CalendarEvent>(Calendar)

const libraries: ("drawing" | "geometry" | "localContext" | "places" | "visualization")[] = ["places"]

const PlanPage = () => {
  const router = useRouter()
  const { id } = router.query

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.GOOGLE_API_KEY || '',
    libraries: libraries
  })

  const [sidebarVisible, setSidebarVisible] = useState(true)

  const { calendarEvents, isLoading: isLoadingItem, isError: isErrorItem } = useCalendarEvents(id)

  const {
    state,
    setState,
    setInitialState,
    isInitialized,
    undo,
    redo,
    reset,
    isUndoPossible,
    isRedoPossible,
  } = useCustomReducer(null);

  useEffect(() => {
    console.log(state)
    if (!isInitialized || state == null) return
    fetch(state.input, state.init).then((res) => {
      if (!res.ok) {
        throw Error(res.statusText)
      }
      mutate(state.mutateString)
    })
  }, [isInitialized, state])

  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent>()
  const dragFromOutsideItem = useCallback(() => draggedEvent, [draggedEvent])

  const handleDragStart = (event: CalendarEvent) => { setDraggedEvent(event) }

  const onEventEdit: withDragAndDropProps<CalendarEvent>['onEventDrop'] =
    ({ event, start, end }) => {
      if (state == null) {
        setInitialState({
          input: `/api/scheduledItem/${event.scheduledItemId}`,
          init: {
            body: JSON.stringify({ startDate: event.start, endDate: event.end }),
            headers: { 'Content-Type': 'application/json' },
            method: 'PUT'
          },
          mutateString: `/api/scheduledItem?planId=${id}`
        })
      }
      setState({
        input: `/api/scheduledItem/${event.scheduledItemId}`,
        init: {
          body: JSON.stringify({ startDate: start, endDate: end }),
          headers: { 'Content-Type': 'application/json' },
          method: 'PUT'
        },
        mutateString: `/api/scheduledItem?planId=${id}`
      })
    }

  const onDropFromOutside = useCallback(
    ({ start, end, allDay: isAllDay }: DragFromOutsideItemArgs) => {
      fetch(`/api/scheduledItem?planId=${id}`, {
        body: JSON.stringify({ itemId: draggedEvent?.itemId, startDate: start, endDate: end }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST'
      }).then((res) => {
        setDraggedEvent(undefined)
        return res.json() as Promise<ScheduledItem>
      }).then((scheduledItem) => {
        reset()
        mutate(`/api/scheduledItem?planId=${id}`)
      })
    },
    [id, draggedEvent?.itemId, reset]
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

  return (
    <div className='h-full pt-2'>
      <div style={{ height: "800px" }}>
        <UndoRedoContext.Provider value={{ state, setState, setInitialState, undo, redo, reset, isUndoPossible, isRedoPossible }}>
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
              toolbar: (props) => (
                <ToolbarComponent
                  undoFunc={undo}
                  redoFunc={redo}
                  {...props}
                />
              )
            }}
            eventPropGetter={eventPropGetter}
            //@ts-ignore
            dragFromOutsideItem={dragFromOutsideItem}
            onDropFromOutside={onDropFromOutside}
            onEventDrop={onEventEdit}
            onEventResize={onEventEdit}
            resizable
          />
        </UndoRedoContext.Provider>
      </div>
      <div
        className="container fixed bottom-0 z-40 bg-white p-5 flex justify-center"
      >
        <Button icon="pi pi-arrow-up" rounded severity="success" onClick={() => setSidebarVisible(true)}></Button>
      </div>
      <Sidebar
        visible={sidebarVisible}
        position='bottom'
        maskStyle={{ 'animation': 'none' }}
        style={{ 'height': 'fit-content' }}
        onHide={() => setSidebarVisible(false)}
        showCloseIcon={false}
        dismissable={false}
        modal={false}
        onDragOver={(e) => { e.stopPropagation() }}
        onDrop={(e) => { e.stopPropagation() }}
      >
        <PlaceList handleDragStart={handleDragStart} handleClose={() => setSidebarVisible(false)}></PlaceList>
      </Sidebar>
    </div>
  )
}

export default PlanPage

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {}
  }
}