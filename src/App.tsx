import React, { useState, useEffect } from 'react'
import './App.css'
import { Router } from '@reach/router'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { ListDetailPage } from './pages/ListDetailPage'
import { db } from './db'
import { SignInPage } from './pages/SignInPage'
import { ProjectPage } from './pages/ProjectPage'

export interface User {
  email: string
  id: string
  projects: object
  username: string
}

const initalState: User = {
  email: '',
  id: '',
  projects: {},
  username: '',
}
const App: React.FC = () => {
  const [user, setUser] = useState(initalState)
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
        }
      } catch (error) {
        console.log('error fetching user: ' + error)
      }
    }
    fetchUser()
  }, [])
  console.log(user)
  return (
    <div className="App">
      <Router>
        <SignInPage path="/" />
        <ProjectPage path="projects" user={user} />
        {/* <ProjectDetailPage path="projects/:projectId" />
        <ListDetailPage path="projects/:projectId/lists/:listId" /> */}
      </Router>
    </div>
  )
}

export default App
