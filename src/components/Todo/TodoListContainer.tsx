import React, { useState } from 'react'
import { TodoList } from './TodoList'
import { useInputState } from '../../hooks/useInputState'

interface Props {
  id: string
  name: string
  description: string
  type: string
  subdocs: {
    [todoId: string]: {
      id: string
      text: string
      done: boolean
    }
  }
  onAddTodo(listId: string, text: string, description: string): void
}

const TodoListContainer: React.FC<Props> = props => {
  return <TodoList {...props} />
}

export default TodoListContainer
