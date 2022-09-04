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
  query getUserFoodEntries($from: Date, $to: Date, $limit: Int, $offset: Int) {
    self {
      entries(from: $from, to: $to) {
        items(limit: $limit, offset: $offset) {
          id
          name
          calorieValue
          cheatMeal
          timestamp
        }
        count
      }
    }
  }
`;

export const useGetUserFoodEntries = (variables = {}) => useQuery<{ self: { entries: { items: FoodEntry[], count: number } } }>(GET_USER_FOOD_ENTRIES, { variables });

const GET_ENTRY_COUNT = gql`
  query entryCount($from: Date, $to: Date) {
    entries(from: $from, to: $to) {
      count
    }
  }
`;

export const useGetEntryCount = (variables = {}) => useQuery<{ entries: { count: number } }>(GET_ENTRY_COUNT, { variables });

const GET_USER_CALORIES_BY_DAY = gql`
  query getUserCaloriesByDay($from: Date, $to: Date) {
    self {
      caloriesPerDay(from: $from, to: $to) {
        calories
        date
      }
    }
  }
`;

export const useGetUserCaloriesByDay = (variables = {}) => useQuery<{ self: { caloriesPerDay: { calories: number, date: string }[] } }>(GET_USER_CALORIES_BY_DAY, { variables });

const GET_ALL_USER_CALORIES_BY_DAY = gql`
  query getAllUserCaloriesByDay($from: Date, $to: Date) {
    users {
        id
        name
        caloriesPerDay(from: $from, to: $to) {
          calories
          date
      }
    }
  }
`;

export const useGetAllUserCaloriesByDay = (variables = {}) => useQuery<{ users: { id: string, name: string, caloriesPerDay: { calories: number, date: string }[] }[] }>(GET_ALL_USER_CALORIES_BY_DAY, { variables });
