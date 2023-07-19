import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '../../../lib/prisma'
import { Item } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const itemId = req.query.id;

  const { name, placeId, notes, category, imageUrl }: Item = req.body

  switch (req.method) {
    case 'GET':
      const getItem = await prisma.item.findUnique({
        where: {
          id: parseInt(String(itemId)),
        },
        include: {
          _count: {
            select: {
              ScheduledItem: true
            }
          }
        }
      })
      getItem ? res.json(getItem) : res.status(404).end('Item Not Found')
      break
    case 'PUT':
      try {
        const updateItem = await prisma.item.update({
          where: {
            id: parseInt(String(itemId)),
          },
          data: {
            name: name,
            placeId: placeId,
            imageUrl: imageUrl,
            notes: notes,
            category: category,
          },
        })
        res.json(updateItem)
      } catch (error) {
        res.status(500).end('Error Updating Item');
      }
      break
    case 'DELETE':
      try {
        const deleteItem = await prisma.item.delete({
          where: {
            id: parseInt(String(itemId)),
          },
        })
        res.json(deleteItem)
      } catch (error) {
        res.status(500).end('Error Deleting Item');
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}