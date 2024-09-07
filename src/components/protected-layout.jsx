import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../utils/firebase'
import { useSetAtom } from 'jotai'
import { profileAtom } from '../atom/user'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const setProfile = useSetAtom(profileAtom)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        await delay(1000)
        setIsLoading(false)
        navigate('/login')
        return
      }

      const user = await getMe(currentUser.uid)
      setProfile(user)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (isLoading) {
    return <p>Wait minute</p>
  }

  return <>{children}</>
}

export async function getMe(uid) {
  try {
    const ref = doc(db, 'users', uid)
    const docSnapshot = await getDoc(ref)

    if (!docSnapshot.exists()) {
      console.log('You not registered yet')
      return
    }

    return { id: uid, ...docSnapshot.data() }
  } catch (error) {
    console.log(error)
    return
  }
}
