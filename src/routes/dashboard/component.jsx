import { useState } from 'react'
import Modal from '../../components/modal'
import { collection, addDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../../utils/firebase'
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
} from 'date-fns'
import { useAtomValue } from 'jotai'
import { profileAtom } from '../../atom/user'

export function AddModal({ fetchItems }) {
  const profile = useAtomValue(profileAtom)

  const [isOpen, setIsOpen] = useState(false)
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm'),
  })
  const [file, setFile] = useState(null)

  const handleChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const submissionDate =
      newItem.date && newItem.time
        ? new Date(`${newItem.date}T${newItem.time}`)
        : new Date()

    const itemToAdd = {
      ...newItem,
      createdAt: submissionDate,
      userId: profile.id,
    }
    if (file) {
      const storageRef = ref(storage, `images/${file.name}`)
      await uploadBytes(storageRef, file)
      const imageUrl = await getDownloadURL(storageRef)
      itemToAdd.imageUrl = imageUrl
    }
    await addDoc(collection(db, 'items'), itemToAdd)
    setNewItem({ name: '', description: '' })
    setFile(null)

    await fetchItems()
    setIsOpen(false)
  }

  const handleUpdate = async (id, updatedItem) => {
    await updateDoc(doc(db, 'items', id), updatedItem)
    fetchItems()
  }

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'items', id))
    fetchItems()
  }

  const handleDateQuery = async () => {
    if (!queryDate) return

    const startOfDay = new Date(queryDate)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(queryDate)
    endOfDay.setHours(23, 59, 59, 999)

    const q = query(
      collection(db, 'items'),
      where('createdAt', '>=', Timestamp.fromDate(startOfDay)),
      where('createdAt', '<=', Timestamp.fromDate(endOfDay))
    )

    const querySnapshot = await getDocs(q)
    const filteredItems = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    setItems(filteredItems)
  }

  return (
    <>
      <div className='flex justify-center fixed bottom-0 left-0 w-full py-4 bg-gradient-to-t from-[#f5f5f5] to-[#f5f5f5]/10'>
        <button
          className='bg-orange-600 rounded-full px-4 py-1.5 text-white text-sm'
          onClick={() => setIsOpen(true)}
        >
          Add
        </button>
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='flex flex-col gap-2 mt-4'>
            <label className='block text-sm font-medium text-gray-700'>
              Name
            </label>
            <input
              type='text'
              name='name'
              value={newItem.name}
              onChange={handleChange}
              required
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
            />
          </div>
          <div className='flex flex-col gap-2 mt-4'>
            <label className='block text-sm font-medium text-gray-700'>
              Description
            </label>
            <input
              type='text'
              name='description'
              value={newItem.description}
              onChange={handleChange}
              required
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
            />
          </div>

          <div>
            <label
              htmlFor='date'
              className='block text-sm font-medium text-gray-700'
            >
              Date
            </label>
            <input
              type='date'
              id='date'
              name='date'
              value={newItem.date}
              onChange={handleChange}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
            />
          </div>

          <div>
            <label
              htmlFor='time'
              className='block text-sm font-medium text-gray-700'
            >
              Time
            </label>
            <input
              type='time'
              id='time'
              name='time'
              value={newItem.time}
              onChange={handleChange}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
            />
          </div>

          <input type='file' onChange={handleFileChange} className='w-full' />
          <button
            type='submit'
            className='bg-orange-600 rounded border border-orange-700 px-4 text-white py-0.5'
          >
            Save
          </button>
        </form>
      </Modal>
    </>
  )
}

export function Header({ selectedDate, setSelectedDate }) {
  const profile = useAtomValue(profileAtom)
  const [currentDate, setCurrentDate] = useState(new Date())

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
    <div className='h-fit bg-white mb-7 px-4 pt-4 pb-5 border-b border-gray-200 rounded-b-xl'>
      <div className='flex justify-between items-center mb-4'>
        <div className='flex items-center gap-2'>
          <div className='w-8 h-8 rounded-full overflow-hidden'>
            <img
              src={
                profile?.photoUrl !== ''
                  ? profile?.profile
                  : 'https://github.com/shadcn.png'
              }
              alt='photo profile'
            />
          </div>
          <p>{profile?.username}</p>
        </div>
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
  )
}
