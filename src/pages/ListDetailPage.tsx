import { RouteComponentProps } from '@reach/router'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Pane } from '../components/Common'
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

const ListDetailPagePane = styled(Pane)`
  .information-pane {
    margin-bottom: 25px;
    label {
      padding: 0.4rem 0.5rem;
      margin-left: 5px;
      border-radius: 5px;
      background-color: #a29bfe;
      font-size: 0.8rem;
      color: white;
    }
  }

  h2.title {
    font-weight: 700;
    font-size: 1.7rem;
  }
  .description {
    color: grey;
  }
  .heading-pane {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
  }
`

interface Props extends RouteComponentProps {
  projectId?: string
  listId?: string
  documents: Documents
}

export const ListDetailPage: React.FC<Props> = props => {
  const [user, status] = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const listId = props.listId!
  const projectId = props.projectId!

  useEffect(() => {
    if (status === AuthStatus.unauthenticated) props.navigate!('/')
    if (!isLoading && !props.documents[listId]) props.navigate!('/projects/' + projectId)
  }, [status, props.documents, props.navigate, listId, projectId])

  const { dispatch } = useContext(DocumentContext)
  useEffect(() => {
    if (status === AuthStatus.authenticated) {
      const fetchDocument = async (): Promise<void> => {
        try {
          const list = await db
            .collection('documents')
            .where('user', '==', user.id)
            .where('id', '==', listId)
            .get()
            .then(snapshot => (snapshot.empty ? null : snapshot.docs[0].data()))

          const project = await db
            .collection('documents')
            .where('user', '==', user.id)
            .where('id', '==', projectId)
            .get()
            .then(snapshot => (snapshot.empty ? null : snapshot.docs[0].data()))

          const subdocsSnapshot = await db
            .collection('documents')
            .where('user', '==', user.id)
            .where('projectId', '==', projectId)
            .where('type', '>', 1)
            .get()

          const docs: Documents = {}
          subdocsSnapshot.forEach(doc => {
            const _doc = doc.data() as Document
            docs[_doc.id] = _doc
          })

          docs[projectId] = project as Document
          docs[listId] = list as Document
          dispatch({ type: 'UPDATE_DOCUMENTS', payload: docs })
          setIsLoading(false)
        } catch (error) {
          console.error('error fetching documents: ' + error)
        }
      }
      fetchDocument()
    }
  }, [listId, dispatch, projectId, user.id, status])

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
  }, [textEdit, descriptionEdit, dispatch, listId, setEdits])

  const handleClickEdit = (): void =>
    setEdits({
      text: props.documents[listId].title,
      description: props.documents[listId].description,
      isOpen: true,
    })

  const getTodosByListId = useCallback(
    (listId: string) => {
      const todoIds = props.documents[listId].subdocs
      const todos = todoIds.map(todoId => props.documents[todoId])
      return todos
    },
    [props.documents]
  )

  const handleDeleteList = (): void => {
    dispatch({
      type: 'DELETE_DOCUMENT',
      payload: { id: listId, parent: projectId },
    })
    setIsLoading(true)
    props.navigate!('/projects/' + projectId)
  }
  const emptyMemoCallback = useCallback(() => {}, [])
  return isLoading || props.documents[listId] == null ? (
    <div>loading..</div>
  ) : (
    <ListDetailPagePane>
      <Breadcumb
        paths={[
          { id: projectId, title: props.documents[projectId].title },
          { id: listId, title: props.documents[listId].title },
        ]}
      />

      <div className="information-pane">
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
            <div className="heading-pane">
              <h2 className="title">{props.documents[listId].title}</h2>
              <label>리스트</label>
              <Dropdown>
                <DropdownItem onClick={handleClickEdit}>리스트 수정</DropdownItem>
                <DropdownItem onClick={handleDeleteList}>삭제</DropdownItem>
              </Dropdown>
            </div>
            <ContentEditable
              className="description"
              onChange={emptyMemoCallback}
              html={props.documents[listId].description || ''}
              disabled={true}
            />
          </div>
        )}
      </div>
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
