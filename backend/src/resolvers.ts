import { Entry, PrismaClient, User } from "@prisma/client";
import { AuthenticationError } from "apollo-server";
import dayjs from "dayjs";
import jwt from 'jsonwebtoken';
import isNil from 'lodash.isnil';


import { ContextType } from "./context";
import { getEntries, getEntryCount, getSumCalories } from "./queries";
import { dateScalar } from "./scalars";

type CaloriesPerDay = {
  date: string;
  calories: number;
}[]

export const getResolvers = (prisma: PrismaClient) => ({
  Date: dateScalar,

  Mutation: {
    // createEntry(entry: CreateOrUpdateEntry!, ownerId: Int): Entry @auth(requires: USER)
    createEntry: async (_: unknown, { entry, ownerId }: { entry: Entry, ownerId: number }, context: ContextType): Promise<Entry> => {
      if (!context.isAdmin && !isNil(ownerId)) {
        throw new AuthenticationError(`Only admins can modify other users's records`);
      }
      return await prisma.entry.create({ data: { ...entry, ownerId: (ownerId ?? context.user?.id) as number } });
    },
    // setCheatMeal(entryId: Int, cheatMeal: Boolean): Entry @auth(requires: USER)

    setCheatMeal: async (_: unknown, { entryId, cheatMeal }: { entryId: number, cheatMeal: boolean }, context: ContextType): Promise<Entry> => {
      const entry = await prisma.entry.findUnique({ where: { id: entryId } });
      if (entry?.ownerId !== context.user?.id) {
        throw new AuthenticationError(`Food entry with id ${entryId} does not exists`);
      }
      const updatedEntry = await prisma.entry.update({ where: { id: entryId }, data: { cheatMeal } });
      return updatedEntry;
    },

    // updateEntry(entry: CreateOrUpdateEntry!, entryId: Int): Entry @auth(requires: ADMIN)
    updateEntry: async (_: unknown, { entry, entryId }: { entry: Entry, entryId: number }): Promise<Entry> => {
      const updatedEntry = await prisma.entry.update({ where: { id: entryId }, data: entry });
      return updatedEntry;
    },
    // deleteEntry(entryId: Int!): Boolean @auth(requires: ADMIN)
    deleteEntry: async (_: unknown, { entryId }: { entryId: number }): Promise<boolean> => {
      // TODO verify this works
      try {
        const resp = await prisma.entry.delete({ where: { id: entryId } });
        return true
      } catch(error) {
        console.warn(error);
        return false
      }
    },

    // createOrUpdateEntry: async (_: unknown, { entry, ownerId }: { entry: Entry, ownerId?: number }, context: ContextType): Promise<Entry> => {
    //   if (!isNil(ownerId)) {
    //     if (!context.isAdmin) {
    //       throw new AuthenticationError(`User cannot modify other users's records`)
    //     }
    //   }
    //   // TODO validate that the record belongs to the user
    //   if (entry.id !== undefined) {
    //     return await prisma.entry.update({ where: { id: entry.id }, data: entry })
    //   } else {
    //     return await prisma.entry.create({ data: { ...entry, ownerId: (ownerId ?? context.user?.id) as number } })
    //   }
    // }
  },

  Query: {
    users: async () => {
      return prisma.user.findMany();
    },
    entries: async (_: unknown, args: {}) => { return args },
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

  Entry: {
    owner: async (entry: Entry) => {
      return prisma.user.findUnique({where:{id: entry.ownerId}});
    },
  },

  Self: {
    user: (_: unknown, { }, context: ContextType) => {
      return context.user;
    },
    entries: async (_: unknown, { from, to, limit, offset }: { from: Date, to: Date, limit: number, offset: number }, context: ContextType) => {
      return getEntries({ prisma }, { ownerId: context.user?.id, from, to, limit, offset });
    },
    caloriesPerDay: async (_: unknown, { from, to }: { from: Date, to: Date }, context: ContextType): Promise<CaloriesPerDay> => {
      const entries = await getEntries({ prisma }, { ownerId: context.user?.id, from, to });

      const caloriesByDay: Record<string, number> = entries.reduce((acc, entry: Entry) => {
        // TODO test if the aggregation works
        // Get user's timezone or default to GMT
        // @ts-ignore
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
  },

  EntriesResponse: {
    items: async (props: { ownerId?: number, from?: Date, to?: Date, limit?: number, offset?: number }) => {
      return getEntries({ prisma }, props);
    },
    count: async (props: { ownerId?: number, from?: Date, to?: Date }) => {
      return getEntryCount({ prisma }, props);
    },
    sumCalories: async (props: { ownerId?: number, from?: Date, to?: Date }) => {
      return getSumCalories({ prisma }, props);
    },
  }
});