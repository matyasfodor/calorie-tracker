import dayjs from 'dayjs'
import dayjs_plugin_timezone from 'dayjs/plugin/timezone'
import dayjs_plugin_utc from 'dayjs/plugin/utc'

dayjs.extend(dayjs_plugin_utc)
dayjs.extend(dayjs_plugin_timezone)
