import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import Card from '../../components/card'
import { AddModal, Header } from './component'
import { useEffect, useState } from 'react'
import { startOfDay, endOfDay } from 'date-fns'
import Container from '../../components/container'
export default function Dashboard() {
  const [items, setItems] = useState([])
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
