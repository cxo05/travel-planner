import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const itemId = req.query.id;

  const { name, placeId, notes, category } = req.body

  switch (req.method) {
    case 'GET':
      const getItem = await prisma.item.findUnique({
        where: {
          id: parseInt(String(itemId)),
        }
      })
      res.json(getItem)
      break
    case 'PUT':
      const updateItem = await prisma.item.update({
        where: {
          id: parseInt(String(itemId)),
        },
        data: {
          name: name,
          placeId: placeId,
          notes: notes,
          category: category,
        },
      })
      res.json(updateItem)
      break
    case 'DELETE':
      const deleteItem = await prisma.item.delete({
        where: {
          id: parseInt(String(itemId)),
        },
      })
      res.json(deleteItem)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}