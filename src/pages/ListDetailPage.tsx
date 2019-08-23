import React, { useEffect, useContext, useState, useCallback } from 'react'
import styled from 'styled-components'
import { Link, RouteComponentProps } from '@reach/router'
import { Pane, Button } from '../components/Common'
import TodoList from '../components/Todo/TodoListContainer'
import { User } from '../types/User'
import DocumentContext from '../contexts/DocumentContext'
import { db } from '../db'
import { Documents } from '../types/Documents'
import { Document } from '../types/Document'
import { useQuickEdit } from '../hooks/useQuickEdit'
import QuickEdit from '../components/QuickEdit/QuickEdit'

const ListDetailPagePane = styled(Pane)`
  h2.title {
    font-weight: 700;
    font-size: 1.7rem;
  }
  .description {
    color: grey;
  }
`

interface Props extends RouteComponentProps {
  projectId?: string
  listId?: string
  user: User
  isLoggedin: boolean
  documents: Documents
}

export const ListDetailPage: React.FC<Props> = props => {
  const { dispatch } = useContext(DocumentContext)
  const [isLoading, setIsLoading] = useState(true)
  const listId = props.listId!
  const projectId = props.projectId!
  useEffect(() => {
    if (props.isLoggedin) {
      const fetchDocument = async (): Promise<void> => {
        try {
          const document = await db
            .collection('documents')
            .where('user', '==', props.user.id)
            .where('id', '==', listId)
            .get()
            .then(snapshot => (snapshot.empty ? {} : snapshot.docs[0].data()))

          const subdocsSnapshot = await db
            .collection('documents')
            .where('user', '==', props.user.id)
            .where('projectId', '==', projectId)
            .where('type', '>', 1)
            .get()

          const docs: Documents = {}
          subdocsSnapshot.forEach(doc => {
            const _doc = doc.data() as Document
            docs[_doc.id] = _doc
          })

          docs[listId] = document as Document
          dispatch({ type: 'UPDATE_DOCUMENTS', payload: docs })
          setIsLoading(false)
        } catch (error) {
          console.error('error fetching documents: ' + error)
        }
      }
      fetchDocument()
    }
  }, [props.isLoggedin])

  const [
    textEdit,
    descriptionEdit,
    isEditOpen,
    setEdits,
    handleTextEditChange,
    handleDescriptionEditChange,
    handleCancel,
  ] = useQuickEdit({ text: '', description: '' })

  const handleSubmit = useCallback((): void => {
    dispatch({
      type: 'CHANGE_DOCUMENT',
      payload: { id: listId, title: textEdit, description: descriptionEdit },
    })
    setEdits({
      isOpen: false,
    })
  }, [textEdit, descriptionEdit])

  const handleClickEdit = (): void =>
    setEdits({
      text: props.documents[listId].title,
      description: props.documents[listId].description,
      isOpen: true,
    })

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
    <ListDetailPagePane>
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
        <div>
          <h2 className="title">{props.documents[listId].title}</h2>
          <div className="description">{props.documents[listId].description}</div>
          <Button onClick={handleClickEdit}>수정</Button>
        </div>
      )}
      <div className="list">
        <TodoList
          key={listId}
          hideHeading={true}
          list={props.documents[listId]}
          todos={getTodosByListId(listId)}
        />
      </div>
    </ListDetailPagePane>
  )
}
