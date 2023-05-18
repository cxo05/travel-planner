import useSWR from "swr"
import fetcher from '../lib/fetcher'
import { Item } from "@prisma/client";

export const useItems = (planId: string | string[] | undefined): { items: Item[] | undefined, isLoading: boolean, isError: any, } => {
  const { data, error, isLoading } = useSWR<Item[]>(`/api/item?planId=${planId}`, fetcher)
 
  return {
    items: data,
    isLoading,
    isError: error
  }
}