import useSWR from "swr"
import fetcher from '../lib/fetcher'
import { Category, Item, Plan, Prisma } from "@prisma/client";
import dayjs from 'dayjs'

const scheduledItemsWithDetails = Prisma.validator<Prisma.ScheduledItemArgs>()({
  include: {
    Item: {
      select: {
        category: true,
        name: true
      }
    }
  },
})

export type ScheduledItemsWithDetails = Prisma.ScheduledItemGetPayload<typeof scheduledItemsWithDetails>

export class CalendarEvent {
  title: string
  category: Category
  itemId: number
  start?: Date
  end?: Date
  scheduledItemId?: number
  // desc: string
  allDay?: boolean

  constructor(scheduledItem: ScheduledItemsWithDetails) {
    this.title = scheduledItem.Item.name
    this.category = scheduledItem.Item.category
    this.itemId = scheduledItem.ItemId
    this.start = scheduledItem.startDate
    this.end = scheduledItem.endDate
    this.scheduledItemId = scheduledItem.id
    this.allDay = false
  }
}

export const useItem = (itemId: number | undefined) => {
  const { data, error, isLoading } = useSWR<Item>(itemId ? `/api/item/${itemId}` : null, fetcher)

  return {
    item: data,
    isLoading,
    isError: error
  }
}

export const useItems = (planId: string | string[] | undefined) => {
  const { data, error, isLoading } = useSWR<Item[]>(`/api/item?planId=${planId}`, fetcher)

  return {
    items: data,
    isLoading,
    isError: error
  }
}

export const useCalendarEvents = (planId: string | string[] | undefined) => {
  const { data, error, isLoading } = useSWR<CalendarEvent[]>(`/api/scheduledItem?planId=${planId}`, fetcher)

  data?.forEach((calendarEvent) => {
    calendarEvent.start = dayjs(calendarEvent.start).toDate()
    calendarEvent.end = dayjs(calendarEvent.end).toDate()
  })

  return {
    calendarEvents: data,
    isLoading,
    isError: error
  }
}

export const usePlan = (planId: string | string[] | undefined) => {
  const { data, error, isLoading } = useSWR<Plan>(`/api/plan/${planId}`, fetcher)

  return {
    plan: data,
    isLoading,
    isError: error
  }
}