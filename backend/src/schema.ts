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
    owner: User!
  }

  type EntriesResponse {
    # TODO push down limit offset for items
    items(limit: Int, offset: Int): [Entry!]!
    count: Int!
    sumCalories: Int!
    caloriesPerDay(timezone: String): [DailyCalorie!]!
  }

  type DailyCalorie {
    date: String!
    calories: Int!
  }

  type Profile {
    calorieLimit: Int!
  }

  type User {
    id: Int!
    name: String!
    jwt: String!
    isAdmin: Boolean!
    profile: Profile!
    entries(from: Date, to: Date): EntriesResponse!
  }

  type Query {
    """Lists all users. Normally this endpoint would be guarded by @auth(requires: ADMIN),
    but this resolver populates the user selector in the client"""
    users: [User!]!
    self: User!
    entries(ownerId: Int, from: Date, to: Date): EntriesResponse @auth(requires: ADMIN)
  }

  input CreateOrUpdateEntry {
    id: Int
    timestamp: Date!
    name: String!
    calorieValue: Int!
    cheatMeal: Boolean
  }

  type Mutation {
    # create entry - all authed users
    # change cheat day status - all authed users
    # update / delete entries - admin
    createEntry(entry: CreateOrUpdateEntry!, ownerId: Int): Entry @auth(requires: USER)
    setCheatMeal(entryId: Int, cheatMeal: Boolean): Entry @auth(requires: USER)

    updateEntry(entry: CreateOrUpdateEntry!, entryId: Int!): Entry @auth(requires: ADMIN)
    deleteEntry(entryId: Int!): Boolean @auth(requires: ADMIN)
  }
`;