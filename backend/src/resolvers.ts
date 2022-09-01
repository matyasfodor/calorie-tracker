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
      // TODO Do not allow creating / updating entries for non-admin users.
      console.log('Context: ', context);
      console.log(`createOrUpdateEntry args: ${JSON.stringify(entry, null, 2)} ${ownerId}`);
      if (entry.id !== undefined) {
        console.log('update');
        return await prisma.entry.update({ where: { id: entry.id }, data: entry })
      } else {
        console.log('create');
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