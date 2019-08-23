import { Link, navigate, RouteComponentProps } from '@reach/router'
import React, { useCallback, useEffect, useState } from 'react'
import ContentEditable from 'react-contenteditable'
import shortid from 'short-id'
import styled from 'styled-components'
import { Box, Button, Heading, Input, Pane } from '../components/Common'
import Dialog from '../components/Dialog'
import { db } from '../db'
import useAuth from '../hooks/useAuth'
import { useQuickEdit } from '../hooks/useQuickEdit'
import { AuthStatus } from '../types/AuthStatus'
import { Document } from '../types/Document'
import { Documents } from '../types/Documents'

interface Props extends RouteComponentProps {}

const ProjectBox = styled(Box)`
  padding: 0.5em 1em;
  border: 1px solid #d9d9d9;
  border-radius: 1.5em;
`

const initialProjectState: Documents = {
  aaa: {
    id: 'aaa',
    done: false,
    projectId: '',
    subdocs: [],
    title: '',
    type: 0,
    user: '',
    description: '',
  },
}

export const ProjectPage: React.FC<Props> = props => {
  const [user, status] = useAuth()
  if (status === AuthStatus.unauthenticated) navigate('/')

  const [isLoading, setIsLoading] = useState(true)
  const [projectList, setProjectList] = useState(initialProjectState)
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
          setProjectList(projects)
          setIsLoading(false)
        } catch (error) {
          console.error('error fetching documents: ' + error)
        }
      }
      fetchProjects()
    }
  }, [user, status])

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
    const postProject = async (): Promise<void> => {
      const projectId = shortid.generate()
      const newProject: Document = {
        id: projectId,
        title: textEdit,
        description: descriptionEdit,
        done: false,
        subdocs: [],
        projectId: null,
        type: 0,
        user: user.id,
      }
      try {
        await db
          .collection('documents')
          .doc(projectId)
          .set(newProject)
      } catch (error) {
        console.log('error adding project: ' + error)
      }

      setProjectList({
        ...projectList,
        [projectId]: newProject,
      })
    }

    postProject()
    setIsDialogOpen(false)
    setEdits({ text: '', description: '' })
  }, [projectList, textEdit, descriptionEdit, user.id])
  const handleClickAddProject = useCallback((): void => setIsDialogOpen(true), [])
  const handleCloseDialog = useCallback((): void => setIsDialogOpen(false), [])
  return isLoading ? (
    <div>loading...</div>
  ) : (
    <div>
      <Pane marginBottom="15px">
        <Heading>Project</Heading>
      </Pane>
      {Object.keys(projectList).map(projectId => (
        <Link key={projectId} to={`${projectId}`}>
          <ProjectBox>{projectList[projectId].title}</ProjectBox>
        </Link>
      ))}
      <Pane marginTop="30px">
        <Button onClick={handleClickAddProject}>프로젝트 만들기</Button>
      </Pane>
      {isDialogOpen && (
        <Dialog onClose={handleCloseDialog}>
          <Heading>프로젝트 추가하기</Heading>
          <Input
            placeholder="프로젝트 이름"
            value={textEdit}
            onChange={handleTextEditChange}
            spellCheck={false}
          />
          <ContentEditable
            placeholder="설명(선택)"
            html={descriptionEdit}
            onChange={handleDescriptionEditChange}
            spellCheck={false}
          />
          <Button onClick={handleAddProject}>프로젝트 만들기</Button>
        </Dialog>
      )}
    </div>
  )
}
