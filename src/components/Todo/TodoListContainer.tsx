import React from 'react'
import Todo from './TodoContainer'

interface Props {
  todos: {
    [todoId: string]: {
      id: number
      text: string
      done: boolean
    }
  }
}

const TodoListContainer: React.FC<Props> = ({ todos }) => {
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

export default TodoListContainer
