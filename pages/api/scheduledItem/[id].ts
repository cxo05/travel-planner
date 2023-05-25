import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const scheduledItemId = req.query.id;

  const { startDate, endDate } = req.body;

  switch (req.method) {
    case 'GET':
      const getScheduledItem = await prisma.scheduledItem.findUnique({
        where: {
          id: parseInt(String(scheduledItemId)),
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
      res.json(getScheduledItem)
      break
    case 'PUT':
      const updateScheduledItem = await prisma.scheduledItem.update({
        where: {
          id: parseInt(String(scheduledItemId)),
        },
        data: {
          startDate: startDate,
          endDate: endDate,
        },
      })
      res.json(updateScheduledItem)
      break
    case 'DELETE':
      const deleteScheduledItem = await prisma.scheduledItem.delete({
        where: {
          id: parseInt(String(scheduledItemId)),
        },
      })
      res.json(deleteScheduledItem)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}