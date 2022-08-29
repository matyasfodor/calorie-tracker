import {gql} from 'apollo-server';

export const typeDefs = gql`
  scalar Date

  type Entry {
    id: ID!
    timestamp: Date!
    name: String!
    calorieValue: Int!
    cheatMeal: Boolean!
  }

  type User {
    id: ID!
    name: String!
    jwt: String!
  }

  type Query {
    users: [User!]!
    # TODO: filter by dates, user, add pagination
    entries: [Entry!]!
  }
`;