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

const mockUsersOnPlan = {
  planId: mockPlan.id,
  userId: mockUser.id,
  isCreator: true,
}

jest.mock('next-auth/next', () => ({
    __esModule: true,
    default: jest.fn(() => 1),
    getServerSession: jest.fn().mockResolvedValue({ user: { id: 'user-1' } })
}));

describe('/api/user/[id]', () => {
  it('should return a user', async () => {
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

describe('/api/plan/[id]', () => {
  it('should search and return a plan', async () => {
    prismaMock.plan.findUnique.mockResolvedValue(mockPlan)

    const { req, res } = createMocks({
      method: 'GET',
      query: {
        id: mockPlan.id,
      },
    });

    await planHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(prismaMock.plan.findUnique).toBeCalled(); 
    expect(JSON.parse(res._getData())).toEqual(JSON.parse(JSON.stringify(mockPlan)));
  });

  it('should search and handle error case and return 404 status', async () => {
    prismaMock.plan.findUnique.mockResolvedValue(null)

    const { req, res } = createMocks({
      method: 'GET',
      query: {
        id: mockPlan.id,
      },
    });

    await planHandler(req, res);

    expect(res._getStatusCode()).toBe(404);
    expect(prismaMock.plan.findUnique).toBeCalled(); 
  });

  it('should update and return a plan', async () => {
    prismaMock.plan.update.mockResolvedValue(mockPlan)

    const { req, res } = createMocks({
      method: 'PUT',
      query: {
        id: mockPlan.id,
      },
      body: {
        title: mockPlan.title,
        location: mockPlan.location,
        startDate: mockPlan.startDate,
        endDate: mockPlan.endDate,
      }
    });

    await planHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(prismaMock.plan.update).toBeCalled(); 
    expect(JSON.parse(res._getData())).toEqual(JSON.parse(JSON.stringify(mockPlan)));
  });

  it('should update and handle error case and return 500 status', async () => {
    prismaMock.plan.update.mockRejectedValue(new Error('Error Updating Plan'))

    const { req, res } = createMocks({
      method: 'PUT',
      query: {
        id: "",
      },
      body: {}
    });

    await planHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(prismaMock.plan.update).toBeCalled(); 
  });

  it('should delete and return a plan', async () => {
    prismaMock.plan.delete.mockResolvedValue(mockPlan)

    const { req, res } = createMocks({
      method: 'DELETE',
      query: {
        id: mockPlan.id,
      },
    });

    await planHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(prismaMock.plan.delete).toBeCalled(); 
    expect(JSON.parse(res._getData())).toEqual(JSON.parse(JSON.stringify(mockPlan)));
  });

  it('should delete and handle error case and return 500 status', async () => {
    prismaMock.plan.delete.mockRejectedValue(new Error('Error Deleting Plan'))

    const { req, res } = createMocks({
      method: 'DELETE',
      query: {
        id: "",
      },
    });

    await planHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(prismaMock.plan.delete).toBeCalled(); 
  });
});

describe('/api/plan/share/index', () => {
  it('should share and return user', async () => {
    prismaMock.user.update.mockResolvedValue(mockUser)

    const { req, res } = createMocks({
      method: 'POST',
      url: '/api/share/plan',
      body: {
        email: mockUser.email,
        planId: mockPlan.id,
      },
    });

    await planShareHandler(req, res); 

    expect(res.statusCode).toBe(200); 
    expect(prismaMock.user.update).toBeCalled(); 
    expect(JSON.parse(res._getData())).toEqual(JSON.parse(JSON.stringify(mockUser)));
  });

  it('should handle error case and return 500 status', async () => {
    prismaMock.user.update.mockRejectedValue(new Error('Error Sharing Plan'));

    const { req, res } = createMocks({
      method: 'POST',
      url: '/api/sharing/plan',
      body: {},
    });

    await planShareHandler(req, res); 

    expect(res.statusCode).toBe(500); 
    expect(prismaMock.user.update).toBeCalled(); 
  });
});

describe('/api/plan/index', () => {
  it('should create and return new plan', async () => {
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
    expect(prismaMock.plan.create).toBeCalled(); 
    expect(JSON.parse(res._getData())).toEqual(JSON.parse(JSON.stringify(mockPlan)));
  });

  it('should handle error case and return 500 status', async () => {
    prismaMock.plan.create.mockRejectedValue(new Error('Error Creating New Plan'));

    const { req, res } = createMocks({
      method: 'POST',
      url: '/api/plan',
      body: {},
    });

    await plansHandler(req, res); 

    expect(res.statusCode).toBe(500); 
    expect(prismaMock.plan.create).toBeCalled(); 
  });
});

