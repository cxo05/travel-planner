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

const planWithCollaborators = Prisma.validator<Prisma.PlanArgs>()({
  include: {
    UsersOnPlan: {
      select: {
        user: true
      }
    }
  }
})

export type PlanWithCollaborators = Prisma.PlanGetPayload<typeof planWithCollaborators>

const planWithItems = Prisma.validator<Prisma.PlanArgs>()({
  include: {
    ScheduledItems: {
      select: {
        Item: true,
        id: true,
        startDate: true,
        endDate: true
      }
    },
  }
})

export type PlanWithItems = Prisma.PlanGetPayload<typeof planWithItems>

const itemInclude = Prisma.validator<Prisma.ItemArgs>()({
  include: {
    _count: {
      select: {
        ScheduledItem: true
      }
    }
  }
})

export type ItemInclude = Prisma.ItemGetPayload<typeof itemInclude>

export class CalendarEvent {
  title: string
  category: Category
  itemId: number
  start?: Date
  end?: Date
  scheduledItemId?: number
  planId: string
  // desc: string
  allDay?: boolean

  constructor(scheduledItem: ScheduledItemsWithDetails) {
    this.title = scheduledItem.Item.name
    this.category = scheduledItem.Item.category
    this.itemId = scheduledItem.ItemId
    this.start = scheduledItem.startDate
    this.end = scheduledItem.endDate
    this.scheduledItemId = scheduledItem.id
    this.planId = scheduledItem.planId
    this.allDay = false
  }
}

// export const useItem = (itemId: number | undefined) => {
//   const { data, error, isLoading } = useSWR<ItemInclude>(itemId ? `/api/item/${itemId}` : null, fetcher)

//   return {
//     item: data,
//     isLoading,
//     isError: error
//   }
// }

export const useItems = (planId: string | string[] | undefined) => {
  const { data, error, isLoading } = useSWR<ItemInclude[]>(`/api/item?planId=${planId}`, fetcher)

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