import { gql, useMutation } from '@apollo/client'
import { FoodEntryWithoutId } from '../common/types'
import { GET_ALL_ENTRIES, GET_USER_FOOD_ENTRIES, GET_ENTRY_COUNT, GET_USER_CALORIES_BY_DAY, GET_ALL_USER_CALORIES_BY_DAY } from './queries'

const CREATE_FOOD_ENTRY = gql`
  mutation createEntry($entry: CreateOrUpdateEntry!, $ownerId: Int) {
    createEntry(entry: $entry, ownerId: $ownerId) {
      name
      id
      calorieValue
      timestamp
    }
  }
`

export const useCreateFoodEntry = () =>
  useMutation<FoodEntryWithoutId>(CREATE_FOOD_ENTRY, {
    refetchQueries: [GET_ALL_ENTRIES, GET_USER_FOOD_ENTRIES, GET_ENTRY_COUNT, GET_USER_CALORIES_BY_DAY, GET_ALL_USER_CALORIES_BY_DAY]
  })

const UPDATE_FOOD_ENTRY = gql`
  mutation updateEntry($entry: CreateOrUpdateEntry!, $entryId: Int!) {
    updateEntry(entry: $entry, entryId: $entryId) {
      name
      id
      calorieValue
      timestamp
    }
  }
`

export const useUpdateFoodEntry = () => useMutation<FoodEntryWithoutId>(UPDATE_FOOD_ENTRY)

const DELETE_FOOD_ENTRY = gql`
  mutation deleteEntry($entryId: Int!) {
    deleteEntry(entryId: $entryId)
  }
`

export const useDeleteFoodEntry = () =>
  useMutation<boolean>(DELETE_FOOD_ENTRY, {
    refetchQueries: [GET_ALL_ENTRIES, GET_USER_FOOD_ENTRIES, GET_ENTRY_COUNT, GET_USER_CALORIES_BY_DAY, GET_ALL_USER_CALORIES_BY_DAY]
  })

const SET_CHEAT_MEAL = gql`
  mutation setCheatMeal($entryId: Int, $cheatMeal: Boolean) {
    setCheatMeal(entryId: $entryId, cheatMeal: $cheatMeal) {
      id
      name
      cheatMeal
    }
  }
`

export const useSetCheatMeal = () =>
  useMutation<boolean>(SET_CHEAT_MEAL, {
    refetchQueries: [GET_ALL_ENTRIES, GET_USER_FOOD_ENTRIES, GET_ENTRY_COUNT, GET_USER_CALORIES_BY_DAY, GET_ALL_USER_CALORIES_BY_DAY]
  })
