import { PrismaClient } from "@prisma/client";
import { ApolloServer } from "apollo-server";
import { getResolvers } from "./resolvers";
import { typeDefs } from "./schema";
import dotenv from 'dotenv';

// Allows using .env file
// These values then can be used as process.env[variablename]
dotenv.config();

const prisma = new PrismaClient();

const server = new ApolloServer({ typeDefs, resolvers: getResolvers(prisma) });

server.listen().then(() => {
  console.log(`
    🚀  Server is running!
    🔉  Listening on port 4000
    📭  Query at http://localhost:4000
  `);
})