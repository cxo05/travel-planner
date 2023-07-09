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

const currDate = new Date()

const mockUser = {
  id: "user-1",
  email: "mock-user-1@gmail.com",
  name: "user 1",
  emailVerified: currDate,
  image: ""
}

const mockPlan = {
  id: "plan-1",
  title: "plan 1",
  location: "Singapore",
  startDate: currDate,
  endDate: null,
  createdAt: currDate,
  UsersOnPlan: {
    create: {
      userId: mockUser.id,
      isCreator: true
    }
  }
}

jest.mock('next-auth/next', () => ({
    __esModule: true,
    default: jest.fn(() => 1),
    getServerSession: jest.fn().mockResolvedValue({ user: { id: 'user-1' } })
}));

beforeAll(async () => {
  prismaMock.user.create.mockResolvedValue(mockUser)
  prismaMock.plan.create.mockResolvedValue(mockPlan)
})

afterAll(async () => {
  prismaMock.user.delete.mockResolvedValue(mockUser)
  prismaMock.plan.create.mockResolvedValue(mockPlan)
})

describe('User', () => {
  test('GET /api/user', async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockUser)

    const { req, res } = createMocks({
      method: 'GET',
      query: {
        id: mockUser.id,
      },
    });

    await userHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(JSON.parse(JSON.stringify(mockUser)));
  });
});


describe('Plan', () => {
  test('POST /api/plan', async () => {
    prismaMock.plan.create.mockResolvedValue(mockPlan)

    const { req, res } = createMocks({
      method: 'POST',
      url: '/api/plan',
      body: {
        title: 'Test plan',
        location: 'Singapore',
        startDate: currDate,
        endDate: null,
      },
    });

    await plansHandler(req, res); 

    expect(res.statusCode).toBe(200); 
    expect(JSON.parse(res._getData())).toEqual(JSON.parse(JSON.stringify(mockPlan)));
  });
});