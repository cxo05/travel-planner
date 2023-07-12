import { createMocks } from 'node-mocks-http';
import { prismaMock } from '../../singleton'

import scheduledItemHandler from '../../pages/api/scheduledItem/[id]'
import scheduledItemsHandler from '../../pages/api/scheduledItem/index'

import { Category } from '@prisma/client';

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

const mockItem = {
  id: 1,
  planId: mockPlan.id,
  name: "item 1",
  placeId: "place-1",
  imageUrl: "item 1",
  notes: "item 1",
  category: Category.ACTIVITIES,
}

const mockScheduledItem = {
  id: 1,
  planId: mockPlan.id,
  ItemId: mockItem.id,
  startDate: currDate,
  endDate: currDate,
}

jest.mock('next-auth/next', () => ({
    __esModule: true,
    default: jest.fn(() => 1),
    getServerSession: jest.fn().mockResolvedValue({ user: { id: 'user-1' } })
}));


describe('/api/scheduledItem/[id]', () => {
  it('should search and return a scheduled item', async () => {
    prismaMock.scheduledItem.findUnique.mockResolvedValue(mockScheduledItem)

    const { req, res } = createMocks({
      method: 'GET',
      query: {
        id: mockScheduledItem.id,
      },
    });

    await scheduledItemHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(prismaMock.scheduledItem.findUnique).toBeCalled(); 
    expect(JSON.parse(res._getData())).toEqual(JSON.parse(JSON.stringify(mockScheduledItem)));
  });

  it('should search and handle error case and return 404 status', async () => {
    prismaMock.scheduledItem.findUnique.mockResolvedValue(null)

    const { req, res } = createMocks({
      method: 'GET',
      query: {
        id: -1,
      },
    });

    await scheduledItemHandler(req, res);

    expect(res._getStatusCode()).toBe(404);
    expect(prismaMock.scheduledItem.findUnique).toBeCalled(); 
  });

  it('should update and return a scheduled item', async () => {
    prismaMock.scheduledItem.update.mockResolvedValue(mockScheduledItem)

    const { req, res } = createMocks({
      method: 'PUT',
      query: {
        id: mockScheduledItem.id,
      },
      body: mockScheduledItem
    });

    await scheduledItemHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(prismaMock.scheduledItem.update).toBeCalled(); 
    expect(JSON.parse(res._getData())).toEqual(JSON.parse(JSON.stringify(mockScheduledItem)));
  });

  it('should update and handle error case and return 500 status', async () => {
    prismaMock.scheduledItem.update.mockRejectedValue(new Error('Error Updating Scheduled Item'))

    const { req, res } = createMocks({
      method: 'PUT',
      query: {
        id: "",
      },
      body: {}
    });

    await scheduledItemHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(prismaMock.scheduledItem.update).toBeCalled(); 
  });

  it('should delete and return a scheduled item', async () => {
    prismaMock.scheduledItem.delete.mockResolvedValue(mockScheduledItem)

    const { req, res } = createMocks({
      method: 'DELETE',
      query: {
        id: mockItem.id,
      },
    });

    await scheduledItemHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(prismaMock.scheduledItem.delete).toBeCalled(); 
    expect(JSON.parse(res._getData())).toEqual(JSON.parse(JSON.stringify(mockScheduledItem)));
  });

  it('should delete and handle error case and return 500 status', async () => {
    prismaMock.scheduledItem.delete.mockRejectedValue(new Error('Error Deleting Scheduled Plan'))

    const { req, res } = createMocks({
      method: 'DELETE',
      query: {
        id: "",
      },
    });

    await scheduledItemHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(prismaMock.scheduledItem.delete).toBeCalled(); 
  });
});

describe('/api/item/index', () => {
  it('should create and return new scheduled item', async () => {
    prismaMock.scheduledItem.create.mockResolvedValue(mockScheduledItem)

    const { req, res } = createMocks({
      method: 'POST',
      url: '/api/plan',
      body: {
        planId: mockScheduledItem.planId,
        ItemId: mockScheduledItem.ItemId,
        startDate: mockScheduledItem.startDate,
        endDate: mockScheduledItem.endDate,
      },
    });

    await scheduledItemsHandler(req, res); 

    expect(res.statusCode).toBe(200); 
    expect(prismaMock.scheduledItem.create).toBeCalled(); 
    expect(JSON.parse(res._getData())).toEqual(JSON.parse(JSON.stringify(mockScheduledItem)));
  });

  it('should handle error case and return 500 status', async () => {
    prismaMock.scheduledItem.create.mockRejectedValue(new Error('Error Creating New Scheduled Item'));

    const { req, res } = createMocks({
      method: 'POST',
      url: '/api/plan',
      body: {},
    });

    await scheduledItemsHandler(req, res); 

    expect(res.statusCode).toBe(500); 
    expect(prismaMock.scheduledItem.create).toBeCalled(); 
  });
});
