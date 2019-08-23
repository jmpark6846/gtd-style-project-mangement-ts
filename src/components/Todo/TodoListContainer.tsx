import React, { useCallback, useContext } from 'react'
import { TodoList } from './TodoList'
import { Document } from '../../types/Document'
import shortid from 'short-id'
import DocumentContext from '../../contexts/DocumentContext'

export interface TodoListContainerProps {
  list: Document
  todos: Document[]
}

const TodoListContainer: React.FC<TodoListContainerProps> = props => {
  const { dispatch } = useContext(DocumentContext)
  const handleAddTodo = useCallback(
    (title, description) => {
      const todoId = shortid.generate()
      const newTodo: Document = {
        id: todoId,
        type: 2,
        title,
        description,
        user: props.list.user,
        projectId: props.list.projectId,
        done: false,
        subdocs: {},
      }
      dispatch({
        type: 'ADD_DOCUMENT',
        payload: { parent: props.list.id, id: todoId, document: newTodo },
      })
    },
    [props.list.user, props.list.projectId]
  )

  return <TodoList {...props} onAddTodo={handleAddTodo} />
}

export default TodoListContainer
