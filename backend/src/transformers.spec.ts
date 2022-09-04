import { Entry } from '@prisma/client'
import { aggregateCaloriesPerDay } from './transformers'
import dayjs from 'dayjs'
import dayjs_plugin_timezone from 'dayjs/plugin/timezone'
import dayjs_plugin_utc from 'dayjs/plugin/utc'

dayjs.extend(dayjs_plugin_utc)
dayjs.extend(dayjs_plugin_timezone)

describe('aggregateCaloriesPerDay', () => {
  const singleEntry: Entry[] = [
    {
      name: 'Pickles',
      id: 11,
      calorieValue: 392,
      timestamp: new Date('2022-09-19T03:04:06.000Z'),
      cheatMeal: false,
      ownerId: 1,
    },
  ]

  it('should work for a single value', () => {
    expect(aggregateCaloriesPerDay({ entries: singleEntry })).toEqual([
      {
        date: '2022-09-19',
        calories: 392,
      },
    ])
  })

  it('should respect user timezone', () => {
    expect(aggregateCaloriesPerDay({ entries: singleEntry, userTimeZone: 'America/Los_Angeles' })).toEqual([
      {
        date: '2022-09-18',
        calories: 392,
      },
    ])
  })

  const entriesWithCheatMeal: Entry[] = [
    {
      name: 'Pickles',
      id: 11,
      calorieValue: 392,
      timestamp: new Date('2022-09-19T03:04:06.000Z'),
      cheatMeal: false,
      ownerId: 1,
    },
    {
      name: 'Kimchi',
      id: 10,
      calorieValue: 435,
      timestamp: new Date('2022-09-07T02:04:06.000Z'),
      cheatMeal: true,
      ownerId: 1,
    },
    {
      name: 'Hummus',
      id: 8,
      calorieValue: 500,
      timestamp: new Date('2022-09-02T13:04:16.092Z'),
      cheatMeal: false,
      ownerId: 1,
    },
  ]

  it('should exclude cheat meals', () => {
    expect(aggregateCaloriesPerDay({ entries: entriesWithCheatMeal })).toEqual([
      {
        date: '2022-09-19',
        calories: 392,
      },
      {
        date: '2022-09-02',
        calories: 500,
      },
    ])
  })
})
