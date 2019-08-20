import React, { useState, useCallback } from 'react'
import Todo from './Todo'

const dummyTodos = {
  1: {
    id: 1,
    text: 'this is todo',
    done: true,
  },
  2: {
    id: 2,
    text: 'this is todo2',
    done: false,
  },
  3: {
    id: 3,
    text: 'this is todo3',
    done: false,
  },
}

interface Props {}

interface InitialState {
  [todoId: string]: {
    id: number
    text: string
    done: boolean
  }
}

const TodoList: React.FC<Props> = () => {
  const [todos] = useState<InitialState>(dummyTodos)
  return (
    <div>
      {Object.keys(todos).map(todoId => (
        <Todo
          key={todoId}
          todoId={todoId}
          text={todos[todoId].text}
          done={todos[todoId].done}
          onChange={(): void => console.log(todoId)}
        />
      ))}
    </div>
  )
}

export default TodoList
