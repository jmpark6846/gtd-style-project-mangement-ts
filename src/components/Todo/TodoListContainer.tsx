import React, { useCallback, useContext } from 'react'
import shortid from 'short-id'
import DocumentContext from '../../contexts/DocumentContext'
import { Document } from '../../types/Document'
import { TodoList } from './TodoList'

export interface TodoListContainerProps {
  list: Document
  todos: Document[]
  hideHeading?: boolean
  hideDescription?: boolean
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
        subdocs: [],
      }
      dispatch({
        type: 'ADD_DOCUMENT',
        payload: { parent: props.list.id, id: todoId, document: newTodo },
      })
    },
    [props.list.user, props.list.projectId, dispatch, props.list.id]
  )

  return <TodoList {...props} onAddTodo={handleAddTodo} />
}

export default TodoListContainer
