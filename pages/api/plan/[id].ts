import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    body: { title, startDate, endDate },
    method,
  } = req

  switch (method) {
    case 'GET':
      const getPlan = await prisma.plan.findUnique({
        where: {
          id: String(id),
        }
      })      
      res.json(getPlan)
      break
    case 'PUT':
      const updatePlan = await prisma.plan.update({
        where: {
          id: String(id),
        },
        data: {
          title: title,
          startDate: startDate,
          endDate: endDate,
        },
      })
      res.json(updatePlan)
      break
    case 'DELETE':
      const deletePlan = await prisma.plan.delete({
        where: {
          id: String(id),
        },
      })
      res.json(deletePlan)
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}