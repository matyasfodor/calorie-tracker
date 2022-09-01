import { Entry, PrismaClient, User } from "@prisma/client";
import { AuthenticationError } from "apollo-server";
import jwt from 'jsonwebtoken';
import isNil from 'lodash.isnil';


import { ContextType } from "./context";
import { dateScalar } from "./scalars";

export const getResolvers = (prisma: PrismaClient) => ({
  Date: dateScalar,

  Mutation: {
    createOrUpdateEntry: async (_: unknown, { entry, ownerId }: { entry: Entry, ownerId?: number }, context: ContextType): Promise<Entry> => {
      if (!isNil(ownerId)) {
        if (!context.isAdmin) {
          throw new AuthenticationError('User cannot modify ')
        }
      }
      if (entry.id !== undefined) {
        return await prisma.entry.update({ where: { id: entry.id }, data: entry })
      } else {
        return await prisma.entry.create({ data: { ...entry, ownerId: (ownerId ?? context.user?.id) as number } })
      }
    }
  },

  Query: {
    users: async () => {
      return prisma.user.findMany();
    },
    entries: async () => {
      return prisma.entry.findMany()
    }
  },

  User: {
    jwt: async (user: User) => {
      return jwt.sign({ user }, process.env.JWT_SECRET as string);
    }
  },
});