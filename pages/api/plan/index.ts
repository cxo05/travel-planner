import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { title, startDate, endDate, userId } = req.body;

  const method = req.method;

  //const session = await getSession({ req });

  switch (method) {
    // case 'GET':
    //   const getPlans = await prisma.plan.findMany({
    //     where: {
    //       userId: String(session?.user.id),
    //     }
    //   })
    //   res.json(getPlans);
    //   break
    case 'POST':
      // console.log(String(session?.user.id));
      const addPlan = await prisma.plan.create({
        data: {
          userId: userId,
          title: title,
          startDate: startDate,
          endDate: endDate,
        },
      })
      res.json(addPlan);
      break
  }
}