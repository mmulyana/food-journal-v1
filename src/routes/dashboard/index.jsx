import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { itemAtom } from '../../atom/items'
import { db } from '../../utils/firebase'
import Card from '../../components/card'
import { AddModal } from './component'
import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  format,
  startOfWeek,
  endOfWeek,
  addDays,
  subDays,
  eachDayOfInterval,
  isSameDay,
  isToday,
  startOfDay,
  endOfDay,
} from 'date-fns'
export default function Dashboard() {
  const [items, setItems] = useAtom(itemAtom)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
    fetchItems()
  }, [selectedDate])

  const fetchItems = async () => {
    const start = startOfDay(selectedDate)
    const end = endOfDay(selectedDate)

    const q = query(
      collection(db, 'items'),
      where('createdAt', '>=', start),
      where('createdAt', '<=', end),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    const itemsList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    setItems(itemsList)
  }

  const navigateWeek = (direction) => {
    setCurrentDate((prevDate) => {
      const newDate =
        direction === 'next' ? addDays(prevDate, 7) : subDays(prevDate, 7)
      setSelectedDate(newDate)
      return newDate
    })
  }

  const selectDay = (day) => {
    setSelectedDate(day)
  }

  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentDate),
    end: endOfWeek(currentDate),
  })

  return (
    <>
      <div className='max-w-[400px] mx-auto'>
        <div className='h-fit bg-white mb-7 px-4 pt-4 pb-5 border-b border-gray-200'>
          <div className='flex justify-between items-center'>
            <p className='text-base font-medium text-orange-600 mb-2.5'>
              Food Journal
            </p>
            <div className='flex gap-2'>
              <ChevronLeft
                onClick={() => navigateWeek('prev')}
                className='cursor-pointer'
              />
              <ChevronRight
                onClick={() => navigateWeek('next')}
                className='cursor-pointer'
              />
            </div>
          </div>
          <div className='w-full flex justify-between'>
            {weekDays.map((day, idx) => (
              <div
                key={idx}
                onClick={() => selectDay(day)}
                className={[
                  'flex flex-col justify-center items-center px-2.5 rounded py-0.5 cursor-pointer',
                  isSameDay(day, selectedDate) ? 'bg-orange-50' : '',
                  isToday(day) && !isSameDay(day, selectedDate)
                    ? 'border border-orange-300'
                    : '',
                ].join(' ')}
              >
                <p
                  className={[
                    'font-semibold',
                    isSameDay(day, selectedDate) ? 'text-orange-600' : '',
                    isToday(day) && !isSameDay(day, selectedDate)
                      ? 'text-orange-400'
                      : '',
                  ].join(' ')}
                >
                  {format(day, 'd')}
                </p>
                <p
                  className={[
                    'text-sm capitalize',
                    isSameDay(day, selectedDate) ? 'text-orange-400' : '',
                    isToday(day) && !isSameDay(day, selectedDate)
                      ? 'text-orange-300'
                      : '',
                  ].join(' ')}
                >
                  {format(day, 'EEE')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {items.map((item) => (
          <Card item={item} key={item.id} />
        ))}
        <AddModal fetchItems={fetchItems} />
      </div>
    </>
  )
}
