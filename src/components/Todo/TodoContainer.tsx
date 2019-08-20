import React, { useCallback } from 'react'
import { Todo } from './Todo'

interface Props {
  todoId: string
  text: string
  done: boolean
  onChange(e: any): any
}

const TodoContainer: React.FC<Props> = props => {
  const handleClick = useCallback(e => e.stopPropagation(), [])

  return <Todo {...props} onClick={handleClick} />
}

export default TodoContainer
