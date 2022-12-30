import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req

  switch (method) {
    case 'GET':
      const getUser = await prisma.user.findUnique({
        where: {
          id: `${id}`,
        },
        include: {
          Plan: true,
        },
      })      
      res.json(getUser)
      break
    case 'PUT':
      // Update or create data in your database
      //res.status(200).json({ id, name: name || `User ${id}` })
      break
    default:
      //res.setHeader('Allow', ['GET', 'PUT'])
      //res.status(405).end(`Method ${method} Not Allowed`)
  }
}