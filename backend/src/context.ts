import { User } from '@prisma/client';
import type {ContextFunction} from 'apollo-server-core';
import type {ExpressContext} from 'apollo-server-express';

import jwt from 'jsonwebtoken';

const getUser = (authHeader: string): User | null => {
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7, authHeader.length);
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {user: User};
    return decoded.user;
  } else {
    return null
  }
}

export type ContextType = {
  user?: User,
  isAdmin?: boolean
};

export const context: ContextFunction<ExpressContext, object> = ({ req }): ContextType  => {
  const token = req.headers.authorization || '';

  const user = getUser(token);

  if (user === null) {
    return {};
  }

  return {
    user,
    isAdmin: user.isAdmin
  };
}