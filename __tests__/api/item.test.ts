import { createMocks } from 'node-mocks-http';
import { prismaMock } from '../../singleton'

import itemHandler from '../../pages/api/item/[id]'
import itemsHandler from '../../pages/api/item/index'

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

jest.mock('next-auth/next', () => ({
    __esModule: true,
    default: jest.fn(() => 1),
    getServerSession: jest.fn().mockResolvedValue({ user: { id: 'user-1' } })
}));


describe('/api/item/[id]', () => {
  it('should search and return an item', async () => {
    prismaMock.item.findUnique.mockResolvedValue(mockItem)

    const { req, res } = createMocks({
      method: 'GET',
      query: {
        id: mockItem.id,
      },
    });

    await itemHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(prismaMock.item.findUnique).toBeCalled(); 
    expect(JSON.parse(res._getData())).toEqual(JSON.parse(JSON.stringify(mockItem)));
  });

  it('should search and handle error case and return 404 status', async () => {
    prismaMock.item.findUnique.mockResolvedValue(null)

    const { req, res } = createMocks({
      method: 'GET',
      query: {
        id: -1,
      },
    });

    await itemHandler(req, res);

    expect(res._getStatusCode()).toBe(404);
    expect(prismaMock.item.findUnique).toBeCalled(); 
  });

  it('should update and return an item', async () => {
    prismaMock.item.update.mockResolvedValue(mockItem)

    const { req, res } = createMocks({
      method: 'PUT',
      query: {
        id: mockItem.id,
      },
      body: mockItem
    });

    await itemHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(prismaMock.item.update).toBeCalled(); 
    expect(JSON.parse(res._getData())).toEqual(JSON.parse(JSON.stringify(mockItem)));
  });

  it('should update and handle error case and return 500 status', async () => {
    prismaMock.item.update.mockRejectedValue(new Error('Error Updating Item'))

    const { req, res } = createMocks({
      method: 'PUT',
      query: {
        id: "",
      },
      body: {}
    });

    await itemHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(prismaMock.item.update).toBeCalled(); 
  });

  it('should delete and return an item', async () => {
    prismaMock.item.delete.mockResolvedValue(mockItem)

    const { req, res } = createMocks({
      method: 'DELETE',
      query: {
        id: mockItem.id,
      },
    });

    await itemHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(prismaMock.item.delete).toBeCalled(); 
    expect(JSON.parse(res._getData())).toEqual(JSON.parse(JSON.stringify(mockItem)));
  });

  it('should delete and handle error case and return 500 status', async () => {
    prismaMock.item.delete.mockRejectedValue(new Error('Error Deleting Plan'))

    const { req, res } = createMocks({
      method: 'DELETE',
      query: {
        id: "",
      },
    });

    await itemHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(prismaMock.item.delete).toBeCalled(); 
  });
});

describe('/api/item/index', () => {
  it('should create and return new item', async () => {
    prismaMock.item.create.mockResolvedValue(mockItem)

    const { req, res } = createMocks({
      method: 'POST',
      url: '/api/plan',
      body: {
        planId: mockItem.planId,
        name: mockItem.name,
        placeId: mockItem.placeId,
        imageUrl: mockItem.imageUrl,
        notes: mockItem.notes,
        category: mockItem.category,
      },
    });

    await itemsHandler(req, res); 

    expect(res.statusCode).toBe(200); 
    expect(prismaMock.item.create).toBeCalled(); 
    expect(JSON.parse(res._getData())).toEqual(JSON.parse(JSON.stringify(mockItem)));
  });

  it('should handle error case and return 500 status', async () => {
    prismaMock.item.create.mockRejectedValue(new Error('Error Creating New Item'));

    const { req, res } = createMocks({
      method: 'POST',
      url: '/api/plan',
      body: {},
    });

    await itemsHandler(req, res); 

    expect(res.statusCode).toBe(500); 
    expect(prismaMock.item.create).toBeCalled(); 
  });
});
