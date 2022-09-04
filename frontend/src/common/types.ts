export interface User {
  id: string,
  name: string,
  jwt: string,
  isAdmin: boolean,
}

export type FoodEntry = {
  id: number;
  name: string;
  calorieValue: number;
  cheatMeal: boolean;
  timestamp: string;
  ownerId?: number;
}

export type FoodEntryWithoutId = Omit<FoodEntry, 'id'>;

export type GetAllEntriesResponse = {
  entries: {
    items: FoodEntry[];
    count: number;
  }
}