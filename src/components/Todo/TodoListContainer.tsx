import React from 'react'
import { TodoList } from './TodoList'
import { Document } from '../../types/Document'

export interface TodoListContainerProps {
  list: Document
  onAddTodo(listId: string, text: string, description: string): void
}

const TodoListContainer: React.FC<TodoListContainerProps> = props => {
  return <TodoList {...props} />
}

export default TodoListContainer
