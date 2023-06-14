import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import prisma from '../../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { title, location, startDate, endDate } = req.body;

  const method = req.method;

  const session = await getServerSession(req, res, authOptions);

  switch (method) {
    case 'GET':
      const getPlans = await prisma.usersOnPlan.findMany({
        where: {
          userId: String(session?.user.id),
        },
        include: {
          plan: true
        }
      })
      res.json(getPlans);
      break
    case 'POST':
      const addPlan = await prisma.plan.create({
        data: {
          title: title,
          location: location,
          startDate: startDate,
          endDate: endDate,
          UsersOnPlan: {
            create: {
              userId: String(session?.user.id),
              isCreator: true
            }
          }
        },
      })
      res.json(addPlan);
      break
  }
}