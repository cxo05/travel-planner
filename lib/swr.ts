import useSWR from "swr"
import fetcher from '../lib/fetcher'
import { Item, Plan, Prisma } from "@prisma/client";

// const planWithItems = Prisma.validator<Prisma.PlanArgs>()({
//   include: { Items: true },
// })

// type PlanWithItems = Prisma.PlanGetPayload<typeof planWithItems>

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

export const usePlan = (planId: string | string[] | undefined) => {
  const { data, error, isLoading } = useSWR<Plan>(`/api/plan/${planId}`, fetcher)

  return {
    plan: data,
    isLoading,
    isError: error
  }
}