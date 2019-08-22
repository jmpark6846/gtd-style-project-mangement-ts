import React, { useState } from 'react'
import { ContentEditableEvent } from 'react-contenteditable'

export const useInputState = (
  initalState: string
): [
  string,
  React.Dispatch<React.SetStateAction<string>>,
  (e: React.ChangeEvent<HTMLInputElement> | ContentEditableEvent) => void
] => {
  const [state, setState] = useState(initalState)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | ContentEditableEvent): void => {
    if (e != null && e.target != null) {
      setState(e.target.value)
    }
  }

  return [state, setState, handleChange]
}
