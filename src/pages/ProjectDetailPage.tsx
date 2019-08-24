import { navigate, RouteComponentProps } from '@reach/router'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import shortid from 'short-id'
import styled from 'styled-components'
import { Button, Pane } from '../components/Common'
import QuickEdit from '../components/QuickEdit/QuickEdit'
import TodoList from '../components/Todo/TodoListContainer'
import DocumentContext from '../contexts/DocumentContext'
import { db } from '../db'
import useAuth from '../hooks/useAuth'
import { useQuickEdit } from '../hooks/useQuickEdit'
import { AuthStatus } from '../types/AuthStatus'
import { Document } from '../types/Document'
import { Documents } from '../types/Documents'
import Dropdown, { DropdownItem } from '../components/Dropdown/Dropdown'

const ProjectDetailPagePane = styled(Pane)`
  .information-pane {
    margin-bottom: 30px;

    h2.title {
      font-weight: 700;
      font-size: 1.7rem;
    }
    .description {
      color: grey;
    }
  }
`

interface Props extends RouteComponentProps {
  projectId?: string
  documents: Documents
}

export const ProjectDetailPage: React.FC<Props> = props => {
  const [user, status] = useAuth()
  const projectId = props.projectId!

  useEffect(() => {
    if (status === AuthStatus.unauthenticated) props.navigate!('/')
    if (!props.documents[projectId]) props.navigate!('/projects')
  }, [])

  const { dispatch } = useContext(DocumentContext)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    if (status === AuthStatus.authenticated) {
      const fetchDocument = async (): Promise<void> => {
        try {
          const document = await db
            .collection('documents')
            .where('user', '==', user.id)
            .where('id', '==', projectId)
            .get()
            .then(snapshot => (snapshot.empty ? {} : snapshot.docs[0].data()))

          const subdocsSnapshot = await db
            .collection('documents')
            .where('user', '==', user.id)
            .where('projectId', '==', projectId)
            .where('type', '>', 0)
            .get()

          const docs: Documents = {}
          subdocsSnapshot.forEach(doc => {
            const _doc = doc.data() as Document
            docs[_doc.id] = _doc
          })

          docs[projectId] = document as Document
          dispatch({ type: 'UPDATE_DOCUMENTS', payload: docs })
          setIsLoading(false)
        } catch (error) {
          console.error('error fetching documents: ' + error)
        }
      }
      fetchDocument()
    }
  }, [status])

  const [
    textEditProject,
    descriptionEditProject,
    isEditOpenProject,
    setEditsProject,
    handleTextEditChangeProject,
    handleDescriptionEditChangeProject,
    handleCancelProject,
  ] = useQuickEdit({ text: '', description: '' })

  const handleClickEditProject = (): void =>
    setEditsProject({
      text: props.documents[projectId].title,
      description: props.documents[projectId].description,
      isOpen: true,
    })

  const handleSubmitProject = useCallback((): void => {
    dispatch({
      type: 'CHANGE_DOCUMENT',
      payload: { id: projectId, title: textEditProject, description: descriptionEditProject },
    })
    setEditsProject({
      isOpen: false,
    })
  }, [textEditProject, descriptionEditProject])

  const handleDeleteProject = (): void => {
    dispatch({
      type: 'DELETE_DOCUMENT',
      payload: { id: projectId, parent: null },
    })
    setIsLoading(true)
    navigate('/projects')
  }

  const [
    textEdit,
    descriptionEdit,
    isEditOpen,
    setEdits,
    handleTextEditChange,
    handleDescriptionEditChange,
    handleCancel,
  ] = useQuickEdit({ text: '', description: '' })

  const handleSubmit = useCallback(() => {
    const listId = shortid.generate()
    const newList: Document = {
      id: listId,
      title: textEdit,
      description: descriptionEdit,
      type: 1,
      user: user.id,
      projectId,
      done: false,
      subdocs: [],
    }
    dispatch({
      type: 'ADD_DOCUMENT',
      payload: { parent: projectId, id: listId, document: newList },
    })
    setEdits({ text: '', description: '' })
  }, [user.id, projectId, textEdit, descriptionEdit])

  const handleAddClick = useCallback((): void => setEdits({ isOpen: true }), [])

  const getTodosByListId = useCallback(
    (listId: string) => {
      const todoIds = props.documents[listId].subdocs
      const todos = todoIds.map(todoId => props.documents[todoId])
      return todos
    },
    [props.documents]
  )

  return isLoading ? (
    <div>loading..</div>
  ) : (
    <ProjectDetailPagePane>
      <div className="information-pane">
        {isEditOpenProject ? (
          <QuickEdit
            text={textEditProject}
            description={descriptionEditProject}
            textPlaceholder="프로젝트"
            descPlaceholder="설명(선택)"
            onTextChange={handleTextEditChangeProject}
            onDescChange={handleDescriptionEditChangeProject}
            onSubmit={handleSubmitProject}
            onCancel={handleCancelProject}
          />
        ) : (
          <div>
            <h2 className="title">{props.documents[projectId].title}</h2>
            <div className="description">{props.documents[projectId].description}</div>
            <Dropdown>
              <DropdownItem onClick={handleClickEditProject}>프로젝트 수정</DropdownItem>
              <DropdownItem onClick={handleDeleteProject}>삭제</DropdownItem>
            </Dropdown>
          </div>
        )}
      </div>
      <div className="list">
        {props.documents[projectId].subdocs.map(listId => (
          <TodoList key={listId} list={props.documents[listId]} todos={getTodosByListId(listId)} />
        ))}
        {isEditOpen ? (
          <QuickEdit
            text={textEdit}
            description={descriptionEdit}
            textPlaceholder="새 리스트"
            descPlaceholder="설명(선택)"
            onTextChange={handleTextEditChange}
            onDescChange={handleDescriptionEditChange}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        ) : (
          <Button onClick={handleAddClick}>리스트 추가하기</Button>
        )}
      </div>
    </ProjectDetailPagePane>
  )
}
