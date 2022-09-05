import { PrismaClient, User } from '@prisma/client'
import type { ContextFunction } from 'apollo-server-core'
import type { ExpressContext } from 'apollo-server-express'

import jwt from 'jsonwebtoken'
import { PrismaDataSource } from './prismaDataSource'

const getUser = (authHeader: string): User | null => {
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7, authHeader.length)
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { user: User }
    return decoded.user
  } else {
    return null
  }
}

export type ContextType = {
  user?: User
  isAdmin?: boolean
  datasources: {
    prisma: PrismaDataSource
  }
}

export const getContext =
  (prisma: PrismaClient): ContextFunction<ExpressContext, object> =>
  ({ req }): ContextType => {
    const token = req.headers.authorization || ''

    const user = getUser(token)

    const datasources = {
      prisma: new PrismaDataSource(prisma),
    }

    if (user === null) {
      return {
        datasources,
      }
    }

    return {
      user,
      isAdmin: user.isAdmin,
      datasources,
    }
  }
