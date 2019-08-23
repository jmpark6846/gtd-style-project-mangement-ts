import React, { useCallback, useContext } from 'react'
import { Todo } from './Todo'
import { Document } from '../../types/Document'
import DocumentContext from '../../contexts/DocumentContext'

export interface TodoContainerProps {
  todo: Document
}

const TodoContainer: React.FC<TodoContainerProps> = props => {
  const { dispatch } = useContext(DocumentContext)
  const handleChangeTodo = (title: string, description: string): void => {
    dispatch({
      type: 'CHANGE_DOCUMENT',
      payload: { id: props.todo.id, title, description },
    })
  }

  const handleCheckboxClick = useCallback(e => {
    e.stopPropagation()
  }, [])

  const handleCheck = (): void => {
    dispatch({
      type: 'CHECK_TODO',
      payload: { id: props.todo.id },
    })
  }

  return (
    <Todo
      todo={props.todo}
      onCheckboxClick={handleCheckboxClick}
      onChangeTodo={handleChangeTodo}
      onCheck={handleCheck}
    />
  )
}

export default TodoContainer
