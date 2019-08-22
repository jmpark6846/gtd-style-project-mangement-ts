import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { Link, RouteComponentProps } from '@reach/router'
import shortid from 'short-id'

import { Pane, Heading, Box, Button, Input } from '../components/Common'
import { db } from '../db'
import ContentEditable from 'react-contenteditable'
import { useQuickEdit } from '../hooks/useQuickEdit'
import Dialog from '../components/Dialog'
import { Document, Documents } from './ProjectDetailPage'
import { User } from '../App'

interface Props extends RouteComponentProps {
  user: User
}

const ProjectBox = styled(Box)`
  padding: 0.5em 1em;
  border: 1px solid #d9d9d9;
  border-radius: 1.5em;
`

export const ProjectPage: React.FC<Props> = props => {
  const [projectList, setProjectList] = useState({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const {
    textEdit,
    setTextEdit,
    handleTextEditChange,
    descriptionEdit,
    setDescriptionEdit,
    handleDescriptionEditChange,
  } = useQuickEdit({ text: '', description: '' })
  useEffect(() => {
    const fetchProjects = async (): Promise<void> => {
      try {
        const snapshot = await db.collection('documents').get()
        const projects: Documents = {}
        snapshot.forEach(doc => {
          const _doc = doc.data() as Document
          projects[_doc.id] = _doc
        })
        setProjectList(projects)
      } catch (error) {
        console.error('error fetching documents: ' + error)
      }
    }
    fetchProjects()
  }, [])

  const handleAddProject = useCallback(() => {
    const postProject = async (): Promise<void> => {
      const projectId = shortid.generate()
      const newProject: Document = {
        id: projectId,
        title: textEdit,
        description: descriptionEdit,
        done: false,
        subdocs: {},
        type: 'project',
        user: props.user.id,
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
    setTextEdit('')
    setDescriptionEdit('')
  }, [
    projectList,
    setDescriptionEdit,
    setIsDialogOpen,
    setTextEdit,
    textEdit,
    descriptionEdit,
    props.user.id,
  ])

  return (
    <div>
      <Pane marginBottom="15px">
        <Heading>Project</Heading>
      </Pane>
      {Object.keys(projectList).map(projectId => (
        <Link key={projectId} to={`${props.path}/${projectId}`}>
          <ProjectBox>{projectId}</ProjectBox>
        </Link>
      ))}
      <Pane marginTop="30px">
        <Button onClick={(): void => setIsDialogOpen(true)}>
          프로젝트 만들기
        </Button>
      </Pane>
      {isDialogOpen && (
        <Dialog onClose={(): void => setIsDialogOpen(false)}>
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
