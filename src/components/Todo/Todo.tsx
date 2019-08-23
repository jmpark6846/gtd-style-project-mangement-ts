import React, { useCallback } from 'react'
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
  onCheck(): void
}

export const Todo: React.FC<TodoProps> = props => {
  const {
    textEdit,
    descriptionEdit,
    isEditOpen,
    setEdits,
    handleTextEditChange,
    handleDescriptionEditChange,
  } = useQuickEdit({ text: props.todo.title, description: props.todo.description })

  const handleSubmit = useCallback(() => {
    props.onChangeTodo(textEdit, descriptionEdit)
    setEdits({ isOpen: false })
  }, [textEdit, descriptionEdit])

  const handleCancel = (): void =>
    setEdits({ text: props.todo.title, description: props.todo.description, isOpen: false })

  return isEditOpen ? (
    <QuickEdit
      text={textEdit}
      description={descriptionEdit}
      textPlaceholder="새 리스트"
      descPlaceholder="설명(선택)"
      onTextChange={handleTextEditChange}
      onDescChange={handleDescriptionEditChange}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  ) : (
    <TodoPane onClick={(): void => setEdits({ isOpen: true })}>
      <input
        type="checkbox"
        checked={props.todo.done}
        onClick={props.onCheckboxClick}
        onChange={props.onCheck}
      />
      {props.todo.title}
    </TodoPane>
  )
}
