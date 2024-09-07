import {
  collection,
  getDocs,
  getDoc,
  doc,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { useEffect, useState } from 'react'
import { AddModal, Header } from './component'
import { startOfDay, endOfDay } from 'date-fns'
import { profileAtom } from '../../atom/user'
import { useAtom, useAtomValue } from 'jotai'
import Container from '../../components/container'
import Card from '../../components/card'

export default function Dashboard() {
  const profile = useAtomValue(profileAtom)
  const [items, setItems] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
    if (!profile) return
    fetchItems()
  }, [selectedDate])

  const fetchItems = async () => {
    const start = startOfDay(selectedDate)
    const end = endOfDay(selectedDate)

    const q = query(
      collection(db, 'items'),
      where('userId', '==', profile.id),
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

  return (
    <Container>
      <Header setSelectedDate={setSelectedDate} selectedDate={selectedDate} />
      {items.map((item) => (
        <Card item={item} key={item.id} />
      ))}
      <AddModal fetchItems={fetchItems} />
    </Container>
  )
}
