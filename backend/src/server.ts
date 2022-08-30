import { PrismaClient, User } from "@prisma/client";
import { ApolloServer, AuthenticationError } from "apollo-server";
import { getResolvers } from "./resolvers";
import { typeDefs } from "./schema";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

// Allows using .env file
// These values then can be used as process.env[variablename]
dotenv.config();

const prisma = new PrismaClient();

const getUser = (authHeader: string): User => {
  if (authHeader.startsWith("Bearer ")){
    const token = authHeader.substring(7, authHeader.length);
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as User;
    return decoded;
  } else {
    throw new AuthenticationError("User could not be authorised");
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers: getResolvers(prisma),
  context: ({req}) => {
    const token = req.headers.authorization || '';

    const user = getUser(token);

    return {
      user,
      isAdmin: user.isAdmin
    };
} });

server.listen().then(() => {
  console.log(`
    🚀  Server is running!
    🔉  Listening on port 4000
    📭  Query at http://localhost:4000
  `);
})