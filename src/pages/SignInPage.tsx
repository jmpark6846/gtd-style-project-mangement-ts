import React, { useCallback, useState } from 'react'
import { RouteComponentProps, navigate } from '@reach/router'
import styled from 'styled-components'
import { Input, Button } from '../components/Common'
import { useInputState } from '../hooks/useInputState'
import { firebaseAuth } from '../db'

const SignInPagePane = styled.div`
  h2.title {
    font-weight: 700;
    font-size: 1.7rem;
  }
  .signin-form {
    margin-top: 20px;
  }
  .field {
    margin-bottom: 13px;
  }
  .control-pane {
    display: flex;
    justify-content: space-between;
  }
`

interface Props extends RouteComponentProps {}

export const SignInPage: React.FC<Props> = () => {
  const [email, _setEmail, handleEmailChange] = useInputState('')
  const [password, _setPassword, handlePasswordChange] = useInputState('')
  const [message, setMessage] = useState('')
  const handleSignin = useCallback(async () => {
    try {
      await firebaseAuth.signInWithEmailAndPassword(email, password)
      navigate('projects')
    } catch (error) {
      console.error(error)
      setMessage(error.message)
    }
  }, [email, password])

  return (
    <SignInPagePane>
      <h2 className="title">Sign In</h2>
      <div className="signin-form">
        <div className="field">
          <Input value={email} onChange={handleEmailChange} placeholder="email" />
        </div>
        <div className="field">
          <Input
            value={password}
            type="password"
            onChange={handlePasswordChange}
            placeholder="password"
          />
        </div>
      </div>
      <div className="message">{message}</div>
      <div className="control-pane">
        <Button onClick={useCallback(() => navigate('/signup'), [])}>회원가입</Button>
        <Button onClick={handleSignin}>로그인</Button>
      </div>
    </SignInPagePane>
  )
}
