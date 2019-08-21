import React from 'react'
import Todo from './TodoContainer'
import styled from 'styled-components'
import { Button } from '../Common'

const TodoListPane = styled.div`
  margin-bottom: 30px;
  h3.name {
    font-weight: 600;
    font-size: 1.3rem;
  }
  .description {
    color: grey;
  }
`
interface Props {
  name: string
  description: string
  type: string
  subdocs: {
    [todoId: string]: {
      id: number
      text: string
      done: boolean
    }
  }
}

export const TodoList: React.FC<Props> = ({
  name,
  description,
  type,
  subdocs,
}) => {
  return (
    <TodoListPane>
      {type == 'list' && (
        <div className="info-pane">
          <h3 className="name">{name}</h3>
          <div className="description">{description}</div>
        </div>
      )}
      {Object.keys(subdocs).map(todoId => (
        <Todo
          key={todoId}
          todoId={todoId}
          text={subdocs[todoId].text}
          done={subdocs[todoId].done}
          onChange={(): void => console.log(todoId)}
        />
      ))}
      <Button small>추가하기</Button>
    </TodoListPane>
  )
}
