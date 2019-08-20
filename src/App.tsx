import React from 'react'
import './App.css'
import TodoList from './components/Todo/TodoListContainer'

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

const App: React.FC = () => {
  return (
    <div className="App">
      <TodoList todos={dummyTodos} />
    </div>
  )
}

export default App
