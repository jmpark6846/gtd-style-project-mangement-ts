import React from 'react'
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
  onChange(e: any): any
  onClick(e: any): any
}

export const Todo: React.FC<Props> = props => {
  const { done, onClick, onChange, text } = props
  return (
    <TodoPane>
      <input
        type="checkbox"
        checked={done}
        onClick={onClick}
        onChange={onChange}
      />
      {text}
    </TodoPane>
  )
}
