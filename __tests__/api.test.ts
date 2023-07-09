import { createMocks } from 'node-mocks-http';
import { prismaMock } from '../singleton'

import userHandler from '../pages/api/user/[id]'

import planHandler from '../pages/api/plan/[id]'
import plansHandler from '../pages/api/plan/index'
import planShareHandler from '../pages/api/plan/share/index'

import itemHandler from '../pages/api/item/[id]'
import itemsHandler from '../pages/api/item/index'

import scheduledItemHandler from '../pages/api/scheduledItem/[id]'
import scheduledItemsHandler from '../pages/api/scheduledItem/index'

import prisma from '../lib/prisma'
import { Plan } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { NextApiRequest, NextApiResponse } from 'next';

// const testUser = {
//   id: "test-id",
//   email: "test-email@gmail.com",
//   name: "test-name",
//   emailVerified: new Date(),
//   image: ""
// }

jest.mock("next-auth/next");

describe('/api/user', () => {
  test('should return a user', async () => {
    const user = {
      id: "1",
      email: "user@gmail.com",
      name: "user",
      emailVerified: new Date(),
      image: ""
    }

    prismaMock.user.findUnique.mockResolvedValue(user)

    const { req, res } = createMocks({
      method: 'GET',
      query: {
        id: '1',
      },
    });

    await userHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(
      JSON.parse(JSON.stringify(user)),
    );
  });
});

describe('/api/plan', () => {
  const testPlan: Plan = {
    id: "1",
    title: "Test plan",
    location: "Singapore",
    createdAt: new Date(),
    startDate: new Date("2023-08-01"),
    endDate: new Date("2023-08-20"),
    // UsersOnPlan: {
    //   create: {
    //     userId: "test-id",
    //     isCreator: true
    //   }
    // }
  }

  prismaMock.plan.create.mockResolvedValue(testPlan)

  test('create test plan', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      query: {
        title: "Test plan",
        location: "Singapore",
        startDate: new Date("2023-08-01"),
        endDate: new Date("2023-08-20"),
        UsersOnPlan: {
          create: {
            userId: "test-id",
            isCreator: true
          }
        }
      },
    });

    await plansHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    // expect(JSON.parse(res._getData())).toEqual(
    //   expect.objectContaining(testPlan),
    // );
  });

  // prismaMock.usersOnPlan.findMany.mockResolvedValue(testPlan)

  test('get test plans', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET'
    });

    await plansHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining(testPlan),
    );
  });
});