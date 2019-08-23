import { Router } from '@reach/router'
import React, { useReducer } from 'react'
import './App.css'
import DocumentContext from './contexts/DocumentContext'
import { ListDetailPage } from './pages/ListDetailPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { ProjectPage } from './pages/ProjectPage'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage'
import documentReducer from './reducers/DocumentReducers'

const App: React.FC = () => {
  const [documents, dispatch] = useReducer(documentReducer, {})
  return (
    <div className="App">
      <DocumentContext.Provider value={{ dispatch }}>
        <Router>
          <SignInPage path="/" />
          <SignUpPage path="signup" />
          <ProjectPage path="projects" />
          <ProjectDetailPage path="projects/:projectId" documents={documents} />
          <ListDetailPage path="projects/:projectId/lists/:listId" documents={documents} />
        </Router>
      </DocumentContext.Provider>
    </div>
  )
}

export default App
