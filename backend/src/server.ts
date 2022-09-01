import { PrismaClient, User } from "@prisma/client";
import { ApolloServer } from "apollo-server";
import { getResolvers } from "./resolvers";
import { typeDefs } from "./schema";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import {makeExecutableSchema} from '@graphql-tools/schema';
import { authDirective } from "./directives/authDirective";

// Allows using .env file
// These values then can be used as process.env[variablename]
dotenv.config();

const prisma = new PrismaClient();

const getUser = (authHeader: string): User | null => {
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7, authHeader.length);
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {user: User};
    return decoded.user;
  } else {
    return null
  }
}

const { authDirectiveTypeDefs, authDirectiveTransformer } = authDirective;

const schema = authDirectiveTransformer(makeExecutableSchema({
  typeDefs: [
    authDirectiveTypeDefs,
    typeDefs,
  ],
  resolvers: getResolvers(prisma),
}));

const server = new ApolloServer({
  // typeDefs,
  schema,
  context: ({ req }) => {
    const token = req.headers.authorization || '';

    const user = getUser(token);

    if (user === null) {
      return null
    }

    return {
      user,
      isAdmin: user.isAdmin
    };
  },
});

server.listen().then(() => {
  console.log(`
    🚀  Server is running!
    🔉  Listening on port 4000
    📭  Query at http://localhost:4000
  `);
})