import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { planId } = req.query;

  const { name, placeId, notes, category } = req.body;

  switch (req.method) {
    case 'GET':
      const getItems = await prisma.item.findMany({
        where: {
          planId: String(planId),
        }
      })
      res.json(getItems);
      break
    case 'POST':
      const addItem = await prisma.item.create({
        data: {
          planId: String(planId),
          name: name,
          placeId: placeId,
          notes: notes,
          category: category,
        },
      })
      res.json(addItem);
      break
  }
}