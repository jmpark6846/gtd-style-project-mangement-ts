import { Link } from '@reach/router'
import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useQuickEdit } from '../../hooks/useQuickEdit'
import { Button, Pane } from '../Common'
import QuickEdit from '../QuickEdit/QuickEdit'
import Todo from './TodoContainer'
import { TodoListContainerProps } from './TodoListContainer'

const TodoListPane = styled.div`
  margin-top: 25px;

  :hover {
    button.todo-add {
      /* transition: opacity 0.1s ease-in-out;
      opacity: 1; */
    }
  }
  .info-pane {
    margin-bottom: 10px;
  }
  h3.title {
    font-weight: 600;
    font-size: 1.3rem;
    margin-bottom: 6px;
  }
  .description {
    color: grey;
  }

  button.todo-add {
    /* transition: opacity 0.1s ease-in-out;
    opacity: 0; */
  }
`

interface TodoListProps extends TodoListContainerProps {
  onAddTodo(text: string, description: string): void
}

export const TodoList: React.FC<TodoListProps> = ({ hideHeading, list, onAddTodo, todos }) => {
  const [
    textEdit,
    descriptionEdit,
    isEditOpen,
    setEdits,
    handleTextEditChange,
    handleDescriptionEditChange,
    handleCancel,
  ] = useQuickEdit({ text: '', description: '' })

  const handleSubmit = useCallback(() => {
    onAddTodo(textEdit, descriptionEdit)
    setEdits({ text: '', description: '', isOpen: true })
  }, [textEdit, descriptionEdit])
  const handleClick = useCallback((): void => setEdits({ isOpen: true }), [setEdits])
  return (
    <TodoListPane>
      {!hideHeading && (
        <div className="info-pane">
          <h3 className="title">
            <Link to={`lists/${list.id}`}>{list.title}</Link>
          </h3>
          <div className="description">{list.description}</div>
        </div>
      )}
      <Pane marginBottom="10px">
        {todos.map(todo => (
          <Todo key={todo.id} listId={list.id} todo={todo} />
        ))}
      </Pane>
      {isEditOpen ? (
        <Pane marginBottom="8px" marginTop="10px">
          <QuickEdit
            text={textEdit}
            description={descriptionEdit}
            textPlaceholder="할 일"
            descPlaceholder="설명(선택)"
            onTextChange={handleTextEditChange}
            onDescChange={handleDescriptionEditChange}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </Pane>
      ) : (
        <Button className="todo-add" small onClick={handleClick}>
          할 일 추가
        </Button>
      )}
    </TodoListPane>
  )
}
