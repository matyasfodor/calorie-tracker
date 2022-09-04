import { Checkbox } from 'antd'
import { useSetCheatMeal } from '../apollo/mutations'
import { FoodEntry } from '../common/types'

export const CheatMealRenderer = ({ entry }: { entry: FoodEntry }) => {
  const [setCheatMeal, setCheatMealState] = useSetCheatMeal()

  const onChange = async (value: boolean) => await setCheatMeal({ variables: { entryId: entry.id, cheatMeal: value } })

  return (
    <Checkbox
      checked={entry.cheatMeal}
      disabled={setCheatMealState.loading}
      onChange={(e) => {
        void onChange(e.target.checked)
      }}
    />
  )
}
