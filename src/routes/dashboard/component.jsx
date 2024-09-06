import { useState } from 'react'
import Modal from '../../components/modal'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../../utils/firebase'
import { format } from 'date-fns'

export function AddModal({ fetchItems }) {
  const [isOpen, setIsOpen] = useState(false)
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm'),
  })
  const [file, setFile] = useState(null)

  const handleInputChange = (e) => {
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
      <div className='py-1 flex justify-center'>
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
            <label className='text-sm text-gray-400'>Name</label>
            <input
              type='text'
              name='name'
              value={newItem.name}
              onChange={handleInputChange}
              required
              className='border px-2.5 py-1.5 rounded text-sm'
            />
          </div>
          <div className='flex flex-col gap-2 mt-4'>
            <label className='text-sm text-gray-400'>Description</label>
            <input
              type='text'
              name='description'
              value={newItem.description}
              onChange={handleInputChange}
              required
              className='border px-2.5 py-1.5 rounded text-sm'
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
