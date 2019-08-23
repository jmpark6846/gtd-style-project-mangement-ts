import { useState, useEffect } from 'react'
import { firebaseAuth, db } from '../db'
import { User } from '../types/User'
import { AuthStatus } from '../types/AuthStatus'

const initalUserState: User = {
  email: '',
  id: '',
  username: '',
}

const useAuth = (): [User, AuthStatus] => {
  const [user, setUser] = useState(initalUserState)
  const [status, setStatus] = useState(AuthStatus.pending)

  useEffect(() => {
    const firebaseUnsubscribe = firebaseAuth.onAuthStateChanged(async googleAuth => {
      if (googleAuth) {
        let user = null

        try {
          const userDoc = await db
            .collection('users')
            .doc(googleAuth.uid)
            .get()

          if (userDoc.exists) {
            user = userDoc.data() as User
            setUser(user)
            setStatus(AuthStatus.authenticated)
          }
        } catch (error) {
          console.log('error getting user: ' + error)
        }
      } else {
        setStatus(AuthStatus.unauthenticated)
      }
    })
    return firebaseUnsubscribe
  }, [])
  return [user, status]
}

export default useAuth
