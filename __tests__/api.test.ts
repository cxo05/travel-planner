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

// const testUser = {
//   id: "test-id",
//   email: "test-email@gmail.com",
//   name: "test-name",
//   emailVerified: new Date(),
//   image: ""
// }

// beforeAll(async () => {
//   prismaMock.user.create.mockResolvedValue(testUser)
// })

// afterAll(async () => {
//   prismaMock.user.delete.mockResolvedValue(testUser)
// })

describe('/api/user', () => {
  test('should return a user', async () => {
    const user = {
      id: "1",
      email: "user@gmail.com",
      name: "user",
      emailVerified: new Date(),
      image: ""
    }

    prismaMock.user.create.mockResolvedValue(user)

    const { req, res } = createMocks({
      method: 'GET',
      query: {
        id: '1',
      },
    });


    await userHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining(user),
    );
  });
});

// describe('POST /api/plan', () => {
//   const testPlan = {
//     title: "Test plan",
//     location: "Singapore",
//     startDate: "",
//     endDate: "",
//     UsersOnPlan: {
//       create: {
//         userId: "test-id",
//         isCreator: true
//       }
//     }
//   }

//   test('create test plan', async () => {
//     const { req, res } = createMocks({
//       method: 'POST',
//       query: testPlan,
//     });

//     await planHandler(req, res);

//     expect(res._getStatusCode()).toBe(200);
//     expect(JSON.parse(res._getData())).toEqual(
//       expect.objectContaining(testPlan),
//     );
//   });
// });