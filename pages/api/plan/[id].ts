import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    body: { title, location, startDate, endDate },
    method,
  } = req

  switch (method) {
    case 'GET':
      const getPlan = await prisma.plan.findUnique({
        where: {
          id: String(id),
        },
        include: {
          Items: true
        }
      })
      getPlan ? res.json(getPlan) : res.status(404).end('Plan Not Found')
      break
    case 'PUT':
      try {
        const updatePlan = await prisma.plan.update({
          where: {
            id: String(id),
          },
          data: {
            title: title,
            location: location,
            startDate: startDate,
            endDate: endDate,
          },
        })
        res.json(updatePlan)
      } catch (error) {
        res.status(500).end('Error Updating Plan');
      }
      break
    case 'DELETE':
      try {
        const deletePlan = await prisma.plan.delete({
          where: {
            id: String(id),
          },
        })
        res.json(deletePlan)
      } catch (error) {
        res.status(500).end('Error Deleting Plan');
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}