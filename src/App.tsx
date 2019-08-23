import { Router } from '@reach/router'
import React, { useEffect, useReducer, useState } from 'react'
import './App.css'
import DocumentContext from './contexts/DocumentContext'
import { db, firebaseAuth } from './db'
import { ListDetailPage } from './pages/ListDetailPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { ProjectPage } from './pages/ProjectPage'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage'
import documentReducer from './reducers/DocumentReducers'
import { User } from './types/User'

const initalUserState: User = {
  email: '',
  id: '',
  projects: {},
  username: '',
}

const App: React.FC = () => {
  const [documents, dispatch] = useReducer(documentReducer, {})
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(initalUserState)

  useEffect(() => {
    const firebaseUnsubscribe = firebaseAuth.onAuthStateChanged(async googleAuth => {
      if (googleAuth !== null) {
        let user = null

        try {
          const userDoc = await db
            .collection('users')
            .doc(googleAuth.uid)
            .get()

          if (userDoc.exists) {
            user = userDoc.data() as User
            setUser(user)
            setIsLoggedIn(true)
          }
        } catch (error) {
          console.log('error getting user: ' + error)
        }
      }
    })
    return firebaseUnsubscribe
  }, [])
  console.log(documents, user)

  return (
    <div className="App">
      <DocumentContext.Provider value={{ dispatch }}>
        <Router>
          <SignInPage path="/" />
          <SignUpPage path="signup" />
          <ProjectPage path="projects" user={user} />
          <ProjectDetailPage
            path="projects/:projectId"
            isLoggedin={isLoggedIn}
            user={user}
            documents={documents}
          />
          <ListDetailPage
            path="projects/:projectId/lists/:listId"
            isLoggedin={isLoggedIn}
            user={user}
            documents={documents}
          />
        </Router>
      </DocumentContext.Provider>
    </div>
  )
}

export default App
