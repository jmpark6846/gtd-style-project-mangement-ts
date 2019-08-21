import React, { useCallback, useEffect, useState } from 'react'
import shortid from 'short-id'
import styled from 'styled-components'
import { Button, Pane } from '../components/Common'
import QuickEdit from '../components/QuickEdit/QuickEditorContainer'
import TodoList from '../components/Todo/TodoListContainer'
import { useQuickEdit } from '../hooks/useQuickEdit'

interface Project {
  name: string
  description: string
  type: string
  subdocs: {
    [docId: string]: {
      id: string
      name: string
      description: string
      type: string
      subdocs: {
        [todoId: string]: { id: string; text: string; done: boolean }
      }
    }
  }
}

const initialState: Project = {
  name: '',
  description: '',
  type: 'project',
  subdocs: {},
}
const dummyProject: Project = {
  name: '블로그',
  description: '2019 블로그 운영',
  type: 'project',
  subdocs: {
    '1': {
      id: '1',
      name: '주제',
      description: '블로그에 쓸만한 글감들',
      type: 'list',
      subdocs: {
        '1': { id: '1', text: 'this is todo', done: true },
        '2': { id: '2', text: 'this is todo', done: true },
        '3': { id: '3', text: 'this is todo', done: true },
      },
    },
    '2': {
      id: '2',
      name: '참고할만한 블로그들',
      description: '영감을 받을만한 다른 블로그들',
      type: 'list',
      subdocs: {
        '1': { id: '1', text: 'this is todo', done: true },
        '2': { id: '2', text: 'this is todo', done: true },
        '3': { id: '3', text: 'this is todo', done: true },
      },
    },
  },
}

const ProjectDetailPagePane = styled(Pane)`
  .information-pane {
    margin-bottom: 30px;

    h2.name {
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
  const [project, setProject] = useState(initialState)
  useEffect(() => {
    setProject(dummyProject)
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
    const newList = {
      name: textEdit,
      description: descriptionEdit,
      type: 'list',
      subdocs: {},
    }
    setProject({
      ...project,
      subdocs: {
        ...project.subdocs,
        [listId]: newList,
      },
    })
    setTextEdit('')
    setDescriptionEdit('')
  }, [project, textEdit, descriptionEdit])

  const handleAddTodo = useCallback(
    (listId, text, description) => {
      const todoId = shortid.generate()
      const newTodo = {
        id: todoId,
        text,
        description,
        done: false,
      }
      const newProject = {
        ...project,
        subdocs: {
          ...project.subdocs,
          [listId]: {
            ...project.subdocs[listId],
            subdocs: {
              ...project.subdocs[listId].subdocs,
              [todoId]: newTodo,
            },
          },
        },
      }
      setProject(newProject)
    },
    [project]
  )
  console.log(project)
  return (
    <ProjectDetailPagePane>
      <div className="information-pane">
        <h2 className="name">{project.name}</h2>
        <div className="description">{project.description}</div>
      </div>
      <div className="list">
        {Object.keys(project.subdocs).map(projectId => (
          <TodoList
            key={projectId}
            {...project.subdocs[projectId]}
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
