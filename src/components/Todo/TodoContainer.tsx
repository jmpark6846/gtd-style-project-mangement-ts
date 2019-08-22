import React, { useCallback } from 'react'
import { Todo } from './Todo'
import { Document } from '../../types/Document'

export interface TodoContainerProps extends Document {
  onChange(e: any): any
}

const TodoContainer: React.FC<TodoContainerProps> = props => {
  const handleClick = useCallback(e => e.stopPropagation(), [])
  return <Todo {...props} onClick={handleClick} />
}

export default TodoContainer
