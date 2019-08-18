import React, { useState } from 'react'

interface Props {}

const Todo: React.FC<Props> = () => {
  const [text, setText] = useState('this is a default text')
  return <div>{text}</div>
}

export default Todo
