import { Entry, PrismaClient, User } from "@prisma/client";
import { AuthenticationError } from "apollo-server";
import dayjs from "dayjs";
import jwt from 'jsonwebtoken';
import isNil from 'lodash.isnil';


import { ContextType } from "./context";
import { dateScalar } from "./scalars";

type CaloriesPerDay = {
  date: string;
  calories: number;
}[]

export const getResolvers = (prisma: PrismaClient) => ({
  Date: dateScalar,

  Mutation: {
    createOrUpdateEntry: async (_: unknown, { entry, ownerId }: { entry: Entry, ownerId?: number }, context: ContextType): Promise<Entry> => {
      if (!isNil(ownerId)) {
        if (!context.isAdmin) {
          throw new AuthenticationError(`User cannot modify other users's records`)
        }
      }
      // TODO validate that the record belongs to the user
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
    },
    self: () => {
      return {};
    },
  },

  User: {
    jwt: async (user: User) => {
      return jwt.sign({ user }, process.env.JWT_SECRET as string);
    },
    profile: async (user: User) => {
      return prisma.profile.findUnique({ where: { userId: user.id } })
    }
  },

  Self: {
    user: (_: unknown, { }, context: ContextType) => {
      return context.user;
    },
    entries: async (_: unknown, { from, to, limit, offset }: { from: Date, to: Date, limit: number, offset: number }, context: ContextType) => {
      return prisma.entry.findMany({
        where: {
          AND: [
            { ownerId: { equals: context?.user?.id } },
            {
              timestamp: { gte: from }
            },
            {
              timestamp: { lte: to }
            }
          ]
        },
        take: limit,
        skip: offset,
      })
    },
    caloriesPerDay: async (_: unknown, { from, to }: { from: Date, to: Date }, context: ContextType): Promise<CaloriesPerDay> => {
      const entries = await prisma.entry.findMany({
        where: {
          AND: [
            {
              ownerId: { equals: context?.user?.id }
            },
            {
              timestamp: { gte: from }
            },
            {
              timestamp: { lte: to }
            }
          ]
        }
      });

      const caloriesByDay: Record<string, number> = entries.reduce((acc, entry: Entry) => {
        // TODO test if the aggregation works
        const date = dayjs(entry.timestamp).utc(true).local().tz('America/Detroit').format('YYYY-MM-DD');
        acc[date] = (acc[date] || 0) + entry.calorieValue;
        return acc;
      }, {} as Record<string, number>);

      const aggregatedEntries: CaloriesPerDay = Object.entries(caloriesByDay).map(([date, calories]) => ({
        date,
        calories,
      }))

      return aggregatedEntries;
    }
  }
});