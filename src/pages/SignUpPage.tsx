import { RouteComponentProps, navigate } from '@reach/router'
import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Button, Input } from '../components/Common'
import { db, firebaseAuth } from '../db'
import { useInputState } from '../hooks/useInputState'

const SignUpPagePane = styled.div`
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

export const SignUpPage: React.FC<Props> = () => {
  const [email, _setEmail, handleEmailChange] = useInputState('')
  const [username, _setUsername, handleUsernameChange] = useInputState('')
  const [password, _setPassword, handlePasswordChange] = useInputState('')
  const handleSubmit = useCallback(async () => {
    try {
      const res = await firebaseAuth.createUserWithEmailAndPassword(email, password)
      if (res && res.user) {
        await db
          .collection('users')
          .doc(res.user.uid)
          .set({
            id: res.user.uid,
            email,
            username,
          })
        navigate('projects')
      }
    } catch (error) {
      console.error('error signing up: ' + error)
    }
  }, [email, password, username])
  return (
    <SignUpPagePane>
      <h2 className="title">Sign Up</h2>
      <div className="signin-form">
        <div className="field">
          <Input value={username} onChange={handleUsernameChange} placeholder="username" />
        </div>
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
        <div className="message"></div>
      </div>
      <div className="control-pane">
        <Button>취소</Button>
        <Button onClick={handleSubmit}>회원가입</Button>
      </div>
    </SignUpPagePane>
  )
}
