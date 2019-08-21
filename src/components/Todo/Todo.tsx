import React from 'react'
import styled from 'styled-components'
import { TodoContainerProps } from './TodoContainer'

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

interface TodoProps extends TodoContainerProps {
  onClick(e: any): any
}

export const Todo: React.FC<TodoProps> = props => {
  const { done, onClick, onChange, title } = props
  return (
    <TodoPane>
      <input
        type="checkbox"
        checked={done}
        onClick={onClick}
        onChange={onChange}
      />
      {title}
    </TodoPane>
  )
}
