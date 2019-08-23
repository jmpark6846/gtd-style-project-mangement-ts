import { Link } from '@reach/router'
import React from 'react'
import styled from 'styled-components'
import { useQuickEdit } from '../../hooks/useQuickEdit'
import { Button } from '../Common'
import QuickEdit from '../QuickEdit/QuickEdit'
import Todo from './TodoContainer'
import { TodoListContainerProps } from './TodoListContainer'

const TodoListPane = styled.div`
  margin-bottom: 30px;
  h3.title {
    font-weight: 600;
    font-size: 1.3rem;
  }
  .description {
    color: grey;
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
      {todos.map(todo => (
        <Todo key={todo.id} listId={list.id} todo={todo} />
      ))}
      {isEditOpen ? (
        <QuickEdit
          text={textEdit}
          description={descriptionEdit}
          textPlaceholder="새 리스트"
          descPlaceholder="설명(선택)"
          onTextChange={handleTextEditChange}
          onDescChange={handleDescriptionEditChange}
          onSubmit={(): void => onAddTodo(textEdit, descriptionEdit)}
          onCancel={handleCancel}
        />
      ) : (
        <Button small onClick={(): void => setEdits({ isOpen: true })}>
          추가하기
        </Button>
      )}
    </TodoListPane>
  )
}
