import React, { useCallback } from 'react'
import styled from 'styled-components'

const TodoPane = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid white;
  border-radius: 5px;
  margin-bottom: 7px;

  :hover {
    color: #000;
  }
`

interface Props {
  todoId: string
  text: string
  done: boolean
  onChange(): void
}

const Todo: React.FC<Props> = ({ text, done, onChange }) => {
  const handleClick = useCallback(e => e.stopPropagation(), [])
  return (
    <TodoPane>
      <input
        type="checkbox"
        checked={done}
        onClick={handleClick}
        onChange={onChange}
      />
      {text}
    </TodoPane>
  )
}

export default Todo
