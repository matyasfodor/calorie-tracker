import { gql, useMutation } from "@apollo/client";
import { FoodEntry, FoodEntryWithoutId } from "../common/types";

const CREATE_FOOD_ENTRY = gql`
  mutation CreateEntry($entry: CreateOrUpdateEntry!) {
    createEntry(entry: $entry) {
      name
      id
      calorieValue
      timestamp
    }
  }
`;

export const useCreateFoodEntry = () => useMutation<FoodEntryWithoutId>(CREATE_FOOD_ENTRY);

const UPDATE_FOOD_ENTRY = gql`
  mutation updateEntry($entry: CreateOrUpdateEntry!, $entryId: Int!) {
    updateEntry(entry: $entry, entryId: $entryId) {
      name
      id
      calorieValue
      timestamp
    }
  }
`;

export const useUpdateFoodEntry = () => useMutation<FoodEntryWithoutId>(UPDATE_FOOD_ENTRY);

const DELETE_FOOD_ENTRY = gql`
  mutation deleteEntry($entryId: Int!) {
    deleteEntry(entryId: $entryId)
  }
`;

export const useDeleteFoodEntry = () => useMutation<boolean>(DELETE_FOOD_ENTRY);
