export type FoodEntry = {
  id: number;
  name: string;
  calorieValue: number;
  cheatMeal: boolean;
  timestamp: string;
}

export type FoodEntryWithoutId = Omit<FoodEntry, 'id'>;