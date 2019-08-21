import React from 'react'
import { TodoList } from './TodoList'
import { Document } from '../../pages/ProjectDetailPage'

export interface TodoListContainerProps extends Document {
  onAddTodo(listId: string, text: string, description: string): void
}

const TodoListContainer: React.FC<TodoListContainerProps> = props => {
  return <TodoList {...props} />
}

export default TodoListContainer
