import { gql } from 'apollo-server';

export const typeDefs = gql`
  directive @fieldAuth(requires: Role = ADMIN) on FIELD_DEFINITION

  scalar Date

  type Entry {
    id: Int!
    timestamp: Date!
    name: String!
    calorieValue: Int!
    cheatMeal: Boolean!
  }

  type User {
    id: Int!
    name: String!
    jwt: String!
  }

  type Self {
    user: User!
    entries: [Entry!]!
  }

  type Query {
    """Lists all users. Normally this endpoint would be guarded by @auth(requires: ADMIN),
    but this resolver populates the user selector in the client"""
    users: [User!]!
    self: Self!
    # TODO: filter by dates, user, add pagination
    entries: [Entry!]! @auth(requires: ADMIN)
  }

  input CreateOrUpdateEntry {
    id: Int
    timestamp: Date!
    name: String!
    calorieValue: Int!
    cheatMeal: Boolean
  }

  type Mutation {
    createOrUpdateEntry(entry: CreateOrUpdateEntry!, ownerId: Int): Entry @auth(requires: USER)
  }
`;