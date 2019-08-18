import React, { useState } from 'react'

const dummyTodos = {
  1: {
    id: 1,
    text: 'this is todo',
  },
  2: {
    id: 2,
    text: 'this is todo2',
  },
  3: {
    id: 3,
    text: 'this is todo3',
  },
}

interface Props {}

interface InitialState {
  [todoId: string]: {
    id: number
    text: string
  }
}

const TodoList: React.FC<Props> = () => {
  const [todos] = useState<InitialState>(dummyTodos)
  return (
    <div>
      {Object.keys(todos).map(todoId => (
        <div key={todoId}>{todos[todoId].text}</div>
      ))}
    </div>
  )
}

export default TodoList
