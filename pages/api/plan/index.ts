import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { title, startDate, endDate } = req.body;

  const session = await getSession({ req });
  const addPlan = await prisma.plan.create({
    data: {
      userId: String(session?.user.id),
      title: title,
      startDate: startDate,
      endDate: endDate,
    },
  })
  res.json(addPlan);
}