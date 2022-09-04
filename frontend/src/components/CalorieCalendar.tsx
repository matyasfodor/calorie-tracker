import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import isNil from 'lodash.isnil'

import { useGetUserCaloriesByDay } from '../apollo/queries'
import Calendar from '../components/Calendar'
import { Tooltip } from 'antd'

interface CellRendererProps {
  date: dayjs.Dayjs
  caloriesByDay: Record<string, number>
  calorieLimit: number
}

const CellRenderer = ({ date, caloriesByDay, calorieLimit }: CellRendererProps) => {
  const calendarDate = date.format('YYYY-MM-DD')
  let calories = caloriesByDay[calendarDate]
  if (isNil(calories)) {
    calories = 0
  }
  const dayOfMonth = date.date()

  let color = ''
  if (calories === 0) {
    color = '#FFFFFF'
  } else if (calories < calorieLimit) {
    color = '#b7eb8f'
  } else {
    color = '#ffccc7'
  }

  return (
    <Tooltip title={`${calories}`}>
      <div style={{ width: '100%', height: '100%', backgroundColor: color }}>{dayOfMonth}</div>
    </Tooltip>
  )
}

export const CalorieCalendar = () => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const [caloriesByDay, setCaloriesByDay] = useState<Record<string, number>>({})

  const [currentMonth, setCurrentMonth] = useState<{ from: dayjs.Dayjs, to: dayjs.Dayjs }>({
    from: dayjs().utc().tz(timezone).startOf('month').startOf('week'),
    to: dayjs().utc().tz(timezone).endOf('month').endOf('week')
  })

  const getUserCaloriesByDay = useGetUserCaloriesByDay({
    ...currentMonth,
    timezone
  })

  useEffect(() => {
    if (getUserCaloriesByDay.data != null) {
      const caloriesByDay: Record<string, number> = getUserCaloriesByDay.data.self.entries.caloriesPerDay.reduce<Record<string, number>>(
        (acc, { calories, date }) => {
          acc[date] = calories
          return acc
        },
        {}
      )

      setCaloriesByDay(caloriesByDay)
    }
  }, [getUserCaloriesByDay.data])

  const onCalendarChange = (date: dayjs.Dayjs) => {
    setCurrentMonth({
      from: date.utc().tz(timezone).utc(true).startOf('month').startOf('week'),
      to: date.utc().tz(timezone).utc(true).endOf('month').endOf('week')
    })
  }

  return (
    <div style={{ width: 300 }}>
      <Calendar
        fullscreen={false}
        dateFullCellRender={(date: dayjs.Dayjs) => (
          <CellRenderer
            date={date}
            caloriesByDay={caloriesByDay}
            calorieLimit={getUserCaloriesByDay.data?.self.profile.calorieLimit ?? 2100}
          />
        )}
        onPanelChange={onCalendarChange}
      />
    </div>
  )
}
