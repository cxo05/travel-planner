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
      getScheduledItem ? res.json(getScheduledItem) : res.status(404).end('Scheduled Item Not Found')
      break
    case 'PUT':
      try {
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
      } catch (error) {
        res.status(500).end('Error Updating Scheduled Item');
      }
      break
    case 'DELETE':
      try {
        const deleteScheduledItem = await prisma.scheduledItem.delete({
          where: {
            id: parseInt(String(scheduledItemId)),
          },
        })
        res.json(deleteScheduledItem)
      } catch (error) {
        res.status(500).end('Error Updating Scheduled Item');
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}