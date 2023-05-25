import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '../../../lib/prisma'
import { CalendarEvent, ScheduledItemsWithDetails } from '../../../lib/swr';

function computeCalendarEvents(scheduledItems: ScheduledItemsWithDetails[]): CalendarEvent[] {
  return scheduledItems.map((scheduledItem) => {
    return new CalendarEvent(scheduledItem)
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { planId } = req.query;

  const { itemId, startDate, endDate } = req.body;

  switch (req.method) {
    case 'GET':
      const getScheduledItems = await prisma.scheduledItem.findMany({
        where: {
          planId: String(planId),
        },
        include: {
          Item: {
            select: {
              category: true,
              name: true
            }
          }
        }
      })
      res.json(computeCalendarEvents(getScheduledItems));
      break
    case 'POST':
      const addScheduledItem = await prisma.scheduledItem.create({
        data: {
          planId: String(planId),
          ItemId: parseInt(itemId),
          startDate: startDate,
          endDate: endDate,
        },
      })
      res.json(addScheduledItem);
      break
  }
}