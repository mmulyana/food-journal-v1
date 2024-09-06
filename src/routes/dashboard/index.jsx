import { useAtom } from 'jotai'
import { formatTimestamp } from '../../utils/format-timestamp'
import { AddModal } from './component'
import { itemAtom } from '../../atom/items'
import { useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import Card from '../../components/card'

export default function Dashboard() {
  const [items, setItems] = useAtom(itemAtom)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    const querySnapshot = await getDocs(collection(db, 'items'))
    const itemsList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    setItems(itemsList)
  }

  return (
    <>
      <div className='max-w-[400px] mx-auto'>
        <div className='h-fit bg-white mb-7 px-4 pt-4 pb-5 border-b border-gray-200'>
          <p className='text-base font-medium text-orange-600 mb-2.5'>
            Food Journal
          </p>
          <div className='w-full flex justify-between'>
            {['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map(
              (day, idx) => (
                <div
                  key={idx}
                  className={[
                    'flex flex-col justify-center items-center px-2.5 rounded py-0.5',
                    idx == 2 ? 'bg-orange-50' : '',
                  ].join(' ')}
                >
                  <p
                    className={[
                      'font-semibold',
                      idx == 2 ? 'text-orange-600' : '',
                    ].join(' ')}
                  >
                    {idx + 1}
                  </p>
                  <p
                    className={[
                      'text-sm capitalize',
                      idx == 2 ? 'text-orange-400' : '',
                    ].join(' ')}
                  >
                    {day}
                  </p>
                </div>
              )
            )}
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
