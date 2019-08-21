import React from 'react'
import styled from 'styled-components'
import TodoList from '../components/Todo/TodoListContainer'
import { Button, Pane } from '../components/Common'

interface Project {
  name: string
  description: string
  type: string
  subdocs: {
    [docId: string]: {
      name: string
      description: string
      type: string
      subdocs: {
        [todoId: string]: { id: number; text: string; done: boolean }
      }
    }
  }
}

const project: Project = {
  name: '블로그',
  description: '2019 블로그 운영',
  type: 'project',
  subdocs: {
    1: {
      name: '주제',
      description: '블로그에 쓸만한 글감들',
      type: 'list',
      subdocs: {
        1: { id: 1, text: 'this is todo', done: true },
        2: { id: 2, text: 'this is todo', done: true },
        3: { id: 3, text: 'this is todo', done: true },
      },
    },
    2: {
      name: '참고할만한 블로그들',
      description: '영감을 받을만한 다른 블로그들',
      type: 'list',
      subdocs: {
        1: { id: 1, text: 'this is todo', done: true },
        2: { id: 2, text: 'this is todo', done: true },
        3: { id: 3, text: 'this is todo', done: true },
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

  .list {
  }
`

interface Props {}

export const ProjectDetailPage: React.FC<Props> = () => {
  return (
    <ProjectDetailPagePane>
      <div className="information-pane">
        <h2 className="name">{project.name}</h2>
        <div className="description">{project.description}</div>
      </div>
      <div className="list">
        {Object.keys(project.subdocs).map(projectId => (
          <TodoList key={projectId} {...project.subdocs[projectId]} />
        ))}
        <Button>리스트 추가하기</Button>
      </div>
    </ProjectDetailPagePane>
  )
}
