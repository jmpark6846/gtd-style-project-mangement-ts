import { Link, RouteComponentProps } from '@reach/router'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import ContentEditable from 'react-contenteditable'
import shortid from 'short-id'
import styled from 'styled-components'

import { Box, Button, Heading, Input, Pane } from '../components/Common'
import Dialog from '../components/Dialog'
import DocumentContext from '../contexts/DocumentContext'
import { db } from '../db'
import useAuth from '../hooks/useAuth'
import { useQuickEdit } from '../hooks/useQuickEdit'
import { AuthStatus } from '../types/AuthStatus'
import { Document } from '../types/Document'
import { Documents } from '../types/Documents'
import { Breadcumb } from '../components/Breadcumb'

interface Props extends RouteComponentProps {
  documents: Documents
}

const ProjectBox = styled(Pane)`
  padding: 1em 1.2em;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
`

export const ProjectPage: React.FC<Props> = ({ documents, navigate }) => {
  const [user, status] = useAuth()

  useEffect(() => {
    if (status === AuthStatus.unauthenticated) navigate!('/')
  }, [status, navigate])

  const [isLoading, setIsLoading] = useState(true)
  const { dispatch } = useContext(DocumentContext)
  useEffect(() => {
    if (status === AuthStatus.authenticated) {
      const fetchProjects = async (): Promise<void> => {
        try {
          const snapshot = await db
            .collection('documents')
            .where('user', '==', user.id)
            .where('type', '==', 0)
            .get()
          const projects: Documents = {}
          snapshot.forEach(doc => {
            const _doc = doc.data() as Document
            projects[_doc.id] = _doc
          })
          dispatch({ type: 'UPDATE_DOCUMENTS', payload: projects })
          setIsLoading(false)
        } catch (error) {
          console.error('error fetching documents: ' + error)
        }
      }
      fetchProjects()
    }
  }, [user, status, dispatch])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [
    textEdit,
    descriptionEdit,
    _isEditOpen,
    setEdits,
    handleTextEditChange,
    handleDescriptionEditChange,
    _handleCancel,
  ] = useQuickEdit({ text: '', description: '' })

  const handleAddProject = useCallback(() => {
    const projectId = shortid.generate()
    const newProject: Document = {
      id: projectId,
      title: textEdit,
      description: descriptionEdit,
      type: 0,
      user: user.id,
      projectId: null,
      done: false,
      subdocs: [],
    }
    dispatch({
      type: 'ADD_DOCUMENT',
      payload: { parent: null, id: projectId, document: newProject },
    })
    setIsDialogOpen(false)
    setEdits({ text: '', description: '' })
  }, [textEdit, descriptionEdit, user.id, dispatch, setEdits])
  const handleClickAddProject = useCallback((): void => setIsDialogOpen(true), [])
  const handleCloseDialog = useCallback((): void => setIsDialogOpen(false), [])
  return isLoading ? (
    <div>loading...</div>
  ) : (
    <div>
      <Breadcumb paths={[]} />
      <Pane marginBottom="15px">
        <Heading>Project</Heading>
      </Pane>
      {Object.values(documents)
        .filter(doc => doc.type === 0)
        .map(project => (
          <Link key={project.id} to={`${project.id}`}>
            <ProjectBox>{project.title}</ProjectBox>
          </Link>
        ))}
      <Pane marginTop="30px">
        <Button onClick={handleClickAddProject}>프로젝트 만들기</Button>
      </Pane>
      {isDialogOpen && (
        <Dialog onClose={handleCloseDialog}>
          <Pane marginBottom="15px">
            <Heading>프로젝트 추가하기</Heading>
          </Pane>
          <Pane marginBottom="15px">
            <Input
              placeholder="프로젝트 이름"
              value={textEdit}
              onChange={handleTextEditChange}
              spellCheck={false}
              minimal
            />
          </Pane>
          <Pane marginBottom="15px">
            <ContentEditable
              className="content-div minimal"
              placeholder="설명(선택)"
              html={descriptionEdit}
              onChange={handleDescriptionEditChange}
              spellCheck={false}
            />
          </Pane>
          <Button onClick={handleAddProject}>프로젝트 만들기</Button>
        </Dialog>
      )}
    </div>
  )
}
