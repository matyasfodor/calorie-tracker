import { Entry, PrismaClient, PrismaPromise } from "@prisma/client"


export const getEntries = async (
  {prisma}: {prisma: PrismaClient},
  {ownerId, from, to, limit, offset}: {ownerId?: number, from?: Date, to?: Date, limit?: number, offset?: number}
): Promise<Entry[]> => {
  const response = prisma.entry.findMany({
    where: {
      AND: [
        { ownerId: { equals: ownerId } },
        {
          timestamp: { gte: from }
        },
        {
          timestamp: { lte: to }
        }
      ]
    },
    orderBy: {
      timestamp: 'desc'
    },
    take: limit,
    skip: offset,
  });
  return response;
};

export const getEntryCount = async (
  {prisma}: {prisma: PrismaClient},
  {ownerId, from, to}: {ownerId?: number, from?: Date, to?: Date}
): Promise<number> => {
  const response = await prisma.entry.aggregate({
    where: {
      AND: [
        { ownerId: { equals: ownerId } },
        {
          timestamp: { gte: from ?? undefined }
        },
        {
          timestamp: { lte: to ?? undefined }
        }
      ]
    },
    _count: true
  });
  return response._count;
};


export const getSumCalories = async (
  {prisma}: {prisma: PrismaClient},
  {ownerId, from, to}: {ownerId?: number, from?: Date, to?: Date}
): Promise<number | null> => {
  const response = await prisma.entry.aggregate({
    where: {
      AND: [
        { ownerId: { equals: ownerId } },
        {
          timestamp: { gte: from }
        },
        {
          timestamp: { lte: to }
        }
      ]
    },
    _sum: {calorieValue: true}
  });
  return response._sum.calorieValue;
}