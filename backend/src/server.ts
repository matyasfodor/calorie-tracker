import { PrismaClient } from "@prisma/client";
import { ApolloServer } from "apollo-server";
import { geRresolvers } from "./resolvers";
import { typeDefs } from "./schema";

const prisma = new PrismaClient();

const server = new ApolloServer({ typeDefs, resolvers: geRresolvers(prisma) });

server.listen().then(() => {
  console.log(`
    🚀  Server is running!
    🔉  Listening on port 4000
    📭  Query at http://localhost:4000
  `);
})