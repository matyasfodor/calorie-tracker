import {gql} from 'apollo-server';

export const typeDefs = gql`
  directive @fieldAuth(requires: Role = ADMIN) on FIELD_DEFINITION

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
    entries: [Entry!]!
  }

  type Query {
    """Lists all users. Normally this endpoint would be guarded by @auth(requires: ADMIN),
    but this resolver populates the user selector in the client"""
    users: [User!]!
    self: User!
    # TODO: filter by dates, user, add pagination
    entries: [Entry!]! @auth(requires: ADMIN)
  }
`;