export interface User {
  id: string
  name: string
  jwt: string
  isAdmin: boolean
}

export interface FoodEntry {
  id: number
  name: string
  calorieValue: number
  cheatMeal: boolean
  timestamp: string
  ownerId?: number
}

export type FoodEntryWithoutId = Omit<FoodEntry, 'id'>

export interface GetAllEntriesResponse {
  entries: {
    items: FoodEntry[]
    count: number
  }
}
