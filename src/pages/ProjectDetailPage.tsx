import React, { useCallback, useEffect, useState } from 'react'
import shortid from 'short-id'
import styled from 'styled-components'
import { Button, Pane } from '../components/Common'
import QuickEdit from '../components/QuickEdit/QuickEditorContainer'
import TodoList from '../components/Todo/TodoListContainer'
import { useQuickEdit } from '../hooks/useQuickEdit'

export interface Document {
  id: string
  title: string
  description?: string
  type: string
  user: string
  done: boolean
  subdocs?: {
    [docId: string]: boolean
  }
}

export interface Documents {
  [id: string]: Document
}

const initialState: Documents = {
  '56be54': {
    id: '56be54',
    title: '',
    description: '',
    type: 'project',
    done: false,
    user: '',
    subdocs: {},
  },
}

export const dummyDocs: Documents = {
  '56be54': {
    id: '56be54',
    title: '블로그',
    description: '2019 블로그 운영',
    type: 'project',
    user: 'jmpark6846',
    done: false,
    subdocs: {
      '56be5q': true,
      '56be5a': true,
    },
  },
  '56be5q': {
    id: '56be5q',
    title: '주제',
    description: '블로그에 쓸만한 글감들',
    type: 'list',
    user: 'jmpark6846',
    done: false,
    subdocs: {
      '56be5c': true,
      '56be5h': true,
    },
  },
  '56be5a': {
    id: '56be5a',
    title: '참고할만한 블로그들',
    description: '영감을 받을만한 다른 블로그들',
    type: 'list',
    user: 'jmpark6846',
    done: false,
    subdocs: {
      '56be5p': true,
      '56be5o': true,
    },
  },
  '56be5c': {
    id: '56be5c',
    title: 'this is a todo',
    description: 'this is a description',
    type: 'todo',
    user: 'jmpark6846',
    done: false,
    subdocs: {},
  },
  '56be5h': {
    id: '56be5h',
    title: 'this is a todo',
    description: 'this is a description',
    type: 'todo',
    user: 'jmpark6846',
    done: false,
    subdocs: {},
  },
  '56be5p': {
    id: '56be5p',
    title: 'this is a todo',
    description: 'this is a description',
    type: 'todo',
    user: 'jmpark6846',
    done: false,
    subdocs: {},
  },
  '56be5o': {
    id: '56be5o',
    title: 'this is a todo',
    description: 'this is a description',
    type: 'todo',
    user: 'jmpark6846',
    done: false,
    subdocs: {},
  },
}

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

interface Props {}

export const ProjectDetailPage: React.FC<Props> = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [documents, setDocuments] = useState(initialState)
  const [projectId, setProjectId] = useState('56be54')
  useEffect(() => {
    setDocuments(dummyDocs)
    setIsLoading(false)
  }, [isLoading])

  const {
    textEdit,
    setTextEdit,
    handleTextEditChange,
    descriptionEdit,
    setDescriptionEdit,
    handleDescriptionEditChange,
    isEditOpen,
    setIsEditOpen,
    handleCancel,
  } = useQuickEdit({ text: '', description: '' })

  const handleSubmit = useCallback(() => {
    const listId = shortid.generate()
    const newList: Document = {
      id: listId,
      title: textEdit,
      description: descriptionEdit,
      type: 'list',
      user: 'jmpark6846',
      done: false,
      subdocs: {},
    }
    setDocuments({
      ...documents,
      [projectId]: {
        ...documents[projectId],
        subdocs: {
          ...documents[projectId].subdocs,
          [listId]: true,
        },
      },
      [listId]: newList,
    })
    setTextEdit('')
    setDescriptionEdit('')
  }, [documents, textEdit, descriptionEdit])

  const handleAddTodo = useCallback(
    (listId, title, description) => {
      const todoId = shortid.generate()
      const newTodo: Document = {
        id: todoId,
        type: 'todo',
        title,
        description,
        user: 'jmpark6846',
        done: false,
        subdocs: {},
      }
      console.log(listId, documents[listId])
      setDocuments({
        ...documents,
        [listId]: {
          ...documents[listId],
          subdocs: {
            ...documents[listId].subdocs,
            [todoId]: true,
          },
        },
        [todoId]: newTodo,
      })
    },
    [documents]
  )
  console.log(documents)
  return (
    <ProjectDetailPagePane>
      <div className="information-pane">
        <h2 className="title">{documents[projectId].title}</h2>
        <div className="description">{documents[projectId].description}</div>
      </div>
      <div className="list">
        {Object.keys(documents[projectId].subdocs || {}).map(listId => (
          <TodoList
            key={listId}
            {...documents[listId]}
            onAddTodo={handleAddTodo}
          />
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
          <Button onClick={(): void => setIsEditOpen(true)}>
            리스트 추가하기
          </Button>
        )}
      </div>
    </ProjectDetailPagePane>
  )
}
