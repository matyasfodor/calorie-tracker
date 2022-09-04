import { Entry, PrismaClient, User } from "@prisma/client";
import { AuthenticationError } from "apollo-server";
import jwt from 'jsonwebtoken';
import isNil from 'lodash.isnil';


import { ContextType } from "./context";
import { getEntries, getEntryCount, getSumCalories } from "./queries";
import { dateScalar } from "./scalars";
import { aggregateCaloriesPerDay } from "./transformers";
import { CaloriesPerDay } from "./types";


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
      if (!context.user?.isAdmin && entry?.ownerId !== context.user?.id) {
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
      try {
        const resp = await prisma.entry.delete({ where: { id: entryId } });
        return true
      } catch (error) {
        console.warn(error);
        return false
      }
    },
  },

  Query: {
    users: async () => {
      return prisma.user.findMany();
    },
    entries: async (_: unknown, args: {}) => { return args },
    self: (_: unknown, { }: {}, context: ContextType) => {
      return context.user;
    },
  },

  User: {
    jwt: async (user: User) => {
      return jwt.sign({ user }, process.env.JWT_SECRET as string);
    },
    profile: async (user: User) => {
      return prisma.profile.findUnique({ where: { userId: user.id } })
    },
    entries: async (user: User, { from, to, limit, offset }: { from: Date, to: Date, limit: number, offset: number }) => {
      return { ownerId: user.id, from, to, limit, offset };
    },
    caloriesPerDay: async (user: User, { from, to }: { from: Date, to: Date }): Promise<CaloriesPerDay> => {
      const entries = await getEntries({ prisma }, { ownerId: user?.id, from, to });

      const aggregatedEntries = aggregateCaloriesPerDay({entries})

      return aggregatedEntries;
    }
  },

  Entry: {
    owner: async (entry: Entry) => {
      return prisma.user.findUnique({ where: { id: entry.ownerId } });
    },
  },

  EntriesResponse: {
    items: async (entriesProps: { ownerId?: number, from?: Date, to?: Date }, itemsProps: { limit?: number, offset?: number }) => {
      return getEntries({ prisma }, {
        ...entriesProps,
        ...itemsProps,
      });
    },
    count: async (props: { ownerId?: number, from?: Date, to?: Date }) => {
      return getEntryCount({ prisma }, props);
    },
    sumCalories: async (props: { ownerId?: number, from?: Date, to?: Date }) => {
      return getSumCalories({ prisma }, props);
    },
  }
});