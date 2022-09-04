import { PrismaClient, User } from '@prisma/client'
import { ApolloServer } from 'apollo-server'
import { getResolvers } from './resolvers'
import { typeDefs } from './schema'
import dotenv from 'dotenv'

import { makeExecutableSchema } from '@graphql-tools/schema'
import { authDirective } from './directives/authDirective'
import { context } from './context'
import dayjs from 'dayjs'
import dayjs_plugin_timezone from 'dayjs/plugin/timezone'
import dayjs_plugin_utc from 'dayjs/plugin/utc'

// Allows using .env file
// These values then can be used as process.env[variablename]
dotenv.config()

const prisma = new PrismaClient()

dayjs.extend(dayjs_plugin_utc)
dayjs.extend(dayjs_plugin_timezone)

const { authDirectiveTypeDefs, authDirectiveTransformer } = authDirective

const schema = authDirectiveTransformer(
  makeExecutableSchema({
    typeDefs: [authDirectiveTypeDefs, typeDefs],
    resolvers: getResolvers(prisma),
  }),
)

const server = new ApolloServer({
  schema,
  context,
})

server.listen().then(() => {
  console.log(`
    🚀  Server is running!
    🔉  Listening on port 4000
    📭  Query at http://localhost:4000
  `)
})
