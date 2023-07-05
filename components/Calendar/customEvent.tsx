import { EventProps } from "react-big-calendar";
import { CalendarEvent } from "../../lib/swr";
import { useState } from "react";
import { Category } from "@prisma/client";
import { mutate } from "swr";
import { useUndoRedo } from "../../lib/useUndoRedo";

const EventComponent = ({ event }: EventProps<CalendarEvent>) => {
  const [displayDelete, setDisplayDelete] = useState(false)

  let icon;
  switch (event.category) {
    case Category.SIGHTSEEING:
      icon = 'landscape'
      break;
    case Category.FOOD:
      icon = 'restaurant'
      break;
    case Category.ACTIVITIES:
      // Maybe an icon
      break;
  }

  const { reset } = useUndoRedo()

  const deleteEvent = (event: CalendarEvent) => {
    fetch(`/api/scheduledItem/${event.scheduledItemId}`, {
      method: 'DELETE'
    }).then((res) => {
      return res.json()
    }).then((data) => {
      reset()
      mutate(`/api/scheduledItem?planId=${event.planId}`)
    })
  }

  return (
    <div
      className='h-full flex flex-col items-center justify-center'
      onMouseEnter={() => setDisplayDelete(true)}
      onMouseLeave={() => setDisplayDelete(false)}
    >
      {displayDelete &&
        <div
          className='absolute right-0 top-0 p-2'
          onClick={() => deleteEvent(event)}
        >
          <i className="pi pi-times text-red-600 font-semibold"></i>
        </div>
      }
      <span className="material-icons-outlined px-1">
        {icon}
      </span>
      <span>{event.title}</span>
    </div>
  )
}

export default EventComponent