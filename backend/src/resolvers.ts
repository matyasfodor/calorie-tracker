import { PrismaClient } from "@prisma/client";
import { dateScalar } from "./scalars";

export const geRresolvers = (prisma: PrismaClient) => ({
  Date: dateScalar,

  Query: {
    users: async () => {
      return prisma.user.findMany();
      // return [{
      //   id: 'asd',
      //   name: 'Csak Janos',
      //   jwt: 'asdasd',
      // }]
    }
  },

  User: {
    jwt: async () => {
      // TODO create JWT on-the-fly
      return 'asd';
    }
  }
});