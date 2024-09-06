import { useState } from 'react'
import Modal from '../../components/modal'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../../utils/firebase'

export function AddModal({ fetchItems }) {
  const [isOpen, setIsOpen] = useState(false)
  const [newItem, setNewItem] = useState({ name: '', description: '' })
  const [file, setFile] = useState(null)

  const handleInputChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const itemToAdd = {
      ...newItem,
      createdAt: serverTimestamp(),
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
