import { gql, useQuery } from "@apollo/client";
import { FoodEntry, GetAllEntriesResponse, User } from "../common/types";

const GET_USERS = gql`
  query getUsers {
    users {
      id
      name
      jwt
      isAdmin
    }
  }
`;

export const useGetUsers = () => useQuery<{ users: User[] }>(GET_USERS);

const GET_ALL_ENTRIES = gql`
  query getAllEntries {
    entries {
      items {
        name
        id
        calorieValue
        timestamp
        cheatMeal
        owner {
          name
        }
      }
    }
  }
`;

export const useGetAllEntries = () => useQuery<GetAllEntriesResponse>(GET_ALL_ENTRIES);

const GET_USER_FOOD_ENTRIES = gql`
  query getUserFoodEntries {
    self {
      entries {
        id
        name
        calorieValue
        cheatMeal
        timestamp
      }
    }
  }
`;

export const useGetUserFoodEntries = () => useQuery<{ self: { entries: FoodEntry[] } }>(GET_USER_FOOD_ENTRIES);

const GET_ENTRY_COUNT = gql`
  query entryCount($from: Date, $to: Date) {
    entries(from: $from, to: $to) {
      count
    }
  }
`;

export const useGetEntryCount = (variables={}) => useQuery<{ entries: { count: number } }>(GET_ENTRY_COUNT, {variables});