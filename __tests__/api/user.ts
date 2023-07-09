import { createMocks } from 'node-mocks-http';
import { prismaMock } from '../../singleton'

import userHandler from '../../pages/api/user/[id]'

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

  it('should search and handle error case and return 404 status', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)

    const { req, res } = createMocks({
      method: 'GET',
      query: {
        id: '',
      },
    });

    await userHandler(req, res);

    expect(res._getStatusCode()).toBe(404);
    expect(prismaMock.user.findUnique).toBeCalled(); 
  });
});