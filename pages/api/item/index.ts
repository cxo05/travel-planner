import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '../../../lib/prisma'
import { Item } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { planId } = req.query;

  const { name, placeId, notes, category, imageUrl }: Item = req.body

  switch (req.method) {
    case 'GET':
      const getItems = await prisma.item.findMany({
        where: {
          planId: String(planId),
        },
        include: {
          _count: {
            select: {
              ScheduledItem: true
            }
          }
        }
      })
      res.json(getItems);
      break
    case 'POST':
      try {
        const addItem = await prisma.item.create({
          data: {
            planId: String(planId),
            name: name,
            placeId: placeId,
            imageUrl: imageUrl,
            notes: notes,
            category: category,
          },
        })
        res.json(addItem);
      } catch (error) {
        res.status(500).end('Error Creating Item');
      }
      break
  }
}