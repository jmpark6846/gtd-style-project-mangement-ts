import React from 'react'
import styled from 'styled-components'
import { useQuickEdit } from '../../hooks/useQuickEdit'
import { Button } from '../Common'
import QuickEdit from '../QuickEdit/QuickEdit'
import Todo from './TodoContainer'
import { TodoListContainerProps } from './TodoListContainer'
import { dummyDocs } from '../../pages/ProjectDetailPage'

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

interface TodoListProps extends TodoListContainerProps {}

export const TodoList: React.FC<TodoListProps> = ({
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
          <h3 className="title">{rest.title}</h3>
          <div className="description">{rest.description}</div>
        </div>
      )}
      {Object.keys(subdocs || {}).map(todoId => (
        <Todo
          key={todoId}
          {...dummyDocs[todoId]}
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
