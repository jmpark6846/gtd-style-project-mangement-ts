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
import styled from 'styled-components'
import { Header } from './components/Common/Header'

const Body = styled.section`
  /* position: absolute; */
  width: 900px;
  max-width: 100%;
  margin: 75px auto 0px auto;
  padding: 0px 30px;
  background-color: white;
  padding: 1.5rem 2rem;
  border-radius: 5px;
  box-shadow: 0 5px 10px 0 rgba(0, 64, 128, 0.05);
`

const App: React.FC = () => {
  const [documents, dispatch] = useReducer(documentReducer, {})
  return (
    <div className="App">
      <DocumentContext.Provider value={{ dispatch }}>
        <Header />
        <Body>
          <Router>
            <SignInPage path="/" />
            <SignUpPage path="signup" />
            <ProjectPage path="projects" documents={documents} />
            <ProjectDetailPage path="projects/:projectId" documents={documents} />
            <ListDetailPage path="projects/:projectId/lists/:listId" documents={documents} />
          </Router>
        </Body>
      </DocumentContext.Provider>
    </div>
  )
}

export default App
