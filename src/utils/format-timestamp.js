import { format, fromUnixTime } from 'date-fns'
import { id } from 'date-fns/locale'

export const formatTimestamp = (data) => {
  if (!data) return 'N/A'

  const timestamp = fromUnixTime(data.seconds)
  const day = format(timestamp, 'EE', { locale: id })
  const date = format(timestamp, 'MM-dd-yyyy', { locale: id })
  const time = format(timestamp, 'h:mm')
  const typeTime = format(timestamp, 'a')

  return { day, date, time, typeTime }
}
