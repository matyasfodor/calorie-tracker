import { dateScalar } from "./scalars";

export const resolvers = {
  Date: dateScalar,

  Query: {
    users: () => {
      return [{
        id: 'asd',
        name: 'Csak Janos',
        jwt: 'asdasd',
      }]
    }
  }
};