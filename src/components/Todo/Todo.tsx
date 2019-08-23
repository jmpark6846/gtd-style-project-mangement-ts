import React from 'react'
import styled from 'styled-components'
import { TodoContainerProps } from './TodoContainer'
import QuickEdit from '../QuickEdit/QuickEdit'
import { useQuickEdit } from '../../hooks/useQuickEdit'
import { Document } from '../../types/Document'

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

interface TodoProps {
  todo: Document
  onCheckboxClick(e: any): any
  onChangeTodo(title: string, description: string): void
}

export const Todo: React.FC<TodoProps> = props => {
  const { todo, onCheckboxClick, onChangeTodo } = props
  const {
    textEdit,
    handleTextEditChange,
    descriptionEdit,
    handleDescriptionEditChange,
    isEditOpen,
    setIsEditOpen,
    handleCancel,
  } = useQuickEdit({ text: '', description: '' })

  return isEditOpen ? (
    <QuickEdit
      text={textEdit}
      description={descriptionEdit}
      textPlaceholder="새 리스트"
      descPlaceholder="설명(선택)"
      onTextChange={handleTextEditChange}
      onDescChange={handleDescriptionEditChange}
      onSubmit={(): void => onChangeTodo(textEdit, descriptionEdit)}
      onCancel={handleCancel}
    />
  ) : (
    <TodoPane onClick={(): void => setIsEditOpen(true)}>
      <input type="checkbox" checked={todo.done} onClick={onCheckboxClick} />
      {todo.title}
    </TodoPane>
  )
}
