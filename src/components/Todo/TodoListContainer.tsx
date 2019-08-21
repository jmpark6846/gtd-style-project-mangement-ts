import React from 'react'
import { TodoList } from './TodoList'

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

const TodoListContainer: React.FC<Props> = props => {
  return <TodoList {...props} />
}

export default TodoListContainer
