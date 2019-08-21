import React from 'react'
import styled from 'styled-components'
import { useQuickEdit } from '../../hooks/useQuickEdit'
import { Button } from '../Common'
import QuickEdit from '../QuickEdit/QuickEdit'
import Todo from './TodoContainer'

const TodoListPane = styled.div`
  margin-bottom: 30px;
  h3.name {
    font-weight: 600;
    font-size: 1.3rem;
  }
  .description {
    color: grey;
  }
`
interface Props {
  id: string
  name: string
  description: string
  type: string
  subdocs: {
    [todoId: string]: {
      id: string
      text: string
      done: boolean
    }
  }
  onAddTodo(listId: string, text: string, description: string): void
}

export const TodoList: React.FC<Props> = ({
  id: listId,
  subdocs,
  onAddTodo,
  ...rest
}) => {
  const {
    textEdit,
    setTextEdit,
    handleTextEditChange,
    descriptionEdit,
    setDescriptionEdit,
    handleDescriptionEditChange,
    isEditOpen,
    setIsEditOpen,
    handleCancel,
  } = useQuickEdit({ text: '', description: '' })

  return (
    <TodoListPane>
      {rest.type == 'list' && (
        <div className="info-pane">
          <h3 className="name">{rest.name}</h3>
          <div className="description">{rest.description}</div>
        </div>
      )}
      {Object.keys(subdocs).map(todoId => (
        <Todo
          key={todoId}
          todoId={todoId}
          text={subdocs[todoId].text}
          done={subdocs[todoId].done}
          onChange={(): void => console.log(todoId)}
        />
      ))}
      {isEditOpen ? (
        <QuickEdit
          text={textEdit}
          description={descriptionEdit}
          textPlaceholder="새 리스트"
          descPlaceholder="설명(선택)"
          onTextChange={handleTextEditChange}
          onDescChange={handleDescriptionEditChange}
          onSubmit={(): void => onAddTodo(listId, textEdit, descriptionEdit)}
          onCancel={handleCancel}
        />
      ) : (
        <Button small onClick={(): void => setIsEditOpen(true)}>
          추가하기
        </Button>
      )}
    </TodoListPane>
  )
}
