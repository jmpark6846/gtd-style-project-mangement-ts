import { navigate, RouteComponentProps } from '@reach/router'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import shortid from 'short-id'
import styled from 'styled-components'
import { Button, Pane, Input } from '../components/Common'
import Dropdown, { DropdownItem } from '../components/Dropdown/Dropdown'
import QuickEdit from '../components/QuickEdit/QuickEdit'
import TodoList from '../components/Todo/TodoListContainer'
import DocumentContext from '../contexts/DocumentContext'
import { db } from '../db'
import useAuth from '../hooks/useAuth'
import { useQuickEdit } from '../hooks/useQuickEdit'
import { AuthStatus } from '../types/AuthStatus'
import { Document } from '../types/Document'
import { Documents } from '../types/Documents'
import ContentEditable from 'react-contenteditable'
import { Breadcumb } from '../components/Breadcumb'
import {} from 'react-icons'

const ProjectDetailPagePane = styled(Pane)`
  .information-pane {
    margin-bottom: 20px;

    h2.title {
      font-weight: 700;
      font-size: 1.7rem;
    }
    .description {
      color: grey;
    }
    label {
      padding: 0.4rem 0.5rem;
      margin-left: 5px;
      border-radius: 5px;
      background-color: #74b9ff;
      font-size: 0.8rem;
      color: white;
    }
  }
  .heading-pane {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
  }
`

interface Props extends RouteComponentProps {
  projectId?: string
  documents: Documents
}

export const ProjectDetailPage: React.FC<Props> = props => {
  const [user, status] = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const projectId = props.projectId!
  useEffect(() => {
    if (status === AuthStatus.unauthenticated) props.navigate!('/')
    if (!isLoading && props.documents[projectId] == null) props.navigate!('/projects')
  }, [isLoading, props.documents, projectId, props.navigate, status])

  const { dispatch } = useContext(DocumentContext)
  useEffect(() => {
    if (status === AuthStatus.authenticated) {
      const fetchDocument = async (): Promise<void> => {
        try {
          const document = await db
            .collection('documents')
            .where('user', '==', user.id)
            .where('id', '==', projectId)
            .get()
            .then(snapshot => (snapshot.empty ? null : snapshot.docs[0].data()))

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
  }, [status, dispatch, projectId, user.id])

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
  }, [textEditProject, descriptionEditProject, dispatch, projectId, setEditsProject])

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
    setEdits({ text: '', description: '', isOpen: false })
  }, [user.id, projectId, textEdit, descriptionEdit, dispatch, setEdits])

  const handleAddClick = useCallback((): void => setEdits({ isOpen: true }), [setEdits])

  const getTodosByListId = useCallback(
    (listId: string) => {
      const todoIds = props.documents[listId].subdocs
      const todos = todoIds.map(todoId => props.documents[todoId])
      return todos
    },
    [props.documents]
  )

  const emptyMemoCallback = useCallback(() => {}, [])

  return isLoading || props.documents[projectId] == null ? (
    <div>loading..</div>
  ) : (
    <ProjectDetailPagePane>
      <Breadcumb paths={[{ id: projectId, title: props.documents[projectId].title }]} />
      <div className="information-pane">
        {isEditOpenProject ? (
          <Pane marginBottom="15px">
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
          </Pane>
        ) : (
          <Pane marginBottom="20px">
            <div className="heading-pane">
              <h2 className="title">{props.documents[projectId].title}</h2>
              <label>프로젝트</label>
              <Dropdown>
                <DropdownItem onClick={handleClickEditProject}>프로젝트 수정</DropdownItem>
                <DropdownItem onClick={handleDeleteProject}>삭제</DropdownItem>
              </Dropdown>
            </div>
            <ContentEditable
              className="description"
              onChange={emptyMemoCallback}
              html={props.documents[projectId].description || ''}
              disabled={true}
            />
          </Pane>
        )}
      </div>
      <div className="list">
        {props.documents[projectId].subdocs.map(listId => (
          <TodoList
            key={listId}
            hideDescription={true}
            list={props.documents[listId]}
            todos={getTodosByListId(listId)}
          />
        ))}
      </div>
      <Pane marginTop="30px">
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
          <Button onClick={handleAddClick}>리스트 추가</Button>
        )}
      </Pane>
    </ProjectDetailPagePane>
  )
}
