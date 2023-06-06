import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { email, planId } = req.body;

  const method = req.method;

  switch (method) {
    case 'POST':
      const addUserToPlan = await prisma.user.update({
        where: {
          email: email
        },
        data: {
          UsersOnPlan: {
            create: {
              planId: planId,
              isCreator: false
            }
          }
        },
      })
      res.json(addUserToPlan);
      break
  }
}