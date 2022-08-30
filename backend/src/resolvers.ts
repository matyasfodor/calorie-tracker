import { PrismaClient, User } from "@prisma/client";
import jwt from 'jsonwebtoken';

import { dateScalar } from "./scalars";


export const getResolvers = (prisma: PrismaClient) => ({
  Date: dateScalar,

  Query: {
    users: async () => {
      return prisma.user.findMany();
    }
  },

  User: {
    jwt: async (user: User) => {
      return jwt.sign({user}, process.env.JWT_SECRET as string);
    }
  }
});