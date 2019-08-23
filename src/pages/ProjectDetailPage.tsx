import { RouteComponentProps } from '@reach/router'
import React, { useCallback, useEffect, useState, useContext } from 'react'
import shortid from 'short-id'
import styled from 'styled-components'
import { Button, Pane } from '../components/Common'
import QuickEdit from '../components/QuickEdit/QuickEdit'
import TodoList from '../components/Todo/TodoListContainer'
import { db } from '../db'
import { useQuickEdit } from '../hooks/useQuickEdit'
import DocumentContext from '../contexts/DocumentContext'
import { User } from '../types/User'
import { Documents } from '../types/Documents'
import { Document } from '../types/Document'

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
  user: User
  isLoggedin: boolean
  documents: Documents
}

export const ProjectDetailPage: React.FC<Props> = props => {
  const { dispatch } = useContext(DocumentContext)
  const [isLoading, setIsLoading] = useState(true)
  const projectId = props.projectId!
  useEffect(() => {
    if (props.isLoggedin) {
      const fetchDocument = async (): Promise<void> => {
        try {
          const document = await db
            .collection('documents')
            .where('user', '==', props.user.id)
            .where('id', '==', projectId)
            .get()
            .then(snapshot => (snapshot.empty ? {} : snapshot.docs[0].data()))

          const subdocsSnapshot = await db
            .collection('documents')
            .where('user', '==', props.user.id)
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
  }, [props.isLoggedin, props.user.id])

  const {
    textEdit,
    descriptionEdit,
    isEditOpen,
    setEdits,
    handleTextEditChange,
    handleDescriptionEditChange,
    handleCancel,
  } = useQuickEdit({ text: '', description: '' })

  const handleSubmit = useCallback(() => {
    const listId = shortid.generate()
    const newList: Document = {
      id: listId,
      title: textEdit,
      description: descriptionEdit,
      type: 1,
      user: props.user.id,
      projectId,
      done: false,
      subdocs: {},
    }
    dispatch({
      type: 'ADD_DOCUMENT',
      payload: { parent: projectId, id: listId, document: newList },
    })
    setEdits({ text: '', description: '' })
  }, [props.user.id, projectId, textEdit, descriptionEdit])

  const handleAddTodo = useCallback(
    (listId, title, description) => {
      const todoId = shortid.generate()
      const newTodo: Document = {
        id: todoId,
        type: 2,
        title,
        description,
        user: props.user.id,
        projectId,
        done: false,
        subdocs: {},
      }
      dispatch({
        type: 'ADD_DOCUMENT',
        payload: { parent: listId, id: todoId, document: newTodo },
      })
    },
    [props.user.id, projectId]
  )

  const handleAddClick = useCallback((): void => setEdits({ isOpen: true }), [])

  const getTodosByListId = useCallback(
    (listId: string) => {
      const todoIds = Object.keys(props.documents[listId].subdocs || {})
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
        <h2 className="title">{props.documents[projectId].title}</h2>
        <div className="description">{props.documents[projectId].description}</div>
      </div>
      <div className="list">
        {Object.keys(props.documents[projectId].subdocs || {}).map(listId => (
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
