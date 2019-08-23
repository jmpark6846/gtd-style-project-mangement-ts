import React, { useState, useEffect, useContext, useReducer } from 'react'
import './App.css'
import { Router } from '@reach/router'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { ListDetailPage } from './pages/ListDetailPage'
import { db } from './db'
import { SignInPage } from './pages/SignInPage'
import { ProjectPage } from './pages/ProjectPage'
import documentReducer from './reducers/DocumentReducers'
import DocumentContext from './contexts/DocumentContext'
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
    const fetchUser = async (): Promise<void> => {
      try {
        const user = await db
          .collection('users')
          .doc('5XO2bZ7GCeJMueptWc5l')
          .get()
          .then(res => res.data())

        if (user != null) {
          setUser(user as User)
          setIsLoggedIn(true)
        }
      } catch (error) {
        console.log('error fetching user: ' + error)
      }
    }
    fetchUser()
  }, [])
  console.log(documents, user)

  return (
    <div className="App">
      <DocumentContext.Provider value={{ dispatch }}>
        <Router>
          <SignInPage path="/" />
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
